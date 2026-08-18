const webpack = require('webpack');
const path = require('path');

const app_config = require('./config/app');
const tinymce_config = require('./config/tinymce');

const isProd = app_config.NODE_ENV === 'production';

module.exports = {
	cache: true,
	mode: isProd ? 'production' : 'development',
	entry: isProd
		? {
			'guest': './client/guest/index',
			'dashboard': './client/dashboard/index'
		}
		: {
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
		hot: !isProd
	},
	resolve: {
		extensions: ['.js', '.jsx', '.css'],
		alias: {
			'react-bootstrap-typeahead': path.resolve(__dirname, 'node_modules/react-bootstrap-typeahead/cjs/index.js')
		}
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env.TINYMCE_APIKEY': JSON.stringify(tinymce_config.TINYMCE_APIKEY)
		}),
		...(isProd ? [] : [new webpack.HotModuleReplacementPlugin()])
	],
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
