const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const ENV = process.env.NODE_ENV || 'development';


module.exports = {
  entry: './src/index.js',

  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  mode: ENV,
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
        template:"./src/index.ejs"
    })
  ],
  module: {
      rules: [
          {
            test: /\.(scss|css)$/,
            use: [
              {loader: "style-loader"},
              {
                  loader: "css-loader",
                  options: {
                      modules: {
                        mode: "local",
                        localIdentName: (ENV == "production") ? '[hash:base64:4]' : '[name]__[local]___[hash:base64:4]'
                      }            
                  }
              },
              {loader: "sass-loader"}
            ]
          },
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            include: path.resolve(__dirname, 'src'),
            use: {
              loader: "babel-loader"
            }
          }
      ]
  },
  resolve: {
    "alias": {
        "react": "preact-compat",
        "react-dom": "preact-compat"
      }
  },
  devServer: {
      contentBase: "./src",
      watchContentBase: true
  },
  devtool: ENV==='production' ? 'source-map' : 'cheap-module-eval-source-map'
};