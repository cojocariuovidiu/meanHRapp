var path = require('path')
var webpack = require('webpack')

module.exports = {
    entry: './public/app/app.js',
    output: {
        path: path.resolve(__dirname, 'public/dist'),
        filename: 'bundle.js',
        publicPath: '/public/dist'
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