import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { CameraParams } from '../const'

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

  // 适配 3D 场景
  window.addEventListener('resize', () => {
    this.camera.aspect = this.dom.clientWidth / this.dom.clientHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(this.dom.clientWidth, this.dom.clientHeight)
  })
}