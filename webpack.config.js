const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
module.exports = {
    mode: "development", // 构建模式
    entry: "./src/index.ts", // 构建入口
    // entry: {
    //     main: './src/index.ts'
    // },
    output: {
        path: path.resolve(__dirname, 'dist/[hash]'), // 指定构建生成文件的路径;路径中使用 hash，每次构建时会有一个不同 hash 值，可以用于避免发布新版本时浏览器缓存导致代码没有更新
        filename: '[name].js', // 指定构建生成文件名,使用name可用于获取entry名字以配置
    },
    // 本地化开发
    devServer: {
        static: path.resolve(__dirname, 'dist') // contentBase已经被废弃
    },
    module: {
        rules: [
            {
                test: /\.less$/,
                use: [
                    'style-loader', // 样式注入，普通的代码没有必要引入
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'less-loader'
                ],
                include: [
                    resolve('src')
                ]
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader'
                ]
            },
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env']
                        }
                    },
                    'ts-loader',
                ],
                exclude: "/node_modules/"
            },
            {
                // 处理图片
                test: /\.(png|jpg|gif)$/,
                use: [
                    'file-loader' // url-loader 的区别
                ]
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    plugins: [
        //关联HTML，构建时，html-webpack-plugin会为我们创建一个HTML文件，而若是不符合预期模板时，可以自定义模板，使用template传入
        new HtmlWebpackPlugin(
            {
                template: 'src/index.html' // 配置文件模板
            }
        )
    ]
}
