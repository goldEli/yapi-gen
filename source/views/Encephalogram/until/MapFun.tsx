import G6, { Util } from '@antv/g6'

const getGraph = () => {
  let graph: any = null
  const container = document.querySelector('#MapContentMountNode')
  if (container) {
    G6.registerNode(
      'customNode',
      {
        getAnchorPoints(cfg: any) {
          return [
            [0, 0.5],
            [1, 0.5],
          ]
        },
        drawShape: (cfg: any, group: any) => {
          const content = cfg.name
          const { fill, color, fontSize, fontWeight } = cfg.style || {}
          if (cfg.depth === 0) {
            cfg.extra?.forEach((txt: string, index: number) => {
              group.addShape('text', {
                attrs: {
                  text: txt,
                  y: 60 + index * 20,
                  textBaseline: 'middle',
                  fill: color || '#323233',
                  fontSize: 12,
                },
                name: 'text-shape' + index,
              })
            })
          }
          const rect = group.addShape('rect', {
            attrs: {
              fill,
              stroke: '#D5D6D9',
              width: Util.getTextSize(cfg.name, fontSize || 14)[0] + 20,
              height: 40,
            },
            name: 'rect-shape',
          })
          const bbox = rect.getBBox()
          group.addShape('text', {
            attrs: {
              text: content,
              x: 10,
              y: bbox.height / 2,
              textBaseline: 'middle',
              fill: color || '#323233',
              fontWeight,
              fontSize: fontSize || 14,
              fontFamily: 'SiYuanMedium',
            },
            name: 'text-shape',
          })
          const hasChildren = cfg.children && cfg.children.length > 0
          if (hasChildren && cfg.depth !== 0) {
            group.addShape('marker', {
              attrs: {
                x: bbox.width - 1.5,
                y: bbox.height / 2,
                r: 6,
                symbol: cfg.collapsed ? G6.Marker.expand : G6.Marker.collapse,
                stroke: '#969799',
                lineWidth: 1,
              },
              name: 'collapse-icon',
            })
          }
          return rect
        },
        update: (cfg, item) => {
          const group = item.getContainer()
          const icon = group.find(e => e.get('name') === 'collapse-icon')
          if (icon) {
            icon.attr(
              'symbol',
              cfg.collapsed ? G6.Marker.expand : G6.Marker.collapse,
            )
          }
        },
      },
      'rect',
    )
    const tooltip = new G6.Tooltip({
      offsetX: 10,
      offsetY: 10,
      itemTypes: ['node'],
      // 自定义 tooltip 内容
      getContent: (e: any) => {
        const outDiv = document.createElement('div')
        outDiv.style.width = 'fit-content'
        outDiv.innerHTML = `
          <ul style="color: #ffffff;list-style: none; margin: 0px;padding:0px">
          <li style="margin-bottom: 8px">预计工期：25 天</li>
          <li style="margin-bottom: 8px">实际工期：24天</li>
          <li style="margin-bottom: 8px">当前进度：30%</li>
          <li style="display: flex">
            <div style="white-space: nowrap; margin-right: 8px">处理人：</div>
            <div style="display: flex; flex-direction: column">
              <div style="display: flex; font-size: 12px; margin-bottom: 8px;align-items:center">
                <img
                  src="https://oa-1308485183.cos.ap-chengdu.myqcloud.com/oa-dev-img/1504303190303051778/1551758466375991298/2023-04-27/studios_3.webp"
                  width="24px"
                  height="24px"
                  style="margin-right: 4px;border-radius: 50%"
                />
                美术组-UI组长-张三
              </div>
              <div style="display: flex; font-size: 12px;align-items:center">
                <img
                  src="https://oa-1308485183.cos.ap-chengdu.myqcloud.com/oa-dev-img/1504303190303051778/1551758466375991298/2023-04-27/studios_3.webp"
                  width="24px"
                  height="24px"
                  style="margin-right: 4px;border-radius: 50%"
                />
                软件大数据组-UI组长-张三
              </div>
            </div>
          </li>
        </ul>
            `
        return outDiv
        // <li>预计工期: ${e.item.getModel().name || e.item.getModel().id}</li>
      },
    })
    const width = container.scrollWidth
    const height = container.scrollHeight || 500
    graph = new G6.TreeGraph({
      container: 'MapContentMountNode',
      width,
      height,
      groupByTypes: true,
      modes: {
        default: [
          {
            type: 'collapse-expand',
            onChange: (item: any, collapsed: any) => {
              const data = item.get('model')
              graph.updateItem(item, {
                collapsed,
              })
              data.collapsed = collapsed
              return true
            },
          },
          'drag-canvas',
          'zoom-canvas',
        ],
      },
      defaultNode: {
        type: 'customNode',
      },
      defaultEdge: {
        type: 'polyline',
      },
      layout: {
        type: 'compactBox',
        direction: 'LR',
        getId: function getId(d: any) {
          return d.id
        },
        getHeight: function getHeight() {
          return 40
        },
        getHGap: function getHGap(cfg: any) {
          return Util.getTextSize(cfg.name, cfg.fontSize || 14)[0] + 20
        },
      },
      plugins: [tooltip],
    })

    graph.on('node:mouseenter', (e: any) => {
      graph.setItemState(e.item, 'active', true)
    })
    graph.on('node:mouseleave', (e: any) => {
      graph.setItemState(e.item, 'active', false)
    })
  }
  return graph
}

export default getGraph
