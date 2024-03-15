import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import StyleLintPlugin from "stylelint-webpack-plugin";
// import MiniCssExtractPlugin from "mini-css-extract-plugin";
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
// const { extendDefaultPlugins } = require("svgo");

export default {
	mode: "development",
	entry: {
		main: "server.js",
	},
	watch: true,
	target: "web",
	devtool: "inline-source-map",
	output: {
		// serves build from memory
		path: path.resolve(__dirname, "./"),
		publicPath: "/",
		filename: "bundle.js",
		chunkFilename: "[name].js",
	},

	plugins: [
		// Create HTML file that includes reference to bundled JS.
		new HtmlWebpackPlugin({
			inject: true,
			hash: true,
			template: "./views/layouts/main.handlebars",
			filename: "./build/index.html",
		}),
	],
	module: {
		rules: [
			{
				test: /\.hbs$/,
				use: [
					{
						loader: "handlebars-loader",
					},
				],
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					options: {
						presets: ["@babel/preset-env"],
					},
				},
			},
			{
				test: /\.css$/i,
				use: ["style-loader", "css-loader", "postcss-loader"],
			},
			{
				test: /\.s[ac]ss$/i,
				use: [
					// MiniCssExtractPlugin.loader,
					// Creates `style` nodes from JS strings
					"style-loader",
					// Translates CSS into CommonJS
					"css-loader",
				],
			},
			// file loader for fonts
			{
				test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
				use: ["file-loader"],
			},
			// file loader for images
			{
				test: /\.(gif|png|jpe?g|svg)$/i,
				use: [
					"url-loader",
					{
						loader: "image-webpack-loader",
						options: {
							mozjpeg: {
								progressive: true,
								quality: 65,
							},
							// optipng.enabled: false will disable optipng
							optipng: {
								enabled: false,
							},
							pngquant: {
								quality: [0.65, 0.9],
								speed: 4,
							},
							gifsicle: {
								interlaced: false,
							},
							// the webp option will enable WEBP
							webp: {
								quality: 75,
							},
						},
					},
				],
			},
		],
	},

	resolve: {
		extensions: ["*", ".js", ".jsx"],
	},
};
