//postcss.config.js
const tailwindcss = require("tailwindcss");
const autoprefixer = require("autoprefixer");

const purgecss = require("@fullhuman/postcss-purgecss")({
  content: ["./src/**/*.tsx","./src/**/*.css", "./src/index.html"],
  defaultExtractor: content => content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || []
});

module.exports = {
  plugins: [
    tailwindcss("./tailwind.config.js"),
    autoprefixer(),
    purgecss,
    ...(process.env.NODE_ENV === "production"
      ? [require("cssnano")]
      : [])
  ]
};