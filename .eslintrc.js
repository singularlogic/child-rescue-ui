module.exports = {
    root: true,
    env: {
        node: true,
    },
    extends: ['plugin:vue/essential', '@vue/airbnb'],
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'object-curly-newline': 'off',
        'vue/attribute-hyphenation': ['error', 'always'],
        'vue/html-end-tags': 'error',
        'vue/html-indent': ['error', 4],
        indent: ['error', 4],
        'vue/require-default-prop': 'error',
        'vue/require-prop-types': 'error',
        'vue/order-in-components': 'error',
        'newline-per-chained-call': 'off',
        'import/prefer-default-export': 'off',
        'max-len': 'off',
        'no-param-reassign': 'off',
        'no-bitwise': 'off',
        'no-plusplus': 'off',
        'no-underscore-dangle': 'off',
    },
    parserOptions: {
        parser: 'babel-eslint',
    },
};
