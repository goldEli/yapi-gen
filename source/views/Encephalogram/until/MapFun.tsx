import G6, { Util } from '@antv/g6'
import { setExtraParams } from '@store/encephalogram'
import { store } from '@store/index'

const getGraph = () => {
  let graph: any = null
  const container = document.querySelector('#MapContentMountNode')
  if (container) {
    G6.registerNode(
      'customNode',
      {
        getAnchorPoints() {
          return [
            [0, 0.5],
            [1, 0.5],
          ]
        },
        drawShape: (cfg: any, group: any) => {
          const content = cfg.name
          const { fill, color, fontSize } = cfg.style || {}
          let wd = Util.getTextSize(cfg.name, cfg.style.fontSize)[0] + 30
          if (cfg.depth === 0) {
            cfg.extra?.forEach((info: any, index: number) => {
              const width = Util.getTextSize(info.name, 12)[0] + 20
              if (width > wd) {
                wd = width
              }
              group.addShape('rect', {
                attrs: {
                  fill: info.fill,
                  width: Util.getTextSize(info.name, 12)[0] + 20,
                  height: 20,
                  y: 50 + index * 30,
                  radius: [2, 2, 2, 2],
                },
                name: 'yp_rect' + index,
              })
              group.addShape('text', {
                attrs: {
                  text: info.name,
                  x: 10,
                  y: 61 + index * 30,
                  textBaseline: 'middle',
                  fill: info.color,
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
              width: wd > 100 ? wd : 100,
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
              fontWeight: 500,
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
        const item = e.item.getModel() || {}
        if (item.node_type === 'project' || item.node_type === 'user') {
          return ''
        }
        const outDiv = document.createElement('div')
        outDiv.style.width = 'fit-content'
        outDiv.innerHTML = `
          <ul style="color: #ffffff;list-style: none; margin: 0px;padding:0px;min-width:200px">
          <li style="margin-bottom: 8px">预计工期：${
            item.expect_duration ?? 0
          } 天</li>
          <li style="margin-bottom: 8px">实际工期：${
            item.real_duration ?? 0
          } 天</li>
          <li style="margin-bottom: 8px">当前进度：${item.schedule ?? 0} %</li>
          ${
            item?.handlers?.length
              ? `<li style="display: flex">
          <div style="white-space: nowrap; margin-right: 8px">处理人：</div>
          <div style="display: flex; flex-direction: column">
            ${item?.handlers
              ?.map?.((k: any) => {
                return `
              <div  key=${
                k.id
              } style="display: flex; font-size: 12px; margin-bottom: 8px;align-items:center">
              <img
                src=${
                  k.avatar ||
                  'https://mj-system-1308485183.cos.accelerate.myqcloud.com/public/light.png'
                }
                width="24px"
                height="24px"
                style="margin-right: 4px;border-radius: 50%"
              />
              ${k.department_name}-${k.position_name}-${k.name}
            </div>`
              })
              .join('')}
          </div>
        </li>`
              : '<span style="color: #ffffff;">处理人：--</span>'
          }
          
        </ul> `
        return outDiv
      },
    })
    const width = container.scrollWidth
    const height = container.scrollHeight || 500
    graph = new G6.TreeGraph({
      container: 'MapContentMountNode',
      width,
      height,
      modes: {
        // eslint-disable-next-line quotes
        default: [
          {
            type: 'collapse-expand',
            onChange: (item: any, collapsed: any) => {
              const data = item.get('model')
              graph.updateItem(item, {
                collapsed,
              })
              data.collapsed = collapsed
              const time = (data?.children?.length ?? 0) * 0.5
              if (collapsed) {
                if (data?.children?.length > 100) {
                  setTimeout(() => {
                    graph.fitCenter()
                  }, time)
                }
              } else {
                if (data.deep >= 3 && data?.children?.length > 100) {
                  setTimeout(() => {
                    graph.focusItem(data.id, true)
                  }, time)
                }
              }
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
      nodeStateStyles: {
        hover: {
          stroke: 'rgba(143,188,255,0.7)',
          lineWidth: 2,
        },
      },
      layout: {
        type: 'compactBox',
        direction: 'LR',
        getHeight: function getHeight() {
          return 40
        },
        getHGap: function getHGap(cfg: any) {
          const wd =
            Util.getTextSize(cfg.name, cfg.style.fontSize || 14)[0] + 20
          return wd > 100 ? wd : 100
        },
      },
      plugins: [tooltip],
    })
    graph.on('wheel', () => {
      store.dispatch(
        setExtraParams({
          numType: 'wheel',
          num: Number(graph.getZoom().toFixed(2)),
        }),
      )
    })
    graph.on('node:mouseenter', (event: any) => {
      const { item } = event
      const data = item.getModel()
      graph.setItemState(item, 'hover', true)
      if (data.node_type === 'project' || data.node_type === 'user') {
        tooltip.hide()
      }
    })

    graph.on('node:mouseleave', (event: any) => {
      const { item } = event
      graph.setItemState(item, 'hover', false)
    })
  }
  return graph
}

export default getGraph
