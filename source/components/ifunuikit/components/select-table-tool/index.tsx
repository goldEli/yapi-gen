import React, { useState } from 'react'
import { HightLightTd, ToolTable } from './style'

const SelectTableTool = (props: any) => {
  const row = new Array(10).fill(1)
  const [axis, setAxis] = useState({ rows: 1, cols: 1 })
  const onTap = (x: number, y: number) => {
    props.getAxis({ rows: x, cols: y })
  }
  const onMove = (event: any) => {
    const xAxis = event.target.getAttribute('data-x')
    const yAxis = event.target.getAttribute('data-y')
    setAxis({ rows: xAxis, cols: yAxis })
  }
  return (
    <div>
      <div style={{ textAlign: 'center' }}>
        {axis.rows} x {axis.cols}
      </div>
      <ToolTable id="table">
        {row.map((item, rowindex) => (
          // eslint-disable-next-line react/no-array-index-key
          <tr key={rowindex}>
            {row.map((items, colindex) => (
              <HightLightTd
                // eslint-disable-next-line react/no-array-index-key
                key={colindex}
                light={colindex + 1 <= axis.rows && rowindex + 1 <= axis.cols}
                onMouseOver={onMove}
                onClick={() => {
                  onTap(colindex + 1, rowindex + 1)
                }}
                data-x={colindex + 1}
                data-Y={rowindex + 1}
              />
            ))}
          </tr>
        ))}
      </ToolTable>
    </div>
  )
}

export default SelectTableTool
