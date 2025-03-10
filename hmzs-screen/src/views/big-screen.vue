<template>
  <div>
    <!-- 3.告诉适配组件我是按照多少宽高设计图实现的 -->
    <VScaleScreen width="1920" height="1080">
      <!-- <img src="@/assets/img.png" alt=""> -->
      <!-- 2D部分 -->
      <div class="all-charts" >
        <!-- 园区概况 -->
        <div class="section-one">
          <img class="img-header"
            src="https://yjy-teach-oss.oss-cn-beijing.aliyuncs.com/smartPark/%E5%A4%A7%E5%B1%8F%E5%88%87%E5%9B%BE/%E5%9B%AD%E5%8C%BA%E6%A6%82%E5%86%B5%402x.png"
            alt="" />
          <div class="icons-container">
            <div class="item">
              <div class="icons-item building-icon">
                <span class="number">               
                  <!-- 首次渲染（后端数据没有返回）
                  parkInfo - {} - {}.base -> undefined -> undefined.buidingTotal
                  二次渲染（后端数据返回之后 响应式状态发生变化 再次引起模版渲染）
                  场景：访问一个空对象多层次的属性
                  解决办法：可选链?.   保证必须前面有值才会继续往后进行点运算 -->
                  {{ parkInfo.base?.buildingTotal }}
                </span>
              </div>
              <span class="title">楼宇总数</span>
              <span class="unity">（栋）</span>
            </div>
            <div class="item">
              <div class="icons-item enterprise-icon">
                <span class="number">
                  {{ parkInfo.base?.enterpriseTotal }}
                </span>
              </div>
              <span class="title">入驻企业总数</span>
              <span class="unity">（家）</span>
            </div>
            <div class="item">
              <div class="icons-item car-icon">
                <span class="number">
                  {{ parkInfo.base?.parkingTotal }}
                </span>
              </div>
              <span class="title">车位总数</span>
              <span class="unity">（个）</span>
            </div>
            <div class="item">
              <div class="icons-item rod-icon">
                <span class="number">
                  {{ parkInfo.base?.chargePoleTotal }}
                </span>
              </div>
              <span class="title">一体杆总数</span>
              <span class="unity">（个）</span>
            </div>
          </div>
        </div>
        <!-- 园区年度收入分析 -->
        <div class="section-two">
          <img class="img-header"
            src="https://yjy-teach-oss.oss-cn-beijing.aliyuncs.com/smartPark/%E5%A4%A7%E5%B1%8F%E5%88%87%E5%9B%BE/%E5%9B%AD%E5%8C%BA%E5%B9%B4%E5%BA%A6%E6%94%B6%E5%85%A5%E5%88%86%E6%9E%90%402x.png"
            alt="" />
          <div class="bar-chart-titile">
            <span>单位：元</span>
            <div>
              <span class="bar-icon blue-bar-icon"></span>
              <span class="bar-icon red-bar-icon"></span>
              收入情况
            </div>
          </div>
          <div class="bar-chart" ref="barChart"></div>
        </div>
        <!-- 园区产业分布 -->
        <div class="section-three">
          <img class="img-header"
            src="https://yjy-teach-oss.oss-cn-beijing.aliyuncs.com/smartPark/%E5%A4%A7%E5%B1%8F%E5%88%87%E5%9B%BE/%E5%9B%AD%E5%8C%BA%E4%BA%A7%E4%B8%9A%E5%88%86%E5%B8%83%402x.png"
            alt="" />
          <div class="pie-chart" ref="pieChart"></div>
        </div>
      </div>
      <!-- 3D部分 -->
      <div class="model-container">
        <div class="canvas-3d"></div>
      </div>
    </VScaleScreen>
  </div>

  <!-- 加载建筑说明标签 -->
  <build-info-vue></build-info-vue>
</template>

<script setup>
// 目标：缩放适配
// 1.下载v-scale-screen
// 2.引入插件暴露的组件使用
import VScaleScreen from 'v-scale-screen'
// import { ref } from 'vue'
// import * as echarts from 'echarts'
import { useParkInfo } from './use/useParkInfo'
import { useBarChart } from './use/useBarChart'
import { usePieChart } from './use/usePieChart'

