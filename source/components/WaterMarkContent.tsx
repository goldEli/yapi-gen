/* eslint-disable @typescript-eslint/no-loss-of-precision */
// 水印

import { useMemo } from 'react'
import { useModel } from '@/models'
import { useSelector } from '../../store'

const SvgTextBg = (props: any) => {
  const { userInfo, loginInfo } = useSelector(
    (store: { user: any }) => store.user,
  )
  const {
    text = ` ${userInfo?.company_name}  
    `,
    text2 = ` ${userInfo.name}  ${userInfo.phone} `,
    fontSize = 12,
    fillOpacity = '0.5',
    fillColor = '#D5D6D9',
  } = props
  const res = `
      <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="400px" height="180px" viewBox="0 0 180 180">
        <text x="-150" y="-30" fill='${fillColor}'  transform = "rotate(-35 220 -220)" fill-opacity='${fillOpacity}' font-size='${fontSize}'> ${text} 
        

        <tspan x="-150" y="1">${text2}</tspan> </text>
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
      {valueId === 1 && <SvgTextBg {...memoInfo} />}
    </div>
  )
}

export default WaterMarkContent
