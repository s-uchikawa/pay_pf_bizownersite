const purgecss = require("@fullhuman/postcss-purgecss")({
  content: ["./src/components/**/*.tsx"],
  defaultExtractor: content => content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || []
});

module.exports = {
  plugins: [
    require('tailwindcss')('./tailwind.config.js'),
    require('postcss-nested')({
      "bubble": [
        "screen"
      ]
    }),
    require('autoprefixer'),    
    purgecss,
    ...(process.env.NODE_ENV === "production"
      ? [require("cssnano")({
        "preset": [
          "default",
          {
            "mergeRules": false
          }
        ]
      })]
      : [])
  ]
};