// 园区概况
const { parkInfo, getParkInfo } = useParkInfo()
// 园区收入分析
const { barChart, initBarChart } = useBarChart()
// 园区产业分布
const { pieChart, initPieChart } = usePieChart()

const init = async () => {
  await getParkInfo()
  initBarChart(parkInfo)
  initPieChart(parkInfo)
}
init()


// import { useWindowScroll } from '@vueuse/core'

// // 调用组合函数，得到一个水平、垂直方向滚动距离的响应式对象
// const { x, y } = useWindowScroll()


/********************************************************************* */
// 3D
import { Create3d } from '@/three3d/index.js'
import { LoadingManager } from '../utils/LoadingManager'
import { Car } from '../three3d/Model/Car'
import * as THREE from 'three'
import { MouseHandler } from '../utils/MouseHandler' // 鼠标管理类
import BuildInfoVue from '../components/build-info.vue'
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js'
import { getBuildInfoAPI } from '../apis'
import { useStore } from 'vuex'
import { CameraBuildPositon, CameraParams } from '../const'
import gsap from 'gsap'
const store = useStore()


function cameraMove(camera, controls, position, targetPosition) {
  gsap.to(camera.position, {
    x: position.x,
    y: position.y,
    z: position.z,
    duration: 1.0,
    onUpdate() {
      controls.target = targetPosition;
      controls.update();
    },
  });
}


