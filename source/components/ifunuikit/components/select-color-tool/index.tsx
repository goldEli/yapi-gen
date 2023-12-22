import React, { useRef, useState } from 'react'
import {
  BrightIcon,
  ColorChooseInput,
  ColorPanel,
  HightLightSpan,
  HightLightTd,
  MoreButton,
  ToolTable,
} from './styled'

const SelectColorTool = (props: any) => {
  const colorChooseInput = useRef<any>(null)
  const [brightColor, setBrightColor] = useState('')
  const row = new Array(10).fill(1)
  const colorGroup = [
    '#F2F3F7',
    '#FDF1F0',
    '#FEF7E8',
    '#FEFFE8',
    '#F8FFEE',
    '#EBFEFB',
    '#E9F4FE',
    '#F7F1FE',
    '#FCF1F6',
    '#F4F1F0',
    '#D9D9D9',
    '#F3A7A1',
    '#F9D69A',
    '#FEF47D',
    '#C2E899',
    '#9EE6DE',
    '#9CC9FA',
    '#CDB0F2',
    '#F08CBE',
    '#BCAAA2',
    '#969799',
    '#EF8079',
    '#F6C277',
    '#FDEC61',
    '#8BCE55',
    '#68CCC8',
    '#5497F7',
    '#885CD7',
    '#E666A8',
    '#997A6D',
    '#646566',

    '#BF2E2C',
    '#C7702B',
    '#CFB13C',
    '#569B30',
    '#43959A',
    '#215CD1',
    '#4C28A4',
    '#B5347D',
    '#573D33',
  ]
  const colorGroup2 = [
    '#323233',
    '#E23C39',
    '#EC903A',
    '#F6DB4D',
    '#73C140',
    '#59BFC1',
    '#3379F6',
    '#693AC9',
    '#D94593',
    '#6B5045',
  ]

  const onChooseColor = (color: string) => {
    setBrightColor(color)
    props.getColor(color)
  }
  const onChooseColorByInput = (event: any) => {
    setBrightColor(event.target.value)
    props.getColor(event.target.value)
  }
  return (
    <div style={{ position: 'relative' }}>
      <div
        // eslint-disable-next-line react/jsx-handler-names

        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {props.defaultColor !== 'transparent' && (
          <HightLightSpan bright={props.defaultColor} />
        )}
      </div>
      <div
        style={{
          visibility: 'hidden',
          height: '12px',
        }}
      />
      <ToolTable id="table">
        {colorGroup2.map(item => (
          <HightLightTd
            key={item}
            onClick={() => onChooseColor(item)}
            bright={item}
          >
            {brightColor === item && <BrightIcon size={12} type="namecheck" />}
          </HightLightTd>
        ))}
      </ToolTable>
      <div
        style={{
          height: '16px',
        }}
      />
      <ToolTable id="table">
        {colorGroup.map(item => (
          <HightLightTd
            key={item}
            onClick={() => onChooseColor(item)}
            bright={item}
          >
            {brightColor === item && <BrightIcon size={12} type="namecheck" />}
          </HightLightTd>
        ))}
      </ToolTable>
    </div>
  )
}

export default SelectColorTool
