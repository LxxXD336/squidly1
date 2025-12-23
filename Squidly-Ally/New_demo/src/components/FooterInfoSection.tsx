// src/components/FooterInfoSection.tsx
import { Linkedin } from "lucide-react";

export default function FooterInfoSection() {
  const year = new Date().getFullYear();

  return (
    <footer
      aria-label="Site footer"
      // 顶部从“白色”开始，向下渐变到米黄→浅紫
      className="relative bg-gradient-to-b from-white via-amber-50/75 to-violet-100"
    >
      {/* 顶部羽化盖层：白 -> 透明，消除接缝（绝对安全） */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 right-0 top-0 h-10"
        style={{
          background:
            "linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)",
        }}
      />

      {/* 内容 */}
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* 1) 品牌 + 邮箱 + 版权 */}
          <div>
            <div className="text-lg font-semibold">Squidly</div>
            <a
              href="mailto:contact@squidly.com.au"
              className="mt-1 block text-sm text-slate-700 hover:underline"
            >
              contact@squidly.com.au
            </a>
            <p className="mt-8 text-xs text-slate-600">© {year} Made by Squidly</p>
          </div>

          {/* 2) Legal */}
          <div>
            <div className="font-semibold">Legal</div>
            <ul className="mt-2 space-y-2 text-sm">
              <li><a href="#privacy" className="hover:underline text-slate-700">Privacy</a></li>
              <li><a href="#terms" className="hover:underline text-slate-700">Terms</a></li>
            </ul>
          </div>

          {/* 3) Support */}
          <div>
            <div className="font-semibold">Support</div>
            <ul className="mt-2 space-y-2 text-sm">
              <li><a href="#contact" className="hover:underline text-slate-700">Contact us</a></li>
              <li><a href="#schedule" className="hover:underline text-slate-700">Schedule a call</a></li>
              <li className="text-slate-700">+61 406 741 714</li>
            </ul>
          </div>

          {/* 4) 地址 + LinkedIn */}
          <div className="lg:text-right">
            <div className="font-semibold">Sydney, NSW 2076</div>
            <div className="mt-2 inline-flex lg:justify-end">
              <a
                href="https://www.linkedin.com"
                aria-label="LinkedIn"
                className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
