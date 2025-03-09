import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { CameraParams } from '../const'
// 场景：要把 html 标签结合到 3d 世界中
// 使用：CSS2D 渲染器
// 1.引入渲染器构造函数
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js'

export function Create3d(wrapSel) {
  // 初始化三要素
  this.dom = document.querySelector(wrapSel)
  this.scene = new THREE.Scene()
  this.camera = new THREE.PerspectiveCamera(CameraParams.fov, this.dom.clientWidth / this.dom.clientHeight, CameraParams.near, CameraParams.far)
  // 设置位置的方法：set支持三个数据，copy支持对象
  this.camera.position.copy(CameraParams.initPos);
  this.renderer = new THREE.WebGLRenderer()
  this.renderer.setSize(this.dom.clientWidth, this.dom.clientHeight)
  this.dom.appendChild(this.renderer.domElement)

  // 轨道控制器
  this.controls = new OrbitControls(this.camera, this.renderer.domElement)
  this.controls.enableDamping = true
  this.controls.dampingFactor = 0.125
  // 影响轨道控制器带着摄像机默认观察指定的坐标点位置
  this.controls.target = new THREE.Vector3(...Object.values(CameraParams.initControlsTarget))

  // 坐标辅助
  this.axesHelper = new THREE.AxesHelper(500)
  this.scene.add(this.axesHelper)

  // 2.创建CSS2D 渲染器（div盒子）-覆盖在 canvas 画布之上
  // 效果：div 透明的，透过去看到后面的 3d 物体（仿佛 div 标签真的在里面一样）
  this.css2dRenderer = new CSS2DRenderer()
  this.css2dRenderer.setSize(this.dom.clientWidth, this.dom.clientHeight)
  this.css2dRenderer.domElement.style.position = 'absolute'
  this.css2dRenderer.domElement.style.top = 0
  this.css2dRenderer.domElement.style.zIndex = 10
  // this.css2dRenderer.domElement.style.pointerEvents = 'none'
  this.dom.appendChild(this.css2dRenderer.domElement)


  // 适配 3D 场景
  window.addEventListener('resize', () => {
    this.camera.aspect = this.dom.clientWidth / this.dom.clientHeight
    this.camera.updateProjectionMatrix()
    this.css2dRenderer.setSize(this.dom.clientWidth, this.dom.clientHeight)
    this.renderer.setSize(this.dom.clientWidth, this.dom.clientHeight)
  })
}