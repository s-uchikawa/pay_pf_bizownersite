const plugin = require('tailwindcss/plugin')

module.exports = {
  purge: {
    enabled: true,
    content: ['./src/components/**/*.tsx']
  },
  prefix: 'pbo-',
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {
    },
  },
  plugins: [
    plugin(function({ addUtilities }) {
      const newUtilities = {
        '.sticky-header': {
          borderCollapse: 'separate',
          borderSpacing: '0px',
          th: {
            top: 0,
            position: 'sticky',
            backgroundColor: 'white',
          },
        },
        '.sticky-footer':{
          tfoot: {
            position:'sticky',
            bottom:0,
            backgroundColor: 'white',
          },
        },
      };

      addUtilities(newUtilities)
    })
  ],
}
