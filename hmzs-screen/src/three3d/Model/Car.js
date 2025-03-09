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

  // // 根据数据关联的停车位，找到停车位物体
  // const parkingSpace = this.scene.getObjectByName(this.carDataObj.parkNum)
  // // 把车辆设置在停车位的位置上
  // this.carModel.position.set(parkingSpace.position.x, parkingSpace.position.y, parkingSpace.position.z)
  // // 根据车位奇数偶数来调整车辆
  // if (this.carDataObj.parkNumber % 2 === 0) {
  //   // 上排汽车
  //   carModel.rotation.y = 1.1714 * Math.PI
  // } else if (this.carDataObj.parkNumber % 2 != 0) {
  //   // 下排汽车
  //   carModel.rotation.y = 0.1666 * Math.PI
  // }
}