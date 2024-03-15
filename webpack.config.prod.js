const path = require("path");

const TerserPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HandlebarsPlugin = require("handlebars-webpack-plugin");

export default {
	mode: "production",
	devtool: "source-map",
	entry: {
		main: path.resolve(__dirname, "./src/index"),
		vendor: path.resolve(__dirname, "./src/vendor"),
	},
	target: "web",
	output: {
		filename: "bundle.[chunkhash].js",
		chunkFilename: "bundle.[chunkhash].[id].js",
		path: path.resolve(__dirname, "dist/"),
		publicPath: "/",
	},
	optimization: {
		// splitChunks replaces CommonsChunkPlugin
		splitChunks: {
			chunks: "all",
		},
		minimize: true,
		minimizer: [
			// Minify JS
			new TerserPlugin(),
		],
	},
	module: {
		rules: [
			// file loader for handlebars templates
			{
				test: /\.hbs$/,
				use: [
					{
						loader: "handlebars-loader",
					},
				],
			},
			// file loader for javascript
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
			// file loader for html
			{
				test: /\.html$/,
				loader: "html-loader",
			},
			{
				test: /\.css$/i,
				use: [MiniCssExtractPlugin.loader, "css-loader"],
			},
			{
				test: /\.(scss|sass)$/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: "css-loader",
						options: {
							sourceMap: true,
						},
					},
					// {
					//   loader: "postcss-loader",
					//   options: {
					//     autoprefixer: {
					//       browsers: ["last 2 versions"],
					//     },
					//     plugins: () => [autoprefixer],
					//   },
					// },
					{
						loader: "sass-loader",
						options: {
							sourceMap: true,
						},
					},
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
					"file-loader",
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
	plugins: [
		new CleanWebpackPlugin({
			cleanOnceBeforeBuildPatterns: ["**/*"],
		}),
		new MiniCssExtractPlugin({
			filename: "style.[contenthash].css",
			chunkFilename: "style.[id].css",
		}),
		new HtmlWebpackPlugin({
			// Also generate a test.html
			hash: true,
			filename: "index.html",
			template: "./src/views/layouts/index.hbs",
			inject: true,
		}),
		new HtmlWebpackPlugin({
			// Also generate a test.html
			hash: true,
			filename: "collections.html",
			template: "./src/views/collections.hbs",
			inject: true,
		}),
		// new HandlebarsPlugin({
		//   // path to hbs entry file(s). Also supports nested directories if write path.join(process.cwd(), "app", "src", "**", "*.hbs"),
		//   entry: path.join(process.cwd(), "src", "views", "*.hbs"),
		//   // output path and filename(s). This should lie within the webpacks output-folder
		//   // if ommited, the input filepath stripped of its extension will be used
		//   output: path.join(process.cwd(), "dist", "[name].html"),
		//   // you can also add a [path] variable, which will emit the files with their relative path, like
		//   // output: path.join(process.cwd(), "build", [path], "[name].html"),
		// }),
	],
};