// onMounted 拿不到真实 DOM 计算后的高度，所以用 setTimeout
setTimeout(async () => {
  // 初始化 3d 基础环境
  const { scene, camera, renderer, controls, dom, css2dRenderer } = new Create3d('.canvas-3d')
  // 初始化鼠标管理类（内部就在dom身上注册了鼠标移动和点击的事件监听）
  MouseHandler.getInstance().init(scene, camera, dom)

  // 技巧：找摄像机最佳的起始位置
  // 给轨道控制器绑定 change 事件并打印摄像机当前的位置和观察的坐标点
  // controls.addEventListener('change', () => {
  //   console.log(camera.position) // 摄像机坐标点
  //   console.log(controls.target) // 轨道控制器影响摄像机观察的坐标点
  // })

  // 加载背景图
  const cubeTextureLoader = new THREE.CubeTextureLoader();
  const envMap = cubeTextureLoader.load([
    new URL("@/assets/sky/1.jpg", import.meta.url).href,
    new URL("@/assets/sky/2.jpg", import.meta.url).href,
    new URL("@/assets/sky/3.jpg", import.meta.url).href,
    new URL("@/assets/sky/4.jpg", import.meta.url).href,
    new URL("@/assets/sky/5.jpg", import.meta.url).href,
    new URL("@/assets/sky/6.jpg", import.meta.url).href,
  ]);
  scene.background = envMap;

  // 把模型文件->加载成模型数据对象
  const modelList = await LoadingManager([
    new URL("@/assets/glb/park.glb", import.meta.url).href,
    new URL("@/assets/glb/car001.glb", import.meta.url).href,
    new URL("@/assets/glb/car002.glb", import.meta.url).href,
    new URL("@/assets/glb/car003.glb", import.meta.url).href,
    new URL("@/assets/glb/car004.glb", import.meta.url).href,
    new URL("@/assets/glb/car005.glb", import.meta.url).href,
    new URL("@/assets/glb/car006.glb", import.meta.url).href,
    new URL("@/assets/glb/car007.glb", import.meta.url).href,
  ])
  // 把第一个园区对象加载到场景中
  const park3d = modelList[0]
  scene.add(park3d)

  // 添加车辆到场景中
  const initObj = {
    type: "PARKING_LIST",
    list: [
      {
        areaId: 4,
        areaName: "停车场1号", // 停车场区域名字
        car: {
          carNumber: "赣H11J9F",
          carTypeName: "小型车",
          chargeType: "temp",
          chargeTypeName: "临时停车",
          driverName: "莫苛",
          entranceTime: "2023-12-09 15:56:11",
          modelIndex: 3, // 模型下标
          parkingTime: "48分钟",
          status: 2, // 2 已在场，1 待进场，0 待出场
        },
        id: 31, // 车辆 id
        parkNum: "停车位1号", // 车辆所占车位名
        parkNumber: 1, // 车辆所占车位数字
      },
      {
        areaId: 4,
        areaName: "停车场1号", // 停车场区域名字
        car: {
          carNumber: "赣H11J9F",
          carTypeName: "小型车",
          chargeType: "temp",
          chargeTypeName: "临时停车",
          driverName: "莫苛",
          entranceTime: "2023-12-09 15:56:11",
          modelIndex: 3, // 模型下标
          parkingTime: "48分钟",
          status: 2, // 2 已在场，1 待进场，0 待出场
        },
        id: 31, // 车辆 id
        parkNum: "停车位5号", // 车辆所占车位名
        parkNumber: 5, // 车辆所占车位数字
      },
      {
        areaId: 4,
        areaName: "停车场1号",
        car: {
          carNumber: "甘H80106",
          carTypeName: "小型车",
          chargeType: "temp",
          chargeTypeName: "临时停车",
          driverName: "陈督丙",
          entranceTime: "2023-12-09 15:56:11",
          modelIndex: 1,
          parkingTime: "48分钟",
          status: 2,
        },
        id: 32,
        parkNum: "停车位6号",
        parkNumber: 6,
      },
      {
        areaId: 5,
        areaName: "停车场2号",
        car: {
          carNumber: "浙B93871",
          carTypeName: "小型车",
          chargeType: "temp",
          chargeTypeName: "临时停车",
          driverName: "岑迢",
          entranceTime: "2023-12-09 15:56:11",
          modelIndex: 5,
          parkingTime: "48分钟",
          status: 2,
        },
        id: 33,
        parkNum: "停车位9号",
        parkNumber: 9,
      },
    ],
  }
  initObj.list.forEach(dataObj => {
    // 问题：如果多个车用同一个车辆模型对象，会共用一个
    // 解决：物体可以通过调用 clone 方法克隆一个完全一致的物体对象出来
    new Car(scene, camera, controls, modelList[dataObj.car.modelIndex].clone(), dataObj)
  })



  // 空白缓冲几何体图形
  const hoverGeometry = new THREE.BufferGeometry();
  const hoverMaterial = new THREE.MeshBasicMaterial({
    color: 0x1dd6ff,
    transparent: true,
    opacity: 0.5,
  });
  const hoverMesh = new THREE.Mesh(hoverGeometry, hoverMaterial);
  hoverMesh.visible = false;
  scene.add(hoverMesh);

  // 获取 div 标签物体
  const buildInfoDiv = document.querySelector('.build-info')
  // div 标签 => 2D物体
  const buildDiv2d = new CSS2DObject(buildInfoDiv)
  buildDiv2d.visible = false
  // 加载到场景中
  scene.add(buildDiv2d)
  // 给 x 绑定点击事件
  const buildInfoCloseImg = document.querySelector('.build-info .close-icon')
  buildInfoCloseImg.style.pointerEvents = 'all'
  buildInfoCloseImg.addEventListener('click', () => {
    buildDiv2d.visible = false
    // 把视角恢复到最起始位置
    cameraMove(camera, controls, CameraParams.initPos, new THREE.Vector3(...Object.values(CameraParams.initControlsTarget)))
    controls.enabled = true
  })
  // 防止点击 x 让 canvas-3d 标签的按下事件触发，导致关闭说明标签又去到了另一个楼的点击效果
  buildInfoCloseImg.addEventListener('mousedown', e => e.stopPropagation())


  // 经验：找到一个 3D 物体，可以通过名字查找
  // 语法：父级物体对象.getObjectByName(物体名字) => 原地值：物体对象（找一个）
  // 语法：物体对象.traverse(obj3d => {}) => 遍历指定物体中所有子物体对象
  park3d.traverse(obj3d => {
    // 筛选我想要的物体（在物体名字上找规律）
    if (/(路线)$/.test(obj3d.name)) {
      obj3d.visible = false;
    } else if (/^办公楼\d+栋$/.test(obj3d.name)) {
      // 进到这里 obj3d 就是办公楼物体
      // 办公楼鼠标移动事件
      MouseHandler.getInstance().addHoverMesh(obj3d, (target) => {
        // target 等价于 obj3d
        // console.log(target)
        // 目标：把楼宇几何图形和位置与旋转角度+缩放大小给 hover 物体
        hoverMesh.geometry.copy(target.geometry);
        hoverMesh.position.copy(target.position);
        hoverMesh.rotation.copy(target.rotation);
        hoverMesh.scale.copy(target.scale);
        hoverMesh.visible = true
      })

      // 办公楼绑定点击事件（注意里面是按下+抬起+判断坐标点来确认是否进行了完整的点击动作）
      MouseHandler.getInstance().addClickMesh(obj3d, async (target) => {
        // 把2D物体位移到点击的建筑物位置
        buildDiv2d.position.copy(target.position)
        buildDiv2d.visible = true

        // 思路：点击建筑楼宇拿到名字，去数据对象里换取摄像机坐标，设置给摄像机
        // 视角切换
        const targetP = CameraBuildPositon[target.name]
        cameraMove(camera, controls, targetP, target.position)
        controls.enabled = false

        // 开始请求点击的这个楼的详情信息
        const res = await getBuildInfoAPI(target.userData.uid)
        console.log(res)
        store.commit('build/setBuildInfo', res.data)
      })
    } else if (/^地面$/.test(obj3d.name)) {
      // 地面物体
      MouseHandler.getInstance().addHoverMesh(obj3d, () => {
        hoverMesh.visible = false
      })
    }
  })

  // 渲染循环
  function renderLoop() {
    renderer.render(scene, camera)
    // 3.在它的 div 盒子上进行渲染改变位置（进行 translate 等位移用）
    css2dRenderer.render(scene, camera)
    controls.update()
    requestAnimationFrame(renderLoop)
  }
  renderLoop()
})
</script>

