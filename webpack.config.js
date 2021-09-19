const webpack = require('webpack');
const path = require('path');

const app_config = require('./config/app');

module.exports = {
	cache: true,
	mode: app_config.APP_MODE,
	entry: {
		'guest': ['./client/guest/index', 'webpack-hot-middleware/client'],
		'dashboard': ['./client/dashboard/index', 'webpack-hot-middleware/client']
	},
	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'dist'),
		publicPath: '/static'
	},
	devServer: {
		contentBase: './dist',
		hot: true
	},
	resolve: {
		extensions: ['.js', '.jsx', '.css']
	},
	plugins: [new webpack.HotModuleReplacementPlugin()],
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
				include: path.join(__dirname, 'client')
			},
			{
				test: /\.css$/,
				use: ["style-loader", "css-loader"],
			}
		]
	}
};
