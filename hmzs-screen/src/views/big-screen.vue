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
      </div>
      <!-- 3D部分 -->
      <div class="model-container">
        <div class="canvas-3d"></div>
      </div>
    </VScaleScreen>
  </div>
</template>

<script setup>
  // 目标：缩放适配
  // 1.下载v-scale-screen
  // 2.引入插件暴露的组件使用
  import VScaleScreen from 'v-scale-screen'
  import { ref } from 'vue'
  import { getParkInfoAPI } from '@/apis/index'
  import * as echarts from 'echarts'

  // 园区概况
  const parkInfo = ref({})
  const getParkInfo = async () => {
    const res = await getParkInfoAPI()
    console.log(res)
    parkInfo.value = res.data
    initBarChart() // 既保证有数据，也保证了 DOM 加载完毕
  }
  getParkInfo()

  // 园区收入分析
  // 渲染年度收入分析图表
  const barChart = ref(null) // 关联具体的容器盒子标签
  const initBarChart = () => { // 创建图表函数
    // 1. 解构图表数据
    const { parkIncome } = parkInfo.value
    // 2. == 根据业务：准备好的options数据 ==
    const barOptions = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      grid: {
        // 让图表占满容器
        top: '10px',
        left: '0px',
        right: '0px',
        bottom: '0px',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          axisTick: {
            alignWithLabel: true,
            show: false,
          },
          // x轴绑定数据
          data: parkIncome.xMonth,
        },
      ],
      yAxis: [
        {
          type: 'value',
          splitLine: {
            show: false,
          },
        },
      ],
      series: [
        {
          name: '园区年度收入',
          type: 'bar',
          barWidth: '10px',
          data: parkIncome.yIncome.map((item, index) => {
            const color =
              index % 2 === 0
                ? new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0.23, color: '#74c0f8' },
                  { offset: 1, color: 'rgba(116,192,248,0.00)' },
                ])
                : new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0.23, color: '#ff7152' },
                  { offset: 1, color: 'rgba(255,113,82,0.00)' },
                ])
            return { value: item, itemStyle: { color } }
          }),
        },
      ],
      textStyle: {
        color: '#B4C0CC',
      },
    }
    // 3. 渲染图表
    const myBarChart = echarts.init(barChart.value)
    myBarChart.setOption(barOptions)
  }
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
</style>