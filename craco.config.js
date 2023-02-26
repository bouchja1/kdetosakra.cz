const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const WebpackBar = require('webpackbar');
const CracoLessPlugin = require('craco-less');

// Don't open the browser during development
process.env.BROWSER = 'none';

module.exports = {
    typescript: {
        enableTypeChecking: true /* (default value) */,
    },
    babel: {
        plugins: ['babel-plugin-styled-components'],
    },
    plugins: [
        {
            plugin: CracoLessPlugin,
            options: {
                lessLoaderOptions: {
                    lessOptions: {
                        // List of default variables: https://github.com/ant-design/ant-design/blob/4.x-stable/components/style/themes/default.less
                        modifyVars: {
                            '@primary-color': '#c80707',
                            '@font-size-base': '16px',
                            '@layout-body-background': '#fff',
                            '@layout-footer-background': '#fff',
                            '@border-radius-base': '4px',
                        },
                        javascriptEnabled: true,
                        // strictMath: true,
                        // noIeCompat: true,
                    },
                },
                /*
                cssLoaderOptions: {
                    modules: true,
                    localIdentName: '[local]_[hash:base64:5]',
                },
                 */
                babelPluginImportOptions: {
                    libraryDirectory: 'es',
                },
            },
        },
    ],
    webpack: {
        plugins: [
            new WebpackBar({ profile: true }),
            ...(process.env.NODE_ENV === 'development' ? [new BundleAnalyzerPlugin({ openAnalyzer: false })] : []),
        ],
        configure: {
            // https://stackoverflow.com/a/69255531/1281305
            module: {
                rules: [
                    {
                        test: /\.m?js$/,
                        resolve: {
                            fullySpecified: false,
                            fallback: { "querystring": require.resolve("querystring-es3"), "stream": require.resolve("stream-browserify") }
                        },
                    },
                ],
            },
            // https://github.com/facebook/create-react-app/discussions/11767#discussioncomment-2421668
            ignoreWarnings: [
                function ignoreSourcemapsloaderWarnings(warning) {
                    return (
                        warning.module &&
                        warning.module.resource.includes('node_modules') &&
                        warning.details &&
                        warning.details.includes('source-map-loader')
                    );
                },
            ],
        },
    },
};
