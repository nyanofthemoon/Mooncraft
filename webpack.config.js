var webpack = require('webpack');

module.exports = {
    entry: [
        'webpack-dev-server/client?http://localhost:8000',
        'webpack/hot/only-dev-server',
        __dirname + '/client/src/app.jsx'
    ],
    module: {
        loaders: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'react-hot!babel'
        }]
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    output: {
        path: './client/public/js',
        publicPath: '/js/',
        filename: 'app-bundle.js'
    },
    devServer: {
        contentBase: './client/public',
        port: 8000,
        keepAlive: true,
        historyApiFallback: true,
        progress: true,
        watch: true,
        hot: true
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]

};