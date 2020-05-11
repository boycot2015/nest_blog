module.exports = {
    plugins: [
    //   require('postcss-flexbugs-fixes'),
    //   require('postcss-preset-env')({
    //     autoprefixer: {
    //       flexbox: 'no-2009'
    //     },
    //     stage: 3
    //   }),
      require('postcss-pxtorem')({
        rootValue: 100,
        unitPrecision: 5,
        mediaQuery: false,
        minPixelValue: 0,
        propList: [
          '*background*',
          '*padding*',
          '*margin*',
          'letter-spacing',
          '*width',
        //   '*height',
          'left',
          'font*',
          'right',
          'top',
          'bottom'
        ]
      }),
      require('tailwindcss'),
      require('autoprefixer')
    ]
}