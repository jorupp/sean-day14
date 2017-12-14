var ExtractTextPlugin = require('extract-text-webpack-plugin');
var path = require("path");
var webpack = require("webpack");
var pkg = require('./package.json');

module.exports = {
    target: "web",
    entry: {
        styles: "./src/app.scss",
        main: "./src/main.js",
        vendor: Object.keys(pkg.dependencies).filter(function(key) { return key[0] != '@'; })
    },
    output: {
        path: path.resolve('./dist'),
        filename: '[name].bundle.js'
    },
    resolve: {
        extensions: ["*", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"],
        modules: [path.resolve("./src"), "node_modules"]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                enforce: "pre",
                loader: "tslint-loader",
                options: {
                    emitErrors: true,
                    failOnHint: true
                }
            },
            {
                test: /\.tsx?$/,
                loader: "ts-loader"
            },
            { // css loader for webpack
                test: /\.(css)$/,
                loader: ExtractTextPlugin.extract(['css-loader'])
            },
            { // sass / scss loader for webpack
                test: /\.(sass|scss)$/,
                loader: ExtractTextPlugin.extract(['css-loader', 'sass-loader'])
            },
            { // copy references to build
                test: /node_modules.*\.(png|jpg|jpeg|gif|eot|woff2|woff|ttf|svg)$/,
                loader: 'file-loader?name=[name].[ext]'
            },
            { // useRelativePath modifies [name], so we don't need [path]
                test: /\.(png|jpg|jpeg|gif)$/,
                loader: 'file-loader?useRelativePath=true&emitFile=false&name=[name].[ext]'
            }
        ]
    },
    devtool:
    // source-map - A SourceMap is emitted. See also output.sourceMapFilename.
    // inline-source-map - A SourceMap is added as DataUrl to the JavaScript file.
    // cheap-source-map - A SourceMap without column-mappings. SourceMaps from loaders are not used.
    // cheap-module-source-map - A SourceMap without column-mappings. SourceMaps from loaders are simplified to a single mapping per line.
    '#inline-source-map',
    plugins: [
        new ExtractTextPlugin("./dist/[name].css"),
        new webpack.optimize.CommonsChunkPlugin({
			names: 'vendor',
			minChunks: Infinity
		})
    ]
}
