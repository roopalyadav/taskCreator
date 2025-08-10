const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].bundle.js',
    chunkFilename: '[name].[contenthash].chunk.js',
    clean: true,
    publicPath: '/',
    // Ensure proper handling of different asset types
    assetModuleFilename: 'assets/[name].[contenthash][ext]',
  },
  
  mode: 'production',
  
  devtool: false, // No source maps in production for better performance
  
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { 
                targets: { browsers: ['> 1%', 'last 2 versions'] },
                modules: false,
                useBuiltIns: 'usage',
                corejs: 3
              }],
              ['@babel/preset-react', { runtime: 'automatic' }]
            ],
          },
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ],
  },
  
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
      inject: 'body',
      scriptLoading: 'defer',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
      meta: {
        viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no',
        'theme-color': '#000000',
      },
    }),
  ],
  
  optimization: {
    minimize: true,
    splitChunks: {
      chunks: 'all',
      minSize: 20000,
      maxSize: 250000,
      maxInitialRequests: 30,
      maxAsyncRequests: 30,
      cacheGroups: {
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: -10,
          chunks: 'all',
          maxSize: 250000,
        },
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: 'react-vendor',
          chunks: 'all',
          priority: 20,
          maxSize: 200000,
        },
        antd: {
          test: /[\\/]node_modules[\\/]antd[\\/]/,
          name: 'antd-vendor',
          chunks: 'all',
          priority: 15,
          maxSize: 250000,
        },
        dayjs: {
          test: /[\\/]node_modules[\\/]dayjs[\\/]/,
          name: 'dayjs-vendor',
          chunks: 'all',
          priority: 12,
        },
      },
    },
    runtimeChunk: {
      name: 'runtime',
    },
  },
  
  performance: {
    hints: 'warning',
    maxEntrypointSize: 800000, // Increased to be more realistic for Ant Design apps
    maxAssetSize: 300000, // Individual chunk size limit
  },
};
