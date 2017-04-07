module.exports = {
	entry: [
		'./sample/index.js'
	],
	output: {
		path: __dirname,
		publicPath: '/',
		filename: 'bundle.js'
	},
	devtool: 'source-map',
	module: {
		loaders: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				loader: 'babel-loader'
			},
			{
				test: /\.css$/,
				exclude: /node_modules/,
				loader: 'style-loader!css-loader'
			}
		]
	},
	devServer: {
		historyApiFallback: true,
		contentBase: './sample/'
	},
	resolve: {
		modules: ['node_modules', './src'],
		extensions: ['*', '.js', '.jsx']
	}
}
