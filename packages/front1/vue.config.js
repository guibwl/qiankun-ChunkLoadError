/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const CompressionWebpackPlugin = require('compression-webpack-plugin');

const { NODE_ENV,  VUE_APP_PORT } = process.env;
const DEV = NODE_ENV === 'development';
const PROD = NODE_ENV === 'production';
const packageName = 'front1';
const publicPath = 'front1';

module.exports = {
  // 部署服务器后需要添加 publicPath 进行path的匹配
  publicPath: DEV ? '/' : `/${publicPath}`,
  // 开发环境需要把所有资源都放到 publicPath 路径下，
  // 目的是给主应用区分请求来源，并将请求发送给对应子应用
  assetsDir: DEV ? publicPath : '',
  devServer: {
    // 使用固定端口，以保证本地的微前端（qiankun）可以获取到子应用地址。
    port: VUE_APP_PORT,
    disableHostCheck: true,
  },
  chainWebpack: (config) => {
    // config
    // .devtool('eval-source-map');
    config.module
      .rule('js')
      .test(/\.jsx?$/)
      .use('async-catch-loader')
      .loader('async-catch-loader')
      .end();
    config.output
      .library(`${packageName}-[name]`)
      .libraryTarget('umd')
      .jsonpFunction(`webpackJsonp_${packageName}`);
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
      extensions: ['.ts', '.tsx', '.js', '.vue'],
    },
    plugins: [
      PROD
      && new CompressionWebpackPlugin({
        algorithm: 'gzip',
        test: /\.js$|\.html$|\.json$|\.css/,
        threshold: 10240,
        minRatio: 0.8,
      }),
    ].filter(Boolean),
    // 开启分离js
    optimization: {
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: Infinity,
        minSize: 20000,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              // get the name. E.g. node_modules/packageName/not/this/part.js
              // or node_modules/packageName
              const pkgName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
              // npm package names are URL-safe, but some servers don't like @ symbols
              return `npm.${pkgName.replace('@', '')}`;
            },
          },
        },
      },
    },
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
    },
  },
};
