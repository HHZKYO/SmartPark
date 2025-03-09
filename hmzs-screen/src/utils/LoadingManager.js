import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export function LoadingManager(fileList){
  return new Promise((resolve, reject) => {
    // 定义加载器对象
    const gltfLoader = new GLTFLoader()
    // 保存加载成功模型对象数组
    const promiseArr = []
    fileList.forEach(path => {
      const promise = gltfLoader.loadAsync(path)
      promiseArr.push(promise)
    })
    Promise.all(promiseArr).then(result => {
      // result 是 GLTFLoader 加载后的结果，模型在对象中的 scene 属性下
      const resultList = result.map(item => item.scene)
      resolve(resultList)
    }).catch(err => {
      reject(err)
    })
  })
}
