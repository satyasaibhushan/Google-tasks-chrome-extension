var path = require('path')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var {CleanWebpackPlugin} = require('clean-webpack-plugin')

var SRC_DIR = path.resolve(__dirname,"src")

module.exports ={
    entry:'./src/js/index.js',
    output:{
        path:path.resolve(__dirname,'dist'),
        filename:"bundle.js",
        // publicPath:'/dist'
    },
    module:{
        rules:[
            {
                test:/\.js$/,
                include: SRC_DIR,
                loader:"babel-loader",
                query:{
                    presets:["@babel/env","@babel/react"]
                }
            },
            {
                test:/\.css$/,
                use:[
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test:/\.html$/,
                use:['html-loader']
            },
            {
                test:/\.(jpg|jpeg|gif|png|svg|webp)$/,
                use:[
                    {
                        loader:'file-loader',
                        options:{
                            name:'[name].[ext]',
                            outputPath:'img/',
                            publicPath:'img/'
                        }
                    }
                ]
            }
        ]
    },
    devServer:{
        port:1234,
        contentBase:'src',
        hot:true,
        inline:true
    },
    plugins:[
        new HtmlWebpackPlugin({
            template:'src/index.html'
        }),
        // new CleanWebpackPlugin()
    ]
}