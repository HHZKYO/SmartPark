import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export function Create3d(wrapSel) {
  // 初始化三要素
  this.dom = document.querySelector(wrapSel)
  this.scene = new THREE.Scene()
  this.camera = new THREE.PerspectiveCamera(75, this.dom.clientWidth / this.dom.clientHeight, 0.1, 10000)
  this.camera.position.copy({ x: 500, y: 500, z: 500 });
  this.renderer = new THREE.WebGLRenderer()
  this.renderer.setSize(this.dom.clientWidth, this.dom.clientHeight)
  this.dom.appendChild(this.renderer.domElement)

  // 轨道控制器
  this.controls = new OrbitControls(this.camera, this.renderer.domElement)
  this.controls.enableDamping = true
  this.controls.dampingFactor = 0.125

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