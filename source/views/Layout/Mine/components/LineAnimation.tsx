import { Line } from '@ant-design/plots'

const LineAnimation = (props: any) => {
  const config = {
    data: props.data,
    xField: 'year',
    yField: 'gdp',
    seriesField: 'name',

    yAxis: {
      grid: {
        line: {
          style: {
            stroke: 'black',
            lineWidth: 1,
            lineDash: [4, 3],
            strokeOpacity: 0.1,
          },
        },
      },
      label: {
        formatter: (v: any) => v,
      },
    },

    smooth: false,
    // @TODO 后续会换一种动画方式
    animation: {
      appear: {
        animation: 'path-in',
        duration: 5000,
      },
    },
  }

  return <Line {...config} />
}

export default LineAnimation
