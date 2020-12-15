const path = require("path");
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin')

module.exports = {
  // mode: 'development',
  entry: {
    main: __dirname + "/src/dev.js",
  },
  
  output: {
    path: __dirname + '/build', // Folder to store generated bundle
    filename: 'bundle.[contenthash].js',  // Name of generated bundle after build
    publicPath: '/' // public URL of the output directory when referenced in a browser
  },

  plugins: [  // Array of plugins to apply to build chunk
    new HtmlWebpackPlugin({
        template: __dirname + "/src/public/index.html",
        inject: 'body'
    }),
    new CleanWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ],
  resolve: {
    modules: [
      path.join(__dirname, "src"),
      path.resolve(__dirname, "node_modules"),
    ],
  },
  
  resolveLoader: {
    modules: ["web_loaders", "web_modules", "node_loaders", "node_modules"],
  },

  devtool: 'inline-source-map',
  module: {
    rules: [
      {
      	test: /\.js?$/,
        loader: "babel-loader",
        include: path.resolve(__dirname, 'src'),
        options: {
          presets: ["@babel/preset-env", "@babel/preset-react"],
          plugins: ['@babel/plugin-proposal-class-properties'], 
        }
      },
      {
        test: /\.css$/i,
        //include: path.resolve(__dirname, 'src'),
        use: ["style-loader", "css-loader"],
      },
    ]
  },
  
  devServer: {  // configuration for webpack-dev-server
    contentBase: './src/public',  //source of static assets
    port: 7700, // port to run dev-server
    historyApiFallback: true,
    open: true,
    compress: true,
    hot: true,
  } 
}