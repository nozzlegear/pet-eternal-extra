"use strict";

const webpack = require("webpack");
const lodashPack = require("lodash-webpack-plugin");

module.exports = {
    resolve: {
        root:  process.cwd(),
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"],
    },
    entry: {
        "index": "./index.tsx",
    },
    output: {
        path: "dist",
        filename: "[name].min.js",
    },
    externals: {
        
    },
    devtool: "source-map",
    plugins: [
        new lodashPack,
        new webpack.optimize.OccurenceOrderPlugin,
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
            }
        }),
    ],
    module: {
        loaders: [
            { 
                test: /\.tsx?$/i, 
                loader: 'awesome-typescript-loader' 
            },
            {
                loader: 'babel-loader',
                test: /\.js$/i,
                exclude: /node_modules/,
                query: {
                    plugins: ['lodash'],
                    presets: ['es2015'],
                },
            },
            {
                test: /\.scss$/i,
                loaders: ["style", "css", "sass"]
            },
            {
                test: /\.json$/i,
                loaders: ["json"],
            }
        ],
        preLoaders: [
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { test: /\.js$/, loader: "source-map-loader" }
        ]
    },
}