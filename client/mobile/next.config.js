const withLess = require('@zeit/next-less');
const withCss = require('@zeit/next-css');
const withSass = require('@zeit/next-sass');
const withPlugins = require('next-compose-plugins');
// fix: prevents error when .less files are required by node
if (typeof require !== 'undefined') {
  require.extensions['.less'] = file => {};
  require.extensions['.css'] = (file) => {};
}

module.exports = withPlugins(
    [
        [
            withLess,
            {
                lessLoaderOptions: {
                    modifyVars: {
                        // antd修改默认主题
                        // 'primary-color': '#ff9900'
                        // antd-mobile修改默认主题
                        "brand-primary": "#ff9900",
                        "brand-primary-tap": "#ff9900",
                        "color-text-base": "#333",
                        'border-color-base': '#e8e8e8'
                    },
                    javascriptEnabled: true
                },
            }
        ],
        [
            withSass,
            {
                // cssModules: true,
                // localIdentName: '[name]__[local]_[hash:base64:5]',
                postcssLoaderOptions: {
                    // parser: 'sugarss',
                    config: {
                        ctx: {
                            theme: JSON.stringify(process.env.REACT_APP_THEME)
                        }
                    }
                },
            }
        ],
        [
            withCss,
            {
                serverRuntimeConfig: { // Will only be available on the server side
                    mySecret: 'secret'
                },
                publicRuntimeConfig: { // Will be available on both server and client
                    staticFolder: '/static',
                    mySecret: process.env.MY_SECRET // Pass through env variables
                }
            }
        ]
    ]
)
// module.exports = withLess(
//     withSass(
//         withCss({
//             lessLoaderOptions: {
//                 modifyVars: {
//                     // antd修改默认主题
//                     // 'primary-color': '#ff9900'

//                     // antd-mobile修改默认主题
//                     "brand-primary": "#ff9900",
//                     "brand-primary-tap": "#ff9900",
//                     "color-text-base": "#333",
//                     'border-color-base': '#e8e8e8'
//                 },
//                 javascriptEnabled: true
//             },
//             postcssLoaderOptions: {
//                 // parser: 'sugarss',
//                 config: {
//                     ctx: {
//                         theme: JSON.stringify(process.env.REACT_APP_THEME)
//                     }
//                 }
//             },
//             serverRuntimeConfig: { // Will only be available on the server side
//                 mySecret: 'secret'
//             },
//             publicRuntimeConfig: { // Will be available on both server and client
//                 staticFolder: '/static',
//                 mySecret: process.env.MY_SECRET // Pass through env variables
//             }
//       })
//     )
// );
