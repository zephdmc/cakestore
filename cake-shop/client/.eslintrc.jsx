module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    extends: [
        'airbnb',
        'airbnb/hooks',
        'plugin:react/recommended',
        'plugin:jsx-a11y/recommended',
    ],
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    plugins: ['react', 'react-hooks'],
    rules: {
        'react/react-in-jsx-scope': 'off',
        'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
        'react/function-component-definition': [
            2,
            {
                namedComponents: 'arrow-function',
                unnamedComponents: 'arrow-function',
            },
        ],
        'import/prefer-default-export': 'off',
        'react/prop-types': 'off',
        'jsx-a11y/anchor-is-valid': 'off',
        'react/jsx-props-no-spreading': 'off',
        'no-param-reassign': 'off',
        'import/no-cycle': 'off',
        'consistent-return': 'off',
        'arrow-body-style': 'off',
        'react/jsx-no-useless-fragment': 'off',
        'no-nested-ternary': 'off',
        'max-len': ['error', { code: 120 }],
        'linebreak-style': 'off',
        'react/jsx-one-expression-per-line': 'off',
    },
    settings: {
        'import/resolver': {
            node: {
                extensions: ['.js', '.jsx'],
                moduleDirectory: ['node_modules', 'src/'],
            },
        },
    },
};