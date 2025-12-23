/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        gradient: {
          "0%":   { backgroundPosition: "0% 50%" },
          "50%":  { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      },
      animation: {
        // 默认 8s，组件里你用了 inline style 的 animationDuration，会覆盖这里的时长
        gradient: "gradient 8s linear infinite",
        // （可选）用 CSS 变量控制时长：给元素设 --grad-dur:10s;
        // gradient: "gradient var(--grad-dur, 8s) linear infinite",
      },
    },
  },
  plugins: [],
};
