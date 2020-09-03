import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import WebpackMd5Hash from 'webpack-md5-hash';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

export default {
    devtool: 'source-map',
    entry: {
        main: path.resolve(__dirname, 'src/index'),
        vendor: path.resolve(__dirname, 'src/vendor')
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
        filename: '[name].[chunkhash].js'
    },
    plugins: [
        // Generate an external CSS file with a hash in the filename
        new ExtractTextPlugin('[name].[contenthash].css'),

        // Hash the files using MD5 so their names change when the content does
        new WebpackMd5Hash(),

        // Use CommonsChunkPlugin to create a separate bundle
        // of vendor libraries so they're cached separately.
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor'
        }),

        new HtmlWebpackPlugin({
            template: 'src/index.html',
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true
            },
            inject: true
        }),
        // Minify JS
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true
        })
    ],
    module: {
        loaders: [
            {test: /\.jsx?$/, exclude: /node_modules/, loaders: ['babel-loader']},
            {test: /\.sass$/, loader: ExtractTextPlugin.extract('style', 'sass')}
        ],
        rules: [
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader'
                })
            }
        ]
    }
};
