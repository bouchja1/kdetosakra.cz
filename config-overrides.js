const { override, fixBabelImports, addLessLoader } = require('customize-cra');

module.exports = override(
    fixBabelImports('import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
    }),
    addLessLoader({
        javascriptEnabled: true,
        modifyVars: {
            '@primary-color': '#c80707',
            '@font-size-base': '16px',
            '@layout-body-background': '#fff',
            '@layout-footer-background': '#fff',
        },
    }),
);
