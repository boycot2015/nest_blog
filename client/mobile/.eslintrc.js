module.exports = {
    'extends': [
        'plugin:vue/essential',
        '@vue/standard'
        // "eslint:recommended",
        // "plugin:vue/recommended"
    ],
    // "off" -> 0 关闭规则
    // "warn" -> 1 开启警告规则
    // "error" -> 2 开启错误规则
    rules: {
        // "no-alert": 0,
        // "no-multi-spaces": "error", // 禁止多个空格   
        "quotes": ["error", "single"], // 使用单引号
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'tabWidth': ['error', 4],
        'indent': ['error', 4],
        'no-mixed-spaces-and-tabs': [2, false] // 禁止混用tab和空格
    },
    parserOptions: {
        // //此项是用来指定eslint解析器的，解析器必须符合规则，babel-eslint解析器是对babel解析器的包装使其与ESLint解析
        parser: 'babel-eslint'
    }
}
