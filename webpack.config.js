const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  mode: 'development',
  entry: {
    main: './src/main/index.ts',
    renderer: './src/renderer/index.tsx',
  },
  target: 'electron-renderer',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.(js|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true, // Skip type checking to allow build with TS errors
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
      chunks: ['renderer'],
    }),
  ],
  watch: process.env.WEBPACK_WATCH === 'true', // Enable watch mode when environment variable is set
  watchOptions: {
    ignored: /node_modules/,
    aggregateTimeout: 300, // Delay before rebuilding
    poll: 1000, // Check for changes every second
  },
  // Exclude native modules like robotjs from bundling in main process
  externals: {
    robotjs: 'commonjs2 robotjs',
    // Add other native modules here if needed
  }
};