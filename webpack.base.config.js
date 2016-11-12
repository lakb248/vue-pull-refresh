/**
 * @file webpack base config file
 */

module.exports = {
    module: {
        loaders: [{
            test: /\.js$/,
            loader: 'babel',
            exclude: /node_modules/
        }, {
            test: /\.vue$/,
            loader: 'vue'
        }]
    },
    resolve: {
        alias: {
            'vue': 'vue/dist/vue.js'
        }
    }
};
