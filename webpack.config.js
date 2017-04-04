var path = require('path')
var webpack = require('webpack')

module.exports = {
    entry: './public/app/controllers/mainCtrl.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: '/dist'
    },
    // module:{
    //     rules:[
    //         {
    //             test: /\.css$/,
    //             use:[ //first loader will be loaded last, etc
    //                 'style-loader',
    //                 'css-loader'
    //             ]
    //         }
    //     ]
    // },
    // plugins: [
    //     new webpack.optimize.UglifyJsPlugin({
    //         // ...
    //     })
    // ]
}