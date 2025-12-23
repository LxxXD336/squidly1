// postcss.config.js
export default {
  plugins: {
    '@tailwindcss/postcss': {}, // ← v4 必须用这个
    autoprefixer: {},
  },
}