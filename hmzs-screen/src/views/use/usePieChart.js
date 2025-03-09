import { ref } from 'vue'
import * as echarts from 'echarts'
export function usePieChart() {
  // 园区产业分布
  // 渲染园区产业分布图表
  const pieChart = ref(null) // 关联具体绘制到的标签
  const initPieChart = (parkInfo) => {
    const { parkIndustry } = parkInfo.value
    // == 根据业务：准备好的options数据 ==
    const pieOption = {
      color: [
        '#00B2FF', '#2CF2FF', '#892CFF', '#FF624D', '#FFCF54', '#86ECA2'],
      legend: {
        itemGap: 20,
        bottom: '0',
        icon: 'rect',
        itemHeight: 10, // 图例icon高度
        itemWidth: 10, // 图例icon宽度
        textStyle: {
          color: '#c6d1db',
        },
      },
      tooltip: {
        trigger: 'item'
      },
      series: [
        {
          name: '园区产业分析',
          type: 'pie',
          radius: ['55%', '60%'], // 设置内圈与外圈的半径使其呈现为环形
          center: ['50%', '40%'], // 圆心位置， 用于调整整个图的位置
          tooltip: {
            trigger: 'item',
            formatter: (params) => {
              return `${params.seriesName}</br><div style='display:flex;justify-content: space-between;'><div>${params.marker}${params.name}</div><div>${params.percent}%</div></div>`
            }
          },
          label: {
            show: false,
            position: 'center',
          },
          data: parkIndustry,
        },
      ],

    }

    // 渲染
    const myPieChart = echarts.init(pieChart.value)
    myPieChart.setOption(pieOption)
  }
  return { pieChart, initPieChart }
}