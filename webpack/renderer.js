const base = require('./base')
const merge = require('webpack-merge')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const renderer = {
	entry: './src/client.ts',
	output: {
		filename: 'renderer.js'
	},
	target: 'electron-renderer',
	module: {
		rules: [
			{
				test: /\.css$/,
				use: ExtractTextPlugin.extract({
					use: 'css-loader'
				})
			},
			{
				test: /\.woff2(\?[a-z0-9=&.]+)?$/,
				loader: 'file-loader',
				options: {
					name: 'fonts/[name].[ext]?[hash]'
				}
			},
			{
				test: /\.(ttf|eot|svg|woff)(\?[a-z0-9=&.]+)?$/, //Needs to be used with caution
				loader: 'ignore-loader'
			}
		]
	},
	plugins: [new ExtractTextPlugin('styles.css')]
}

module.exports = merge(base, renderer)
