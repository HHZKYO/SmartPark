// import { getPointsByLine } from '@/utils/points'
import { getPoints } from '@/utils/points'

// 车辆类
// 场景，摄像机，控制器，车辆模型，车辆数据
export function Car(scene, camera, controls, carModel, carDataObj) {
  this.scene = scene;
  this.camera = camera;
  this.controls = controls;
  this.carModel = carModel;
  this.carDataObj = carDataObj;
  this.scene.add(this.carModel)
  this.carModel.scale.set(0.8, 0.8, 0.8)

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

// 创建入场车辆->运动到进场一体杆
Car.prototype.moveEnterFormStartToPole = function(){
  // 目标：3D物体运动的路径规划
  // 方式1：自己计算几个关键的三维坐标点，然后生成一个曲线路径物体，并分割成指定段数，并返回所有坐标点集合
  // 方式2：根据建模师建好的线段物体，收集对应的坐标点集合
  const points = getPoints(
    this.scene.getObjectByName(`${this.carDataObj.areaName}_进场路线`)
  )
  console.log(points)
  // return new Promise(() => {
  //   const lx = this.scene.getObjectByName(`${this.carDataObj.areaName}_进场路线`)
  //   const points = getPointsByLine(lx)
  //   console.log(points)
  // })
}