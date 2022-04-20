module.exports = {
  purge: {
    enabled: true,
    content: ['./src/components/**/*.tsx']
  },
  prefix: 'abt-tr-',
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        roboto: ['Roboto'],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: []
}
