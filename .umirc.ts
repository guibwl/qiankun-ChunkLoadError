import { defineConfig } from 'umi';
import CompressionWebpackPlugin from 'compression-webpack-plugin';

// 子应用端口号配置，这里要和子应用匹配，否则本地微前端无法启动
// 1. 商品管理
const front1Port = 9001;
// 2. 供应商管理
const front2Port = 9002;

export default defineConfig({
  devtool: 'eval',
  favicon: '/front1/favicon.ico',
  nodeModulesTransform: {
    type: 'none',
  },
  qiankun: {
    master: {
      apps: [
        {
          name: 'front1',
          entry: '/front1',
        },
        {
          name: 'front2',
          entry: '/front2',
        },
      ],
    },
  },
  routes: [
    {
      title: 'Demo',
      path: '/',
      component: '@/pages/index',
      routes: [
        {
          title: 'front1',
          path: '/front1/',
          microApp: 'front1',
        },
        {
          title: 'front2',
          path: '/front2/',
          microApp: 'front2',
        },
      ],
    },
  ],
  mock: false,
  hash: true,
  chainWebpack(memo, { env, webpack, createCSSRule }) {
    env === 'production' &&
      memo.plugin('compression').use(CompressionWebpackPlugin, [
        {
          algorithm: 'gzip',
          test: /\.js$|\.html$|\.json$|\.css/,
          threshold: 10240,
          minRatio: 0.8,
        },
      ]);
  },
  proxy: {
    /* ------微应用的代理配置------ */
    // front1
    '/front1': {
      target: `http://localhost:${front1Port}`,
      changeOrigin: true,
      bypass: function(req: any, res: any, proxyOptions: any) {
        if (req.headers.accept && req.headers.accept.indexOf('html') !== -1) {
          return '/index.html';
        }
      },
    },
    // front2
    '/front2': {
      target: `http://localhost:${front2Port}`,
      changeOrigin: true,
      bypass: function(req: any, res: any, proxyOptions: any) {
        if (req.headers.accept && req.headers.accept.indexOf('html') !== -1) {
          return '/index.html';
        }
      },
    },
    /* ------微应用的代理配置------ */
  },
  webpack5: {},
});
