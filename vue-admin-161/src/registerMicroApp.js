import { registerMicroApps, start } from 'qiankun'

registerMicroApps([
  {
    name: 'hmzs-big-screen', // 子应用名称（随便定义只要跟子应用一会儿的名字对应上）
    entry: '//localhost:5173', // 子应用 html 网页运行服务完整地址（以后还可能包含文件夹路径）（就是npm run dev时的那个地址）
    container: '#container', // 挂载容器（id=container）- 在主应用根组件里准备好 - 用于加载子应用页面
    activeRule: '/big-screen' // 浏览器"地址栏地址"和这里匹配后，就会去加载子项目网页
    // 例如：主项目访问子项目地址为 http://xxx:xx/a/b#/big-screen
    // 这里就要填写 'a/b#/big-screen'
  }
])

start()
