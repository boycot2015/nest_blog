// module.exports = function override(config, env) {
//     // do stuff with the webpack config...
//     return config;
//   };
const { override, fixBabelImports } = require('./node_modules/customize-cra');
module.exports = override(
    fixBabelImports('import', {
        libraryName: 'antd-mobile',
        libraryDirectory: "es",
        style: 'css',
    })
);