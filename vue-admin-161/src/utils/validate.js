/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

// 定义校验手机号的校验函数
export function validMobile(mobile) {
  return /^1[3-9]\d{9}$/.test(mobile)
}

// 校验车牌号
export function validCarNum(carNum) {
  return /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使]{1}[A-Z]{1}[A-Z0-9]{5,6}$/.test(carNum)
}
// 校验中文姓名
export function validChineseName(name) {
  return /^[\u4e00-\u9fa5]{2,10}$/.test(name)
}

// 校验楼层
export function validFloor(floor) {
  return /^([1-9]|1[0-9]|20)$/.test(floor)
}

// 校验楼宇名称
export function validBuildingName(name) {
  return /^办公楼([1-9]\d*)栋$/.test(name)
}

// 校验楼宇面积
export function validBuildingArea(area) {
  return /[1-9]\d*.\d*|0\.\d*[1-9]\d*/.test(area)
}

// 校验物业费
export function validPropertyFeePrice(price) {
  return /[1-9]\d*.\d*|0\.\d*[1-9]\d*/.test(price)
}

// 校验区域面积（正整数）
export function validAreaOfRegion(area) {
  return /^[1-9]\d*$/.test(area)
}
