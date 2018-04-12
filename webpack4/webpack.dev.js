const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist',
        hot: true,
        compress: true,
        port: 9000
    },
    mode: 'development',
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
});