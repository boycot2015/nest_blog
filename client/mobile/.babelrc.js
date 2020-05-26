const path = require('path')
const context = path.resolve(__dirname, 'src')
module.exports = {
    "presets": ["next/babel"],
    "plugins": [
      // 可以使用装饰器decorator
      ["@babel/plugin-proposal-decorators", { "legacy": true }], 
  
      // 让我们可以使用根路径，避免相对路径的混乱，如import Head from '@/components/Head'
      [
        "module-resolver",
        {
            "alias": {
                "@": __dirname,
                "@/*": ["./*"],
                "@components/*": ["components/*"],
            }
        }
    ],
  
      // 按需加载并且可以使用less的配置
      [
        "import",
        {
          "libraryName": "antd-mobile",
          "style": true
        }
      ]
    ]
}