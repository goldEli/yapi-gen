import React, { useEffect } from 'react'
import { MapContentBox } from '@/views/Encephalogram/styles'
import G6, { Util } from '@antv/g6'

// type MapContentPropsType = {}

const MapContent = (props: any) => {
  useEffect(() => {
    const container = document.querySelector('#MapContentMountNode')
    if (container) {
      G6.registerNode(
        'customNode',
        {
          // jsx: (cfg: any) => {
          //   const width = Util.getTextSize(cfg.label, 14)[0] + 16
          //   const color = cfg.color || cfg.style.stroke
          //   return `
          //       <group>
          //         <rect draggable="true" style={{width: ${
          //           width + 16
          //         }, height: 40,fill:'#FFF383',textAlign: 'center', }} keyshape>
          //           <text draggable="true" style={{ fontSize: 14,marginLeft:16 ,marginTop: 10}}>${
          //             cfg.label
          //           }</text>
          //         </rect>
          //       </group>
          //     `
          // },
          getAnchorPoints() {
            return [
              [0, 0.5],
              [1, 0.5],
            ]
          },
          draw: (cfg: any, group: any) => {
            console.log(cfg, group, 'xxxxxx')
            const content = cfg.label
            const { fill, color, fontSize, fontWeight, fontFamily } =
              cfg.style || {}
            const rect = group.addShape('rect', {
              attrs: {
                fill,
                stroke: '#D5D6D9',
                width: Util.getTextSize(cfg.label, fontSize || 14)[0] + 20,
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
            if (hasChildren) {
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
            return group
          },
          update: (cfg, item) => {
            const group = item.getContainer()
            const icon = group.find(e => e.get('name') === 'collapse-icon')
            icon.attr(
              'symbol',
              cfg.collapsed ? G6.Marker.expand : G6.Marker.collapse,
            )
          },
          setState(name, value, item: any) {
            const keyShape = item.getKeyShape()
            switch (name) {
              case 'hover':
                keyShape.attr({
                  stroke: '#f00',
                  fill: '#f00',
                })
                break
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
          // <li>预计工期: ${e.item.getModel().label || e.item.getModel().id}</li>
        },
      })
      const width = container.scrollWidth
      const height = container.scrollHeight || 500
      const graph = new G6.TreeGraph({
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
          style: {
            stroke: '#D5D6D9',
          },
        },
        layout: {
          type: 'compactBox',
          direction: 'LR',
          getId: function getId(d: any) {
            return d.id
          },
        },
        plugins: [tooltip],
      })
      const data = {
        id: '1',
        label: 'SLG框架开发',
        style: {
          color: '#323233',
          fontWeight: 500,
          fontFamily: 'SiYuanMedium',
          fontSize: 18,
          fill: '#FFFFFF',
        },
        children: [
          {
            id: '11',
            label: '主分类-英雄',
            style: {
              color: '#323233',
              fontWeight: 500,
              fontFamily: 'SiYuanMedium',
              fontSize: 16,
              fill: '#FFFFFF',
            },
            children: [
              {
                id: '111',
                label: '子分类-等级',
                style: {
                  fill: '#FFFFFF',
                },
                children: [
                  {
                    id: '111-1',
                    label: '父级任务-英雄养成',
                    style: {
                      fill: '#FFF383',
                    },
                    children: [
                      {
                        id: '1111-1',
                        label: '子任务-UE 2.0',
                        style: {
                          fill: '#BBFFBA',
                        },
                        children: [
                          {
                            id: '11111-1',
                            label: '美术组UED1',
                          },
                        ],
                      },
                      {
                        id: '1111-2',
                        label: '子任务-UE 2.1',
                        style: {
                          fill: '#BBFFBA',
                        },
                        children: [
                          {
                            id: '1111-2-1',
                            label: '美术组UED2',
                          },
                        ],
                      },
                      {
                        id: '1111-3',
                        label: '子任务-UE 2.2',
                        style: {
                          fill: '#E4D8FF',
                        },
                        children: [
                          {
                            id: '1111-3-1',
                            label: '美术组UED3',
                          },
                        ],
                      },
                      {
                        id: '1111-4',
                        label: '子任务-UE 2.3',
                        style: {
                          fill: '#FFC8A0',
                        },
                        children: [
                          {
                            id: '1111-4-1',
                            label: '3D设计组',
                          },
                        ],
                      },
                      {
                        id: '1111-5',
                        label: '子任务-UE 2.4',
                        style: {
                          fill: '#E4D8FF',
                        },
                        children: [
                          {
                            id: '1111-5-1',
                            label: '3D设计组',
                          },
                        ],
                      },
                      {
                        id: '1111-6',
                        label: '子任务-UE 2.5',
                        style: {
                          fill: '#FFC8A0',
                        },
                        children: [
                          {
                            id: '1111-6-1',
                            label: '客户端组',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    id: '111-2',
                    label: '父级任务-英雄等级',
                    style: {
                      fill: '#BBFFBA',
                    },
                  },
                  {
                    id: '111-3',
                    label: '父级任务-英雄主界面',
                    style: {
                      fill: '#FFC8A0',
                    },
                  },
                ],
              },
              {
                id: '112',
                label: '子分类-天赋',
                style: {
                  fill: '#FFFFFF',
                },
                children: [
                  {
                    id: '112-1',
                    label: '父级任务-天赋-ui2.0',
                    style: {
                      fill: '#FFF383',
                    },
                  },
                  {
                    id: '112-2',
                    label: '父级任务-天赋-ue2.0',
                    style: {
                      fill: '#BBFFBA',
                    },
                  },
                ],
              },
              {
                id: '113',
                label: '子分类-星际',
                style: {
                  fill: '#FFFFFF',
                },
                children: [
                  {
                    id: '113-1',
                    label: '父级任务-天赋-ui2.0',
                    style: {
                      fill: '#BBFFBA',
                    },
                  },
                  {
                    id: '113-2',
                    label: '父级任务-天赋-ue2.0',
                    style: {
                      fill: '#E4D8FF',
                    },
                  },
                ],
              },
            ],
          },
          {
            id: '22',
            label: '副分类-练级',
            style: {
              color: '#323233',
              fontWeight: 500,
              fontFamily: 'SiYuanMedium',
              fontSize: 16,
              fill: '#FFFFFF',
            },
          },
        ],
      }
      graph.data(data)
      graph.render()
      graph.fitCenter()
      graph.on('node:mouseenter', (e: any) => {
        graph.setItemState(e.item, 'hover', true)
      })

      graph.on('node:mouseleave', (e: any) => {
        graph.setItemState(e.item, 'hover', false)
      })

      // graph.on('node:mouseenter', (e: any) => {
      //   const node = e.item
      //   graph.updateItem(node, {
      //     style: {
      //       stroke: 'rgba(143, 188, 255, 0.7)',
      //       lineWidth: 3,
      //     },
      //   })
      // })
      // graph.on('node:mouseleave', (e: any) => {
      //   const node = e.item
      //   graph.updateItem(node, {
      //     style: {
      //       stroke: '#D5D6D9',
      //       lineWidth: 3,
      //     },
      //   })
      // })
    }
  }, [])

  return <MapContentBox id="MapContentMountNode" />
}
export default MapContent
