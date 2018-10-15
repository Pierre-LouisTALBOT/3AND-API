const path = require('path');

module.exports = {
	mode: 'production',
	entry: {
		index: './www/pages/index.js',
		login: './www/pages/login/login.js',
		julien: './www/pages/julien/Julien-Daviaud-Demaille.html'
	},
	output: {
		filename: '[name]-bundle.js',
		path: path.resolve(__dirname + '/www/ressources/scripts/bundles')
	},
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
				query: {
					presets: [
						'react',
						[
							"latest-node", {
								"target": "current"
							}
						]
					]
				}
			}
		]
	}
};
