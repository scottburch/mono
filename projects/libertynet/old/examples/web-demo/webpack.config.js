const path = require('path');

module.exports = {
    entry: './src/index.tsx',
    output: {
        publicPath: '',
        filename: 'index.js',
        path: path.resolve(__dirname, 'lib'),
    },
    target: 'web',
    devServer: {
        historyApiFallback: true,
        static: {
            directory: path.join(__dirname, 'lib'),
        },
        port: 9000,

    },
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.ts/,
                loader: 'ts-loader',
                exclude: (path) => path.includes('node_modules') && !path.includes('@libertynet'),
                options: { allowTsInNodeModules: true }
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
        ],

    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
        fallback: {
            "console": require.resolve("console-browserify"),
            "fs": require.resolve("browserify-fs"),
            "path": require.resolve("path-browserify"),
            "module": require.resolve('module'),
            buffer: require.resolve('buffer/'),
        },

    },

    devtool: "source-map",
    optimization: {
        minimize: true,
    }
};