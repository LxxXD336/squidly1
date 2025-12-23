'use client';
import { useEffect, useRef } from 'react';

type Vec3 = { r: number; g: number; b: number };

export default function ScopedSplashCursor({
                                               containerRef,
                                               // ====== 可调参数（已调重、稍大） ======
                                               SIM_RESOLUTION = 96,
                                               DYE_RESOLUTION = 768,
                                               DENSITY_DISSIPATION = 3.0,   // ↓ 想更“厚重”可降到 2.0
                                               VELOCITY_DISSIPATION = 2.0,
                                               PRESSURE = 0.1,
                                               PRESSURE_ITERATIONS = 20,
                                               CURL = 3,
                                               SPLAT_RADIUS = 0.3,         // 主轨迹半径（百分比语义，内部/100）
                                               HOVER_SPLAT_RADIUS = 0.2,   // 进入时的小涟漪半径
                                               SPLAT_FORCE = 1200,          // 轨迹力度
                                               SHADING = true,
                                               COLOR_UPDATE_SPEED = 10,
                                               COLOR_GAIN = 2.0,            // ★ 颜色更重：把染色放大
                                           }: {
    containerRef: React.RefObject<HTMLElement>;
    SIM_RESOLUTION?: number;
    DYE_RESOLUTION?: number;
    DENSITY_DISSIPATION?: number;
    VELOCITY_DISSIPATION?: number;
    PRESSURE?: number;
    PRESSURE_ITERATIONS?: number;
    CURL?: number;
    SPLAT_RADIUS?: number;
    HOVER_SPLAT_RADIUS?: number;
    SPLAT_FORCE?: number;
    SHADING?: boolean;
    COLOR_UPDATE_SPEED?: number;
    COLOR_GAIN?: number;
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const container = containerRef.current!;
        const canvas = canvasRef.current!;
        if (!container || !canvas) return;

        // —— 工具 & 坐标换算（容器限定）——
        const scaleByPixelRatio = (v: number) => Math.floor(v * (window.devicePixelRatio || 1));
        const getLocalPos = (clientX: number, clientY: number) => {
            const rect = container.getBoundingClientRect();
            const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
            const y = Math.min(Math.max(clientY - rect.top, 0), rect.height);
            return { x: scaleByPixelRatio(x), y: scaleByPixelRatio(y) };
        };

        // —— WebGL 上下文 + 回退 ——（省略注释版，稳定可用）
        const params: WebGLContextAttributes = { alpha: true, depth: false, stencil: false, antialias: false, preserveDrawingBuffer: false };
        let gl =
            (canvas.getContext('webgl2', params) as WebGL2RenderingContext | null) ||
            (canvas.getContext('webgl', params) as WebGLRenderingContext | null) ||
            (canvas.getContext('experimental-webgl', params) as WebGLRenderingContext | null);
        if (!gl) return;
        const isWebGL2 = (gl as WebGL2RenderingContext).drawBuffers !== undefined;
        const extColorBufferFloat = isWebGL2 ? (gl as WebGL2RenderingContext).getExtension('EXT_color_buffer_float') : null;
        const extHalfFloat = !isWebGL2 ? gl.getExtension('OES_texture_half_float') : null;
        const extLinear =
            (gl.getExtension('OES_texture_float_linear') || gl.getExtension('OES_texture_half_float_linear')) || null;
        let texType: number = isWebGL2 ? (gl as any).HALF_FLOAT : (extHalfFloat ? (extHalfFloat as any).HALF_FLOAT_OES : gl.UNSIGNED_BYTE);

        const supportRT = (internalFormat: number, format: number, type: number) => {
            try {
                const tex = gl.createTexture()!;
                gl.bindTexture(gl.TEXTURE_2D, tex);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);
                const fbo = gl.createFramebuffer()!;
                gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
                gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
                return gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
            } catch { return false; }
        };
        const getFmt = (ifmt: number, fmt: number, type: number) => supportRT(ifmt, fmt, type) ? { internalFormat: ifmt, format: fmt } : null;

        let rgba = isWebGL2 && extColorBufferFloat ? getFmt((gl as any).RGBA16F, gl.RGBA, texType) : null;
        let rg   = isWebGL2 && extColorBufferFloat ? getFmt((gl as any).RG16F,  (gl as any).RG, texType) : null;
        let r    = isWebGL2 && extColorBufferFloat ? getFmt((gl as any).R16F,   (gl as any).RED, texType) : null;

        if (!rgba || !rg || !r || texType == null) {  // 回退
            rgba = { internalFormat: gl.RGBA, format: gl.RGBA };
            rg   = { internalFormat: gl.RGBA, format: gl.RGBA };
            r    = { internalFormat: gl.RGBA, format: gl.RGBA };
            texType = gl.UNSIGNED_BYTE;
        }
        const filtering = extLinear ? gl.LINEAR : gl.NEAREST;

        // —— 着色器/Program（与之前一致，略去冗长注释）——
        const compile = (type: number, src: string) => { const sh = gl.createShader(type)!; gl.shaderSource(sh, src); gl.compileShader(sh); return sh; };
        const link = (vs: WebGLShader, fs: WebGLShader) => { const p = gl.createProgram()!; gl.attachShader(p, vs); gl.attachShader(p, fs); gl.bindAttribLocation(p, 0, 'aPosition'); gl.linkProgram(p); return p; };
        const baseVS = compile(gl.VERTEX_SHADER, `
      precision highp float; attribute vec2 aPosition;
      varying vec2 vUv,vL,vR,vT,vB; uniform vec2 texelSize;
      void main(){ vUv=aPosition*0.5+0.5; vL=vUv-vec2(texelSize.x,0.0); vR=vUv+vec2(texelSize.x,0.0);
        vT=vUv+vec2(0.0,texelSize.y); vB=vUv-vec2(0.0,texelSize.y); gl_Position=vec4(aPosition,0.,1.); }`);
        const fsCopy = compile(gl.FRAGMENT_SHADER, `precision mediump float; varying vec2 vUv; uniform sampler2D uTexture; void main(){ gl_FragColor=texture2D(uTexture,vUv); }`);
        const fsClear = compile(gl.FRAGMENT_SHADER, `precision mediump float; varying vec2 vUv; uniform sampler2D uTexture; uniform float value; void main(){ gl_FragColor=value*texture2D(uTexture,vUv);} `);
        const fsDisplay = compile(gl.FRAGMENT_SHADER, `
      precision highp float; varying vec2 vUv,vL,vR,vT,vB; uniform sampler2D uTexture; uniform vec2 texelSize;
      void main(){ vec3 c=texture2D(uTexture,vUv).rgb;
        ${SHADING ? `
        vec3 lc=texture2D(uTexture,vL).rgb, rc=texture2D(uTexture,vR).rgb, tc=texture2D(uTexture,vT).rgb, bc=texture2D(uTexture,vB).rgb;
        float dx=length(rc)-length(lc), dy=length(tc)-length(bc);
        vec3 n=normalize(vec3(dx,dy,length(texelSize))); float diffuse=clamp(dot(n,vec3(0,0,1))+0.7,0.7,1.0); c*=diffuse;` : ``}
        float a=max(c.r,max(c.g,c.b)); gl_FragColor=vec4(c,a); }`);
        const fsSplat = compile(gl.FRAGMENT_SHADER, `
      precision highp float; varying vec2 vUv; uniform sampler2D uTarget; uniform float aspectRatio; uniform vec3 color; uniform vec2 point; uniform float radius;
      void main(){ vec2 p=vUv-point.xy; p.x*=aspectRatio; vec3 splat=exp(-dot(p,p)/radius)*color; vec3 base=texture2D(uTarget,vUv).xyz; gl_FragColor=vec4(base+splat,1.0);} `);
        const fsAdvect = compile(gl.FRAGMENT_SHADER, `
      precision highp float; varying vec2 vUv; uniform sampler2D uVelocity,uSource; uniform vec2 texelSize,dyeTexelSize; uniform float dt,dissipation;
      vec4 bilerp(sampler2D s, vec2 uv, vec2 ts){ vec2 st=uv/ts-0.5, i=floor(st), f=fract(st);
        vec4 a=texture2D(s,(i+vec2(.5,.5))*ts), b=texture2D(s,(i+vec2(1.5,.5))*ts),
             c=texture2D(s,(i+vec2(.5,1.5))*ts), d=texture2D(s,(i+vec2(1.5,1.5))*ts);
        return mix(mix(a,b,f.x),mix(c,d,f.x),f.y); }
      void main(){ vec2 coord=vUv - dt*texture2D(uVelocity,vUv).xy*texelSize; vec4 result=texture2D(uSource,coord);
        float decay=1.0 + dissipation*dt; gl_FragColor=result/decay; }`);
        const fsDiv = compile(gl.FRAGMENT_SHADER, `
      precision mediump float; varying vec2 vUv,vL,vR,vT,vB; uniform sampler2D uVelocity;
      void main(){ float L=texture2D(uVelocity,vL).x,R=texture2D(uVelocity,vR).x,T=texture2D(uVelocity,vT).y,B=texture2D(uVelocity,vB).y;
        vec2 C=texture2D(uVelocity,vUv).xy; if(vL.x<0.)L=-C.x; if(vR.x>1.)R=-C.x; if(vT.y>1.)T=-C.y; if(vB.y<0.)B=-C.y;
        float div=0.5*(R-L+T-B); gl_FragColor=vec4(div,0.,0.,1.);} `);
        const fsCurl = compile(gl.FRAGMENT_SHADER, `
      precision mediump float; varying vec2 vUv,vL,vR,vT,vB; uniform sampler2D uVelocity;
      void main(){ float L=texture2D(uVelocity,vL).y,R=texture2D(uVelocity,vR).y,T=texture2D(uVelocity,vT).x,B=texture2D(uVelocity,vB).x;
        float vort=R-L-T+B; gl_FragColor=vec4(0.5*vort,0.,0.,1.);} `);
        const fsVort = compile(gl.FRAGMENT_SHADER, `
      precision highp float; varying vec2 vUv,vL,vR,vT,vB; uniform sampler2D uVelocity,uCurl; uniform float curl,dt;
      void main(){ float L=texture2D(uCurl,vL).x,R=texture2D(uCurl,vR).x,T=texture2D(uCurl,vT).x,B=texture2D(uCurl,vB).x,C=texture2D(uCurl,vUv).x;
        vec2 force=0.5*vec2(abs(T)-abs(B),abs(R)-abs(L)); force/=length(force)+.0001; force*=curl*C; force.y*=-1.;
        vec2 vel=texture2D(uVelocity,vUv).xy; vel+=force*dt; vel=clamp(vel,vec2(-1000.),vec2(1000.)); gl_FragColor=vec4(vel,0.,1.);} `);
        const fsPressure = compile(gl.FRAGMENT_SHADER, `
      precision mediump float; varying vec2 vUv,vL,vR,vT,vB; uniform sampler2D uPressure,uDivergence;
      void main(){ float L=texture2D(uPressure,vL).x,R=texture2D(uPressure,vR).x,T=texture2D(uPressure,vT).x,B=texture2D(uPressure,vB).x;
        float divergence=texture2D(uDivergence,vUv).x; float p=(L+R+B+T - divergence)*0.25; gl_FragColor=vec4(p,0.,0.,1.);} `);
        const fsGradSub = compile(gl.FRAGMENT_SHADER, `
      precision mediump float; varying vec2 vUv,vL,vR,vT,vB; uniform sampler2D uPressure,uVelocity;
      void main(){ float L=texture2D(uPressure,vL).x,R=texture2D(uPressure,vR).x,T=texture2D(uPressure,vT).x,B=texture2D(uPressure,vB).x;
        vec2 vel=texture2D(uVelocity,vUv).xy; vel.xy-=vec2(R-L,T-B); gl_FragColor=vec4(vel,0.,1.);} `);

        const prog = (fs: WebGLShader) => {
            const p = link(baseVS, fs); const u: Record<string, WebGLUniformLocation> = {};
            const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
            for (let i=0;i<n;i++){ const name = gl.getActiveUniform(p,i)!.name; u[name]=gl.getUniformLocation(p,name)!; }
            return { p, u };
        };
        const copy = prog(fsCopy), clear = prog(fsClear), splat = prog(fsSplat), advect = prog(fsAdvect),
            div = prog(fsDiv), curlProg = prog(fsCurl), vort = prog(fsVort), pressure = prog(fsPressure), gradSub = prog(fsGradSub),
            display = prog(fsDisplay);

        const vbo = gl.createBuffer()!; gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,-1,1,1,1,1,-1]), gl.STATIC_DRAW);
        const ebo = gl.createBuffer()!; gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0,1,2,0,2,3]), gl.STATIC_DRAW);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0); gl.enableVertexAttribArray(0);

        // —— FBO ——（含兜底）
        const createFBO = (w:number,h:number,ifmt:number,fmt:number,type:number,param:number) => {
            const tex=gl.createTexture()!; gl.bindTexture(gl.TEXTURE_2D,tex);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,param);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER,param);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texImage2D(gl.TEXTURE_2D,0,ifmt,w,h,0,fmt,type,null);
            const fbo=gl.createFramebuffer()!; gl.bindFramebuffer(gl.FRAMEBUFFER,fbo);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
            if (gl.checkFramebufferStatus(gl.FRAMEBUFFER)!==gl.FRAMEBUFFER_COMPLETE) {
                gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,w,h,0,gl.RGBA,gl.UNSIGNED_BYTE,null);
            }
            gl.viewport(0,0,w,h); gl.clear(gl.COLOR_BUFFER_BIT);
            return { texture: tex, fbo, width:w, height:h, texelSizeX:1/w, texelSizeY:1/h,
                attach(id:number){ gl.activeTexture(gl.TEXTURE0+id); gl.bindTexture(gl.TEXTURE_2D,tex); return id; } };
        };
        const createDouble = (w:number,h:number,ifmt:number,fmt:number,type:number,param:number) => {
            let a=createFBO(w,h,ifmt,fmt,type,param), b=createFBO(w,h,ifmt,fmt,type,param);
            return { width:w,height:h, texelSizeX:a.texelSizeX, texelSizeY:a.texelSizeY,
                get read(){return a;}, set read(v){a=v;}, get write(){return b;}, set write(v){b=v;}, swap(){const t=a;a=b;b=t;} };
        };
        const getRes = (res:number) => {
            let ar = canvas.width / canvas.height; if (ar < 1) ar = 1/ar;
            const min = Math.round(res), max = Math.round(res*ar);
            return canvas.width>canvas.height ? {width:max,height:min}:{width:min,height:max};
        };

        let dye:any, velocity:any, divergence:any, curl:any, press:any;

        const resizeTargets = () => {
            const sim = getRes(SIM_RESOLUTION), dyeR = getRes(DYE_RESOLUTION);
            gl.disable(gl.BLEND);
            dye = dye ? (dye.width===dyeR.width && dye.height===dyeR.height ? dye : createDouble(dyeR.width,dyeR.height,rgba!.internalFormat,rgba!.format,texType,filtering))
                : createDouble(dyeR.width,dyeR.height,rgba!.internalFormat,rgba!.format,texType,filtering);
            velocity = velocity ? (velocity.width===sim.width && velocity.height===sim.height ? velocity : createDouble(sim.width,sim.height,rg!.internalFormat,(isWebGL2?(gl as any).RG:gl.RGBA),texType,filtering))
                : createDouble(sim.width,sim.height,rg!.internalFormat,(isWebGL2?(gl as any).RG:gl.RGBA),texType,filtering);
            divergence = createFBO(sim.width,sim.height,r!.internalFormat,(isWebGL2?(gl as any).RED:gl.RGBA),texType,gl.NEAREST);
            curl       = createFBO(sim.width,sim.height,r!.internalFormat,(isWebGL2?(gl as any).RED:gl.RGBA),texType,gl.NEAREST);
            press      = createDouble(sim.width,sim.height,r!.internalFormat,(isWebGL2?(gl as any).RED:gl.RGBA),texType,gl.NEAREST);
        };

        const setViewport = (t?:any) => { if (!t){ gl.viewport(0,0,gl.drawingBufferWidth,gl.drawingBufferHeight); gl.bindFramebuffer(gl.FRAMEBUFFER,null); }
        else { gl.viewport(0,0,t.width,t.height); gl.bindFramebuffer(gl.FRAMEBUFFER,t.fbo);} };
        const drawFull = (t?:any) => { setViewport(t); gl.drawElements(gl.TRIANGLES,6,gl.UNSIGNED_SHORT,0); };

        // —— 尺寸随容器 —— //
        const resizeCanvasToContainer = () => {
            const w = scaleByPixelRatio(container.clientWidth);
            const h = scaleByPixelRatio(container.clientHeight);
            if (canvas.width!==w || canvas.height!==h){ canvas.width=w; canvas.height=h; gl.viewport(0,0,w,h); return true; }
            return false;
        };
        resizeCanvasToContainer(); resizeTargets();

        // —— 颜色 & 悬停 —— //
        const HSVtoRGB = (h:number,s:number,v:number):Vec3 => {
            let r=0,g=0,b=0,i=Math.floor(h*6),f=h*6-i,p=v*(1-s),q=v*(1-f*s),t=v*(1-(1-f)*s);
            switch(i%6){case 0:r=v;g=t;b=p;break;case 1:r=q;g=v;b=p;break;case 2:r=p;g=v;b=t;break;case 3:r=p;g=q;b=v;break;case 4:r=t;g=p;b=v;break;case 5:r=v;g=p;b=q;break;} return {r,g,b};
        };
        const genColor = ():Vec3 => {
            const c = HSVtoRGB(Math.random(), 1, 1);
            // 默认加深：把原 0.15 提到 0.30，再整体乘 COLOR_GAIN
            return { r: c.r * 0.30 * COLOR_GAIN, g: c.g * 0.30 * COLOR_GAIN, b: c.b * 0.30 * COLOR_GAIN };
        };
        const correctRadius = (r:number) => { let ar = canvas.width/canvas.height; if (ar>1) r*=ar; return r; };

        const splatOp = (x:number,y:number,dx:number,dy:number,color:Vec3, radiusNorm:number) => {
            gl.useProgram(splat.p);
            gl.uniform1i(splat.u.uTarget, velocity.read.attach(0));
            gl.uniform1f(splat.u.aspectRatio, canvas.width/canvas.height);
            gl.uniform2f(splat.u.point, x, y);
            gl.uniform3f(splat.u.color, dx, dy, 0);
            gl.uniform1f(splat.u.radius, correctRadius(radiusNorm/100.0));
            drawFull(velocity.write); velocity.swap();

            gl.uniform1i(splat.u.uTarget, dye.read.attach(0));
            gl.uniform3f(splat.u.color, color.r, color.g, color.b);
            drawFull(dye.write); dye.swap();
        };

        const pointer = { down:false, moved:false, color: genColor(), texcoordX:0, texcoordY:0, prevTexcoordX:0, prevTexcoordY:0, deltaX:0, deltaY:0 };

        const updatePointerMove = (clientX:number, clientY:number) => {
            const { x, y } = getLocalPos(clientX, clientY);
            pointer.prevTexcoordX = pointer.texcoordX; pointer.prevTexcoordY = pointer.texcoordY;
            pointer.texcoordX = x / canvas.width; pointer.texcoordY = 1 - (y / canvas.height);
            pointer.deltaX = pointer.texcoordX - pointer.prevTexcoordX;
            pointer.deltaY = pointer.texcoordY - pointer.prevTexcoordY;
            pointer.moved = Math.abs(pointer.deltaX) > 0 || Math.abs(pointer.deltaY) > 0;
        };

        const hoverSplat = () => splatOp(pointer.texcoordX, pointer.texcoordY, 0, 0, pointer.color, HOVER_SPLAT_RADIUS);
        const moveSplat  = () => splatOp(pointer.texcoordX, pointer.texcoordY, pointer.deltaX*SPLAT_FORCE, pointer.deltaY*SPLAT_FORCE, pointer.color, SPLAT_RADIUS);

        // —— 主循环 —— //
        let last = performance.now(), raf = 0;
        const frame = () => {
            const now = performance.now(), dt = Math.min((now-last)/1000, 1/60); last = now;
            if (resizeCanvasToContainer()) resizeTargets();

            gl.disable(gl.BLEND);
            gl.useProgram(curlProg.p);
            gl.uniform2f(curlProg.u.texelSize, velocity.texelSizeX, velocity.texelSizeY);
            gl.uniform1i(curlProg.u.uVelocity, velocity.read.attach(0));
            drawFull(curl);

            gl.useProgram(vort.p);
            gl.uniform2f(vort.u.texelSize, velocity.texelSizeX, velocity.texelSizeY);
            gl.uniform1i(vort.u.uVelocity, velocity.read.attach(0));
            gl.uniform1i(vort.u.uCurl, curl.attach(1));
            gl.uniform1f(vort.u.curl, CURL);
            gl.uniform1f(vort.u.dt, dt);
            drawFull(velocity.write); velocity.swap();

            gl.useProgram(div.p);
            gl.uniform2f(div.u.texelSize, velocity.texelSizeX, velocity.texelSizeY);
            gl.uniform1i(div.u.uVelocity, velocity.read.attach(0));
            drawFull(divergence);

            gl.useProgram(clear.p);
            gl.uniform1i(clear.u.uTexture, press.read.attach(0));
            gl.uniform1f(clear.u.value, PRESSURE);
            drawFull(press.write); press.swap();

            gl.useProgram(pressure.p);
            gl.uniform2f(pressure.u.texelSize, velocity.texelSizeX, velocity.texelSizeY);
            gl.uniform1i(pressure.u.uDivergence, divergence.attach(0));
            for(let i=0;i<PRESSURE_ITERATIONS;i++){ gl.uniform1i(pressure.u.uPressure, press.read.attach(1)); drawFull(press.write); press.swap(); }

            gl.useProgram(gradSub.p);
            gl.uniform2f(gradSub.u.texelSize, velocity.texelSizeX, velocity.texelSizeY);
            gl.uniform1i(gradSub.u.uPressure, press.read.attach(0));
            gl.uniform1i(gradSub.u.uVelocity, velocity.read.attach(1));
            drawFull(velocity.write); velocity.swap();

            gl.useProgram(advect.p);
            gl.uniform2f(advect.u.texelSize, velocity.texelSizeX, velocity.texelSizeY);
            gl.uniform1i(advect.u.uVelocity, velocity.read.attach(0));
            gl.uniform1i(advect.u.uSource, velocity.read.attach(0));
            gl.uniform1f(advect.u.dt, dt);
            gl.uniform1f(advect.u.dissipation, VELOCITY_DISSIPATION);
            drawFull(velocity.write); velocity.swap();

            gl.uniform1i(advect.u.uVelocity, velocity.read.attach(0));
            gl.uniform1i(advect.u.uSource, dye.read.attach(1));
            gl.uniform1f(advect.u.dissipation, DENSITY_DISSIPATION);
            drawFull(dye.write); dye.swap();

            gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
            gl.enable(gl.BLEND);
            gl.useProgram(display.p);
            gl.uniform1i(display.u.uTexture, dye.read.attach(0));
            gl.uniform2f(display.u.texelSize, 1/gl.drawingBufferWidth, 1/gl.drawingBufferHeight);
            setViewport(null); drawFull();

            raf = requestAnimationFrame(frame);
        };

        // —— 只在容器里监听（区域限定）——
        const onEnter = (e: MouseEvent) => { const { x, y } = getLocalPos(e.clientX, e.clientY); updatePointerMove(e.clientX, e.clientY); hoverSplat(); if (!raf) raf = requestAnimationFrame(frame); };
        const onMove  = (e: MouseEvent) => { updatePointerMove(e.clientX, e.clientY); if (pointer.moved) moveSplat(); };
        const onLeave = () => { /* 可选：停止动画；保留也行*/ };

        container.addEventListener('mouseenter', onEnter);
        container.addEventListener('mousemove', onMove);
        container.addEventListener('mouseleave', onLeave);

        const ro = new ResizeObserver(() => resizeCanvasToContainer());
        ro.observe(container);

        return () => {
            cancelAnimationFrame(raf);
            ro.disconnect();
            container.removeEventListener('mouseenter', onEnter);
            container.removeEventListener('mousemove', onMove);
            container.removeEventListener('mouseleave', onLeave);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        };
    }, [
        containerRef,
        SIM_RESOLUTION, DYE_RESOLUTION, DENSITY_DISSIPATION, VELOCITY_DISSIPATION,
        PRESSURE, PRESSURE_ITERATIONS, CURL,
        SPLAT_RADIUS, HOVER_SPLAT_RADIUS, SPLAT_FORCE, SHADING, COLOR_UPDATE_SPEED, COLOR_GAIN,
    ]);

    // 画布覆盖“容器内部”且不拦截事件
    return (
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
            <canvas ref={canvasRef} style={{ width: '100%', height: '100%', background: 'transparent' }} />
        </div>
    );
}
