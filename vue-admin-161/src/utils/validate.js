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
