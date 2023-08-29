/* eslint-disable @typescript-eslint/no-loss-of-precision */
// 水印

import { useMemo } from 'react'
import { useSelector } from '../../store'

const SvgTextBg = (props: any) => {
  const { userInfo } = useSelector(store => store.user)
  const { theme } = useSelector(store => store.global)
  const {
    text = ` ${userInfo?.company_name}  
    `,
    text2 = ` ${userInfo.name} `,
    text3 = ` ${userInfo.phone} `,
    fontSize = 12,
    fillOpacity = '0.5',
    fillColor = theme ? '#3d4251' : '#d5d6d9',
  } = props
  const res = `
      <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="400px" height="180px" viewBox="0 0 180 180">
        <text x="-150" y="-30" fill='${fillColor}'  transform = "rotate(-35 220 -220)" fill-opacity='${fillOpacity}' font-size='${fontSize}'> ${text} 
        

        <tspan x="-150" y="-15">${text2}</tspan> 
        
        <tspan x="-150" y="0">${text3}</tspan> 
        </text>

      
      </svg>`

  const blob = new Blob([res], {
    type: 'image/svg+xml',
  })

  const url = URL.createObjectURL(blob)

  return (
    <div
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundImage: `url(${url})`,
        top: 0,
        left: 0,
        zIndex: 999999,
        pointerEvents: 'none',
      }}
    />
  )
}

const WaterMarkContent = (props: any) => {
  const { text, fontSize, fillOpacity, fillColor } = props
  const { value: valueId } = useSelector(store => store.water)

  const memoInfo = useMemo(
    () => ({
      text,
      fontSize,
      fillOpacity,
      fillColor,
    }),
    [text, fontSize, fillOpacity, fillColor],
  )
  return (
    <div style={{ position: 'relative', width: '100%', height: ' 100%' }}>
      {props.children}
      {valueId ? <SvgTextBg {...memoInfo} /> : null}
    </div>
  )
}

export default WaterMarkContent
