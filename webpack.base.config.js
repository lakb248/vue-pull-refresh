/**
 * @file webpack base config file
 */
var webpack = require('webpack');

module.exports = {
    module: {
        loaders: [{
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/
        }, {
            test: /\.vue$/,
            loader: 'vue-loader'
        }, {
            test: /\.(png|jpg)$/,
            loader: 'url-loader?limit=8192'
        }]
    },
    resolve: {
        alias: {
            'vue': 'vue/dist/vue.js'
        }
    },
    plugins: [
        new webpack.LoaderOptionsPlugin({
            vue: {
                postcss: [require('postcss-cssnext')({browsers: [
                    '> 1%', 'last 5 Android versions', 'last 5 iOS versions']})]
            }
        })
    ]
};
