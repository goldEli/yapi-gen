import React, { useEffect } from 'react'
import { MapContentBox } from '@/views/Encephalogram/styles'
import G6, { Util } from '@antv/g6'

// type MapContentPropsType = {}

const MapContent = (props: any) => {
  useEffect(() => {
    const container = document.querySelector('#MapContentMountNode')
    if (container) {
      G6.registerNode(
        'dice-mind-map-sub',
        {
          jsx: (cfg: any) => {
            const width = Util.getTextSize(cfg.label, 14)[0] + 16
            const color = cfg.color || cfg.style.stroke

            return `
                <group>
                  <rect draggable="true" style={{width: ${
                    width + 16
                  }, height: 22}} keyshape>
                    <text draggable="true" style={{ fontSize: 14, marginLeft: 12, marginTop: 6 }}>${
                      cfg.label
                    }</text>
                  </rect>
                  <rect style={{ fill: ${color}, width: ${
              width + 16
            }, height: 2, x: 0, y: 22 }} />
                  
                </group>
              `
          },
          getAnchorPoints() {
            return [
              [0, 0.965],
              [1, 0.965],
            ]
          },
        },
        'rect',
      )
      const tooltip = new G6.Tooltip({
        getContent(e) {
          return `<div style='width: 180px;'>
                <ul id='menu' style='cursor:pointer;'>
                  <li title='1'>测试02</li>
                  <li title='2'>测试02</li>
                  <li>测试02</li>
                  <li>测试02</li>
                  <li>测试02</li>
                </ul>
              </div>`
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
          type: 'dice-mind-map-sub',
          size: [100, 40],
        },
        defaultEdge: {
          type: 'polyline',
          style: {
            stroke: '#A3B1BF',
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
        label: 'Modeling Methods',
        children: [
          {
            label: 'Classification',
            children: [
              {
                label: 'Logistic regression',
                style: {
                  fill: '#bae637',
                  lineWidth: 5,
                },
              },
              { label: 'Linear discriminant analysis' },
              { label: 'Probabilistic neural network' },
              { label: 'Probabilistic neural network11' },
              { label: 'Support vector machine' },
            ],
          },
          {
            label: 'Regression',
            children: [
              { label: 'Multiple linear regression' },
              { label: 'Partial least squares' },
              { label: 'Multi-layer feedforward neural network' },
              { label: 'General regression neural network' },
              { label: 'Support vector regression' },
              { label: 'Support vector regression2' },
              { label: 'Support vector regression3' },
            ],
          },
        ],
      }
      graph.data(data)
      graph.render()
      graph.fitView()
    }
  }, [])

  return <MapContentBox id="MapContentMountNode" />
}
export default MapContent
