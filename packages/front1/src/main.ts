// import './public-path';
import { createApp } from 'vue';
import createRouter from './router';
import App from './App.vue';
import './registerServiceWorker';

let vueApp: any;
let router: any;
const appId = '#app';

// 这里使用函数创建 App，因为 qiankun 切换到其他子应用时我们需要 unmount 当前 App，
// unmount 后当前 App Instance 便无法 mount，需要重新创建 Instance。
const createVueApp = () => createApp(App).use(router);

/**
 * 注意：该方法仅在微前端环境下会被 qiankun 调用
 * bootstrap 只会在微应用初始化的时候调用一次，下次微应用重新进入时会直接调用 mount 钩子，不会再重复触发 bootstrap。
 * 通常我们可以在这里做一些全局变量的初始化，比如不会在 unmount 阶段被销毁的应用级别的缓存等。
 */
export async function bootstrap() {
  // 这里无法获得主应用的通信数据
  console.log('app bootstraped');
}
/**
 * 注意：该方法仅在微前端环境下会被 qiankun 调用
 * 应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法
 */
export async function mount(this: any, props: any = {}) {
  const { container } = props;

  router = createRouter();
  vueApp = createVueApp();
  vueApp.mount(container ? container.querySelector(appId) : appId);
}

/**
 * 注意：该方法仅在微前端环境下会被 qiankun 调用
 * 应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例
 */
export async function unmount() {
  vueApp.unmount(appId);
  // eslint-disable-next-line
  vueApp._container.innerHTML = '';
  vueApp = null;
  router = null;
}
