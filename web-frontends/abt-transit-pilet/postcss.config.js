//postcss.config.js
const tailwindcss = require("tailwindcss");
const autoprefixer = require("autoprefixer");

const purgecss = require("@fullhuman/postcss-purgecss")({
  content: ["./src/components/**/*.tsx"],
  defaultExtractor: content => content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || []
});

module.exports = {
  plugins: [
    tailwindcss("./tailwind.config.js"),
    autoprefixer(),
    purgecss,
    ...(process.env.STAGE_ENV != "local"
      ? [require("cssnano")]
      : [])
  ]
};