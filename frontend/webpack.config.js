const path = require('path')

const { ProvidePlugin } = require('webpack')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const miniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const SpritePlugin = require('svg-sprite-loader/plugin')
const CopyPlugin = require('copy-webpack-plugin')

const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev

const optimization = () => {
  const config = {}

  if (isProd) {
    config.minimizer = [new miniCssExtractPlugin(), new TerserWebpackPlugin()]
  }

  return config
}

const fileLoaderConfig = (ext) => [
  {
    loader: 'file-loader',
    options: {
      name: '[name].[ext]',
      outputPath: `${isProd ? '/' : ''}assets/${ext}`,
    },
  },
]

const filename = (ext) => (isDev ? `[name].${ext}` : `[name].[hash].${ext}`)

module.exports = {
  mode: 'development',
  entry: ['@babel/polyfill', './src/js/index.js'],
  output: {
    filename: filename('js'),
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.(less)$/,
        use: [
          {
            loader: miniCssExtractPlugin.loader,
          },
          'css-loader',
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                paths: [path.resolve(__dirname, 'src/styles')],
                sourceMap: true,
              },
            },
          },
        ],
      },
      {
        test: /\.(css)$/,
        use: [
          {
            loader: miniCssExtractPlugin.loader,
          },
          'css-loader',
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
        },
      },
      {
        test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        use: fileLoaderConfig('fonts'),
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        exclude: path.resolve(__dirname, 'src/assets/sprite'),
        use: fileLoaderConfig('img'),
      },
      {
        test: /\.svg$/,
        include: path.resolve(__dirname, 'src/assets/sprite'),
        use: [
          {
            loader: 'svg-sprite-loader',
            options: {
              extract: true,
              outputPath: '/assets/sprite/',
            },
          },
          'svgo-loader',
        ],
      },
    ],
  },
  devtool: isDev ? 'source-map' : false,
  optimization: optimization(),
  plugins: [
    new SpritePlugin(),
    new ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
    }),
    new HTMLWebpackPlugin({
      template: './public/index.html',
      minify: {
        collapseWhitespace: isProd,
      },
    }),
    new HTMLWebpackPlugin({
      template: './public/404.html',
      inject: 'body',
      filename: '404.html',
      minify: {
        collapseWhitespace: isProd,
      },
    }),
    new HTMLWebpackPlugin({
      template: './public/search.html',
      inject: 'body',
      filename: 'search.html',
      minify: {
        collapseWhitespace: isProd,
      },
    }),
    new HTMLWebpackPlugin({
      template: './public/ui.html',
      inject: 'body',
      filename: 'ui.html',
      minify: {
        collapseWhitespace: isProd,
      },
    }),
    new HTMLWebpackPlugin({
      template: './public/technic/technic.html',
      inject: 'body',
      filename: 'technic.html',
      minify: {
        collapseWhitespace: isProd,
      },
    }),
    new HTMLWebpackPlugin({
      template: './public/technic/technic-detail.html',
      inject: 'body',
      filename: 'technic-detail.html',
      minify: {
        collapseWhitespace: isProd,
      },
    }),
    new HTMLWebpackPlugin({
      template: './public/technic/technic-equip-detail.html',
      inject: 'body',
      filename: 'technic-equip-detail.html',
      minify: {
        collapseWhitespace: isProd,
      },
    }),
    new HTMLWebpackPlugin({
      template: './public/technic/configurator.html',
      inject: 'body',
      filename: 'configurator.html',
      minify: {
        collapseWhitespace: isProd,
      },
    }),
    new HTMLWebpackPlugin({
      template: './public/about/vacancy.html',
      inject: 'body',
      filename: 'vacancy.html',
      minify: {
        collapseWhitespace: isProd,
      },
    }),
    new HTMLWebpackPlugin({
      template: './public/about/health-and-safety.html',
      inject: 'body',
      filename: 'health-and-safety.html',
      minify: {
        collapseWhitespace: isProd,
      },
    }),
    new HTMLWebpackPlugin({
      template: './public/press-center/press-center.html',
      inject: 'body',
      filename: 'press-center.html',
      minify: {
        collapseWhitespace: isProd,
      },
    }),
    new HTMLWebpackPlugin({
      template: './public/press-center/press-detail.html',
      inject: 'body',
      filename: 'press-detail.html',
      minify: {
        collapseWhitespace: isProd,
      },
    }),
    new HTMLWebpackPlugin({
      template: './public/press-center/magazine-archive.html',
      inject: 'body',
      filename: 'magazine-archive.html',
      minify: {
        collapseWhitespace: isProd,
      },
    }),
    new HTMLWebpackPlugin({
      template: './public/press-center/magazine-archive.html',
      inject: 'body',
      filename: 'magazine-archive.html',
      minify: {
        collapseWhitespace: isProd,
      },
    }),
    new HTMLWebpackPlugin({
      template: './public/press-center/counterfeit.html',
      inject: 'body',
      filename: 'counterfeit.html',
      minify: {
        collapseWhitespace: isProd,
      },
    }),
    new HTMLWebpackPlugin({
      template: './public/personal-account/personal-account.html',
      inject: 'body',
      filename: 'personal-account.html',
      minify: {
        collapseWhitespace: isProd,
      },
    }),
    new HTMLWebpackPlugin({
      template: './public/personal-account/reports.html',
      inject: 'body',
      filename: 'reports.html',
      minify: {
        collapseWhitespace: isProd,
      },
    }),
    new HTMLWebpackPlugin({
      template: './public/buy.html',
      inject: 'body',
      filename: 'buy.html',
      minify: {
        collapseWhitespace: isProd,
      },
    }),
    new HTMLWebpackPlugin({
      template: './public/contacts.html',
      inject: 'body',
      filename: 'contacts.html',
      minify: {
        collapseWhitespace: isProd,
      },
    }),
    new HTMLWebpackPlugin({
      template: './public/finance.html',
      inject: 'body',
      filename: 'finance.html',
      minify: {
        collapseWhitespace: isProd,
      },
    }),
    new HTMLWebpackPlugin({
      template: './public/service.html',
      inject: 'body',
      filename: 'service.html',
      minify: {
        collapseWhitespace: isProd,
      },
    }),
    new CopyPlugin({
      patterns: [
        { from: './src/assets/favicon', to: './assets/favicon' },
        { from: './src/assets/img', to: './assets/img' },
        { from: './src/assets/svg', to: './assets/svg' },
        { from: './src/assets/files', to: './assets/files' },
      ],
    }),
    new CleanWebpackPlugin(),
    new miniCssExtractPlugin({
      filename: filename('css'),
    }),
  ],
}

if (isDev) {
  module.exports.devServer = {
    port: 3011,
    allowedHosts: 'all',
    client: {
      overlay: false,
    },
    hot: isDev,
    compress: true,
    liveReload: false,
    historyApiFallback: true,
    proxy: {
      // '/api': {
      //   target: 'http://moidom.xyz',
      //   secure: false,
      //   changeOrigin: true,
      // },
      // '/upload': {
      //   target: 'http://moidom.xyz',
      //   secure: false,
      //   changeOrigin: true,
      // },
    },
  }
}
