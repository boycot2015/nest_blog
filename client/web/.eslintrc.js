module.exports = {
    root: true,
    env: {
        browser: true,
        node: true
    },
    parserOptions: {
        parser: 'babel-eslint'
    },
    extends: [
        '@nuxtjs',
        'plugin:nuxt/recommended',

        // 采用vue eslint进行代码校验
        // 'plugin:prettier/recommended',
        // 'prettier',
        // 'prettier/vue',
        'plugin:vue/essential',
        'eslint:recommended'
    ],
    // add your custom rules here
    // 0 = off, 1 = warn, 2 = error
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'nuxt/no-cjs-in-config': 'off',
        indent: ['error', 4],
        'prefer-const': 0,
        curly: 0,
        'no-var': 0,
        'import/order': 0,
        'arrow-parens': 0,
        'vue/html-closing-bracket-spacing': 0,
        'vue/html-self-closing': 0,
        'object-shorthand': 0,
        'import/no-mutable-exports': 0,
        'no-useless-catch': 0,
        'vue/html-indent': 0,
        'vue/attributes-order': 0,
        'vue/singleline-html-element-content-newline': 0,
        'vue/order-in-components': 0,
        'vue/name-property-casing': 0,
        'vue/no-v-html': 0,
        'vue/require-default-prop': 0,
        'no-new': 0,
        'space-before-function-paren': ['error', {
            anonymous: 'always',
            named: 'always',
            asyncArrow: 'always'
        }],
        'vue/multiline-html-element-content-newline': 0,
        'no-unused-vars': 'off',
        'require-atomic-updates': 'off',
        'no-useless-escape': 'off'
    }
}
