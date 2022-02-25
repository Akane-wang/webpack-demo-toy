const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    mode: "development", // 构建模式
    entry: "./src/index.js", // 构建入口
    output: {
        path: path.resolve(__dirname, 'dist/[hash]'), // 指定构建生成文件的路径;路径中使用 hash，每次构建时会有一个不同 hash 值，可以用于避免发布新版本时浏览器缓存导致代码没有更新
        filename: '[name].js', // 指定构建生成文件名,使用name可用于获取entry名字以配置
    },
    "devServer": {
        static: path.resolve(__dirname, 'dist') // contentBase已经被废弃
    },
    plugins: [
        new HtmlWebpackPlugin(
            {
                template: 'src/index.html'
            }
        )
    ]
}