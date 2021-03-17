### 安装：
yarn install:all

### 启动：
yarn start:all

### Bug 重现:
##### 条件：
子应用 front1、front2 都使用了路由懒加载，各有 A、B 两个页面。
##### 步骤：
1. 当 front1 的 A 页面加载后，通过左菜单切换 front2 的 A 或 B 页面，此时 front2 加载。
2. 切换回 front1 的 B 页面，此时会产生报错：
```js
ChunkLoadError: Loading chunk B failed.
```
##### 分析：

这个报错是 `webpack` 发出的，`webpack` 通过把所有 `chunk` 执行完成的回调方法 `webpackJsonpCallback` 挂载到 `window`，当 `chunk` 加载完成后，`chunk` 会在 `window` 中找到 `webpackJsonpCallback` 方法并执行，以此通知 `webpack` 当前 `chunk` 加载完成。这个报错的根源是就是 `chunk` 在加载完成后没有找到 `webpackJsonpCallback` 方法。

在处理子应用时，qiankun 的 `sandbox` 通过 `proxy` 实现了一个 `proxyWindow` 替换 `window` 来实现隔离。而子应用的 `webpackJsonpCallback` 实际上是挂载在 `proxyWindow` 上的。当 dynamic import 加载时，qiankun 通过改写 `HTMLHeadElement.prototype.appendChild` 来避免 `webpack` 将 `chunk` 通过 `document.head.appendChild(script)` 添加 `head` 标签中，这样做是因为在 `head` 中添加的 `script` 的执行环境是全局的 `window`，而我们前面提到 `webpackJsonpCallback` 是挂载在 `proxyWindow` 上的。

按照 [Bug 重现](#bug-重现) 中的步骤操作后发现，本应该被 qiankun 重写的 `document.head.appendChild(script)` 没有起作用，在 Chrome DevTools 的 Elements 里可以看到 `<script charset="utf-8" src="/front1/js/B.js"></script>` 被挂载到 head 标签里了，于是就产生了报错。


原因是分析到了，但是我还是不明白是哪里导致了这个问题的产生，也不知道怎么解决，还请官方大大帮忙看下。