//path package in node to allow absolute path
const path = require("path");
//copy index.html into './dist'
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
	entry: ["./src/js/index.js"],
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "js/bundle.js",
	},
	devServer: {
		//folder to display on server
		contentBase: "./dist",
	},
	plugins: [
		//constructor function for HtmlWebpackPlugin
		new HtmlWebpackPlugin({
			filename: "index.html",
			template: "./src/index.html",
		}),
	],
	//babel loader config
	module: {
		rules: [
			//each loader needs an config object
			{
				//test to see if files end with .js
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
				},
			},
		],
	},
};
