# 如何使用webpack整一个demo
- 新建一个文件夹并进入该文件夹
``` mkdir webpack && cd webpack```
  - 使用npm init 创建一个【package.json】文件用于管理项目版本和依赖
  - 使用git init 创建一个git管理，让项目有备案
- 安装webpack和webpack-cli
  - webpack-cli
    - webpack-cli是使用webpack的命令工具，4.x版本以后不再作为webpack的依赖，因此需要额外安装
    - 作用：
      - 启动webpack
  - webpack
    - 指定依赖的版本，不同项目不同版本得以实现
    - clone后可以快速使用npm或yarn安装依赖的webpack
    - 协作时，避免出现webpack版本不同而导致不兼容问题
- 构建
- npx webpack / npm run build(将webpack作为命令写进script里)
  - 自定义配置以构建
    - 配置的webpack.config.js的本质是一个node脚本，因此配置一些属性即可开发
    - 基础配置
      - 构建模式：mode
      - 构建入口：entry
        - 单页面应用
          - 入口仅一个
            ```
                entry: './src/index.js'
                // 等同于
                entry: {
                    main: './src/index.js'
                }
            ```
          - 多个文件作为一个入口配置
            ```
                entry: {
                    main: [
                        './src/foo.js',
                        './src/index.js'
                    ]
                }
            ```
        - 多页面应用
          - 多个入口
            ```
                entry: {
                    // 按需取名
                    foo: './src/foo.js'
                    index: './src/index.js'
                }
            ```
        - 动态配置entry
            ```
                TODO: // 配置动态entry
            ```
      - 构建出口：output
        - 构建出口的路径：path
        - 出口生成的文件名: filename
        - 文件名，路径等可配置
    - 本地化开发
      - webpack-dev-server
      - 配置脚本
          ```
              "devServer": {
                  static: path.resolve(__dirname, 'dist')
              }
          ```
      - 执行
        - 在scripts里配置dev: webpack-dev-server
          - 可用webpack serve代替webpack-dev-server
    - webpack使用loader处理css、图片，ts等文件
      - webpack默认从.js开始构建，而前端都是从一个html出发的，因此我们需要一个html文件，引用构建结束的.js文件，
        - 文件名或路径会变化，如添加了hash, 因此需将HTML的引用路径和构建结果关联起来
        - 使用html-webpack-plugin，并为其添加模板即可（亦可不添加）
      - webpack会把css打包成js文件，为将其剥离出来需要对其配置如下
        - 若是less等文件，需要安装less-loader/ sass-loader;将其解析成css
        - css-loader解析css代码，如@import / url()；此时css会被打包成js文件
        - 如果要将其剥离出来，需要安装和配置mini-css-extract-plugin文件，使用方式为：MiniCssExtractPlugin.loader
      - webpack无法处理png/jpg/gif等图片，因此需要使用file-loader处理图片
      - 整体module-rules配置如下（可能会有部分改动，需要根据实际情况稍作修改）
        ```
            module: {
                rules: [
                    {
                        test: /\.less$/,
                        use: [
                            // 'style-loader', // only for development
                            MiniCssExtractPlugin.loader,
                            {
                                // 解析css代码，处理css依赖，如@import和url()
                                loader: 'css-loader', options: {
                                    url: false,
                                }
                            },
                            'less-loader',
                        ],
                        include: [
                            resolve('src')
                        ]
                    },
                    {
                        test: /\.css$/i,
                        exclude: /node_modules/,
                        use: [ // 运行顺序是从下到上
                            // 因为这个插件需要干涉模块转换的内容，所以需要使用它对应的 loader
                            MiniCssExtractPlugin.loader, // 单独把css分离出来, 不让他打包进js里
                            {
                                loader: 'css-loader', options: {
                                    importLoaders: 1,
                                }
                            },
                            'postcss-loader'
                        ],
                    },
                    {
                        test: /\.tsx?$/,
                        loader: 'ts-loader',
                        include: [
                            resolve('src')
                        ],
                        options: {
                            compiler: 'ttypescript',
                        },
                    },
                    //  处理图片
                    {
                        test: /\.(png|jpg|gif)$/,
                        loader: 'file-loader',
                        options: {

                        },
                        include: []
                    }
                    <!-- 助力使用es新特性的js工具，可以在此配置babel而不用担心无法使用es6/7/next -->
                    {
                        test: /\.jsx?$/,
                        loader: 'babel-loader',
                        include: [
                            resolve('src')
                        ]
                    }
                ]
            },
        ```
  - 路径解析
    - 当import一个文件时，webpack使用enhanced-resolve用于处理依赖模块的路径解析，是Node模块路径解析的增强版本
    - resolve
      - resolve.alias
        ```
            alias: {
                [name]: path.resolve(src/...) // 模糊匹配，只要带了[name]就会被替换掉, 即：`import '[name]/hello.js'` => `import '绝对路径/src/.../hello.js'`
                [name]$: path.resolve(src/[name]) // 精确匹配，只会处理`import [name]`
            }
        ```
      - resolve.extensions
        - 处理引用模块时`import * from './src/index[.js]`的这个自动补全后缀的行为
        ```
            <!-- 没有后缀时，即会通过这个后缀查找对应的文件，找到为止（此处是有可优化的空间的，如在引用时补全后缀即可减少查找的时间） -->
            extensions: ['.jsx', '.js', '.tsx',...]
        ```
      - resolve.modules
      - resolve.mainFields
      - resolve.mainFiles
      - resolve.resolveLoader