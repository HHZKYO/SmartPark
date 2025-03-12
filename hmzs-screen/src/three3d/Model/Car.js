// import { getPointsByLine } from '@/utils/points'
import { getPoints } from '@/utils/points'
import { EffectManager } from '../../utils/EffectManager';
import { MouseHandler } from '../../utils/MouseHandler';
import store from '@/store'
import { cameraMove } from '../../utils/helper';
import * as THREE from 'three'
// import { Vector3 } from 'three';

// 车辆类
// 场景，摄像机，控制器，车辆模型，车辆数据
export function Car(scene, camera, controls, carModel, carDataObj, carInfo2d) {
  this.scene = scene;
  this.camera = camera;
  this.controls = controls;
  this.carModel = carModel;
  this.carDataObj = carDataObj;
  this.carInfo2d = carInfo2d
  this.scene.add(this.carModel)
  this.carModel.scale.set(0.8, 0.8, 0.8)

  this.bindClick() // 在new car 的同时给这辆车订阅点击事件

  // 根据数据关联的停车位，找到停车位物体
  const parkingSpace = this.scene.getObjectByName(this.carDataObj.parkNum)
  // 把车辆设置在停车位的位置上
  this.carModel.position.copy(parkingSpace.position)
  // 发现车辆默认朝着 z 轴正方向，但我的停车场是歪着的，所以要把车辆旋转过来
  // this.carModel.rotation.y = 0.1666 * Math.PI


  // 根据车位奇数偶数来调整车辆
  if (this.carDataObj.parkNumber % 2 === 0) {
    // 上排汽车
    carModel.rotation.y = 1.1714 * Math.PI
  } else if (this.carDataObj.parkNumber % 2 != 0) {
    // 下排汽车
    carModel.rotation.y = 0.1666 * Math.PI
  }
}


Car.prototype.bindClick = function() {
  // 车辆订阅点击事件
  MouseHandler.getInstance().addClickMesh(this.carModel, () => {
    this.carInfo2d.visible = true
    this.carInfo2d.position.copy(this.carModel.position)
    console.log(this.carDataObj.car)
    store.commit('car/setCarInfo', this.carDataObj)

    // 调整摄像机位置
    // 视角切换
    // 切换摄像机视角
    // status 2: 已进场，1：待入场，0 待出场
    if (this.carDataObj.parkNumber % 2 === 0) {
      // 这里的汽车模型是世界坐标系，相对于世界坐标轴进行位移
      // 下排车位
      cameraMove(
        this.camera,
        this.controls,
        new THREE.Vector3(
          this.carModel.position.x - 9,
          this.carModel.position.y + 8,
          this.carModel.position.z - 16
        ),
        this.carModel.position
      );
    } else {
      // 上排车位
      cameraMove(
        this.camera,
        this.controls,
        new THREE.Vector3(
          this.carModel.position.x + 9,
          this.carModel.position.y + 8,
          this.carModel.position.z + 16
        ),
        this.carModel.position
      );
    }
  })
}

