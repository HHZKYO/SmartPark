// 鼠标事件管理类
import * as THREE from 'three'

export function MouseHandler() {}

MouseHandler.getInstance = function(){
  // 单例模式（无论哪个地方使用，保证是同一个对象，保证事件全局只有一次）
  if (!MouseHandler.instance) {
    MouseHandler.instance = new MouseHandler()
  }
  return MouseHandler.instance
}

MouseHandler.prototype.init = function (scene, camera, dom) {
  this.scene = scene
  this.camera = camera
  this.dom = dom

  this.bindHover()
  this.bindClick()
}

MouseHandler.prototype.bindHover = function () {
  this.hoverList = [] // 要参与 hover 的物体
  this.hoverMap = new Map() // 物体与函数的映射结构

  // 绑定鼠标滑过光线投射事件
  const raycaster = new THREE.Raycaster()
  const pointer = new THREE.Vector2()
  this.dom.addEventListener('mousemove', e => {
    // 光线投射
    pointer.x = (e.offsetX / this.dom.clientWidth) * 2 - 1
    pointer.y = -(e.offsetY / this.dom.clientHeight) * 2 + 1
    // 通过摄像机和鼠标位置更新射线
    raycaster.setFromCamera(pointer, this.camera)
    // 计算物体和射线的焦点，收集被穿过的物体集合（false 不检测子物体）
    const intersects = raycaster.intersectObjects(this.hoverList, false)
    if (intersects.length > 0) {
      const target = intersects[0].object
      // 回传滑过的物体，后续逻辑为了此函数复用，在外面处理
      const fn = this.hoverMap.get(target)
      // 回调绑定点击事件函数体，并回传当前触发的这个 three.js 物体
      fn(target)
    }
  })
}

MouseHandler.prototype.bindClick = function () {
  this.clickList = [] 
  this.clickMap = new Map() 
  const downPoiner = new THREE.Vector2() 
  this.dom.addEventListener('mousedown', e => {
    e.stopPropagation()
    downPoiner.x = e.offsetX
    downPoiner.y = e.offsetY
  })
  const rayCaster = new THREE.Raycaster()
  const pointer = new THREE.Vector2()
  this.dom.addEventListener('mouseup', e => {
    e.stopPropagation()
    pointer.x = (e.offsetX / this.dom.clientWidth) * 2 - 1
    pointer.y = -(e.offsetY / this.dom.clientHeight) * 2 + 1
    rayCaster.setFromCamera(pointer, this.camera)
    const resultList = rayCaster.intersectObjects(this.clickList)
    // 默认只触发第一个收集到的物体（后面物体不触发交互）
    if (resultList.length > 0) {
      const targetObj = resultList[0].object
      // 按下和抬起是一个坐标时，代表本次是点击动作
      if (downPoiner.x === e.offsetX && downPoiner.y === e.offsetY) {
        // 如果当前物体的对应函数没找到（可能你点在了一个组里的某个物体上）
        const fn = this.clickFindParentValue(targetObj)
        // 回调绑定点击事件函数体，并回传当前触发的这个 three.js 物体
        fn(targetObj)
      }
    }
  })
}
MouseHandler.prototype.addHoverMesh = function (mesh, fn) {
  this.hoverList.push(mesh)
  this.hoverMap.set(mesh, fn)
}
MouseHandler.prototype.addClickMesh = function (mesh, fn) {
  this.clickList.push(mesh)
  this.clickMap.set(mesh, fn)
}
MouseHandler.prototype.clickFindParentValue = function (target) {
  const value = this.clickMap.get(target)
  if (value) return value
  else return this.clickFindParentValue(target.parent)
}