<style lang='scss' scoped>
.all-charts {
  position: absolute;
  top: 0;
  left: 0;
  width: 480px;
  height: 100%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: linear-gradient(to left, rgba(0, 6, 15, 0.00) 0%, rgba(0, 6, 15, 0.00) 20%, rgba(0, 0, 0, 0.40) 30%, rgba(0, 0, 0, 0.60) 40%, rgba(1, 4, 11, 1) 70%, #04070d 100%);

  .img-header {
    height: 30px;
  }
}

.section-one {
  flex-basis: 25%;
  .icons-container {
    display: flex;
    justify-content: space-between;
    padding: 20px 0;

    .item {
      text-align: center;
      display: flex;
      flex-direction: column;
      flex: 1;

      .icons-item {
        height: 80px;
        position: relative;

        .number {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          font-size: 18px;
          font-family: FontquanXinYiGuanHeiTi, FontquanXinYiGuanHeiTi-Regular;
          color: #ffffff;
        }
      }

      .building-icon {
        background: url('@/assets/building-icon.png') no-repeat 50% 0 / contain;
      }

      .enterprise-icon {
        background: url('@/assets/enterprise-icon.png') no-repeat 50% 0 / contain;
      }

      .rod-icon {
        background: url('@/assets/rod-icon.png') no-repeat 50% 0 / contain;
      }

      .car-icon {
        background: url('@/assets/car-icon.png') no-repeat 50% 0 / contain;
      }

      .title,
      .unity {
        font-size: 14px;
        color: #cdd7e1;
      }

      .title {
        margin-top: 8px;
      }
    }
  }

  .section-three {
    flex-basis: 40%;
    margin-top: 50px;
    .pie-chart {
      position: relative;
      margin: 0 auto;
      padding-bottom: 20px;
      width: 80%;
      height: calc(100% - 40px);
    }
  }
}

.section-two {
  // 主轴宽度（y轴）
  flex-basis: 35%;
  margin-top: 50px;

  .bar-chart {
    width: 100%;
    height: calc(100% - 90px);
  }
}

.section-three {
  flex-basis: 40%;
  margin-top: 50px;
  .pie-chart {
    position: relative;
    margin: 0 auto;
    padding-bottom: 20px;
    width: 80%;
    height: calc(100% - 40px);
  }
}

.model-container, .canvas-3d {
  height: 100%;
}
</style>