// 创建入场车辆->运动到进场一体杆
Car.prototype.moveEnterFormStartToPole = function(){
  return new Promise(resolve => {
     // 目标：3D物体运动的路径规划
  // 方式1：自己计算几个关键的三维坐标点，然后生成一个曲线路径物体，并分割成指定段数，并返回所有坐标点集合
  // 方式2：根据建模师建好的线段物体，收集对应的坐标点集合
  const points = getPoints(
    this.scene.getObjectByName(`${this.carDataObj.areaName}_进场路线`)
  )
  console.log(points)

  // 改装成借助渲染循环函数执行汽车运动
  let i = 0
  const fn = function() {
    if (i === points.length -1) {
      EffectManager.getInstance().removeEffect(fn)
      resolve() // 动画执行完毕，兑现 resolve 状态让外面 await 放行往下走
      return
    }
    const position = points[i++]
    const nextPos = points[i]
    this.carModel.position.copy(position)
    this.carModel.lookAt(nextPos.x, nextPos.y, nextPos.z)
  }
  EffectManager.getInstance().addEffect(fn.bind(this))

  // let i = 0
  // const t = setInterval(() => {
  //   if (i === points.length -1) return clearInterval(t)
  //   const position = points[i++]
  //   const nextPos = points[i]
  //   this.carModel.position.copy(position)
  //   // this.camera.position.set(position.x, position.y + 5, position.z)
  //   // this.controls.target = points[i + 20]
  //   // lookAt 物体 z 正方向观察指定的坐标点
  //   this.carModel.lookAt(nextPos.x, nextPos.y, nextPos.z)

  //   // // 玩一下：让摄像头跟着动
  //   // this.camera.position.set(position.x, position.y + 4, position.z)
  //   // // 因为有轨道控制器控制着摄像机，所以要改变轨道控制的 target 影响摄像机的 lookAt
  //   // this.controls.target = new Vector3(nextPos.x, nextPos.y + 4, nextPos.z)
  // }, 10)

  // let i = 0
  // const t = setInterval(() => {
  //   const point = points[i++]
  //   if (i >= points.length) return clearInterval(t);
  //   this.carModel.position.copy(point)
  //   const nextPoint = points[i]
  //   this.carModel.lookAt(nextPoint.x, nextPoint.y, nextPoint.z)
  // }, 10)


  // return new Promise(() => {
  //   const lx = this.scene.getObjectByName(`${this.carDataObj.areaName}_进场路线`)
  //   const points = getPointsByLine(lx)
  //   console.log(points)
  // })
  })
}

// 一体杆前 -> 车位
Car.prototype.movePoleToParkingSpace = function(){
  return new Promise(resolve => {
    // 停车位数据拼接，模型里线段物体，获取并转换坐标集合
    // 进场路线物体
    const lineOne = this.scene.getObjectByName(`${this.carDataObj.parkNum}_进场路线`)
    const lineTwo = this.scene.getObjectByName(`${this.carDataObj.parkNum}_倒车入库路线`)
    // 物体 => 坐标集合
    const lineOnePoints = getPoints(lineOne)
    const lineTwoPoints = getPoints(lineTwo)


    let i = 0
    let j = 0
    const fn = () => {
      if (i === lineOnePoints.length - 1) {
        if (j === lineTwoPoints.length - 1) {
          resolve()
          EffectManager.getInstance().removeEffect(fn)
          return
        }
        let lastIndex = j
        const points = lineTwoPoints[++j]
        const nextPos = lineTwoPoints[lastIndex]
        this.carModel.position.copy(points)
        this.carModel.lookAt(nextPos.x, nextPos.y, nextPos.z)
        return
      }
      const points = lineOnePoints[i++]
      const nextPos = lineOnePoints[i]
      this.carModel.position.copy(points)
      this.carModel.lookAt(nextPos.x, nextPos.y, nextPos.z)
    }
    EffectManager.getInstance().addEffect(fn)
  })
}

// 车位出场 -> 一体杆前
Car.prototype.moveParkingSpaceToPole = function(){ 
  // 找到路线物体
  return new Promise((resolve) => {
    const lx = this.scene.getObjectByName(`${this.carDataObj.parkNum}_出场路线`)
    const points = getPoints(lx)

    let i = 0
    const fn = () => {
      // 先进场
      if (i < points.length - 1) {
        this.carModel.position.copy(points[i++])
        this.carModel.lookAt(points[i])
      } else {
        // 动画完成
        resolve()
        EffectManager.getInstance().removeEffect(fn)
      }
    }
    EffectManager.getInstance().addEffect(fn)
  })
}

// 一体杆->出场（动画）
Car.prototype.movePoleToLeavePark = function () {
  return new Promise((resolve) => {
    const lx = this.scene.getObjectByName(`${this.carDataObj.areaName}_出场路线`)
    const points = getPoints(lx)
    let i = 0
    const fn = () => {
      // 先进场
      if (i < points.length - 1) {
        this.carModel.position.copy(points[i++])
        this.carModel.lookAt(points[i])
      } else {
        // 场外路线运动完毕
        EffectManager.getInstance().removeEffect(fn)
        resolve()
      }
    }
    EffectManager.getInstance().addEffect(fn)
  })
}