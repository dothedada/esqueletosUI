module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: ['airbnb-base', 'prettier'], // Toma las reglas de estilo de prettier y hace un override sobre las de módulo base, para solucionar posibles conflictos
    overrides: [
        {
            env: {
                node: true,
            },
            files: ['.eslintrc.{js,cjs}'],
            parserOptions: {
                sourceType: 'script',
            },
        },
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    rules: {},
    plugins: ['prettier'], // Se agrega para solucionar conflicto con prettier
};
