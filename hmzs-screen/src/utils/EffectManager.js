// 动效管理类
// 在渲染循环中遍历调用需要做动画的回调函数
// 业务文件中注册要基于渲染循环执行的回调函数
// 问题：为何不用 setInterval 做车移动？
// 解决：因为切屏后 setInterval 还在执行，切回来后可能一瞬间执行了很多代码，而渲染循环切出去会暂停，回来恢复继续执行
export function EffectManager() {
  this.effectList = []
}

EffectManager.getInstance = function () {
  if (!EffectManager.instance) {
    EffectManager.instance = new EffectManager()
  }
  return EffectManager.instance
}

EffectManager.prototype.addEffect = function (fn) {
  this.effectList.push(fn)
}

EffectManager.prototype.removeEffect = function (fn) {
  this.effectList.splice(this.effectList.indexOf(fn), 1)
}
EffectManager.prototype.update = function () {
  this.effectList.forEach(fn => {
    fn()
  })
}

