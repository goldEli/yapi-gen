import { ReactNode, useMemo } from 'react'

const SvgTextBg = (props: any) => {
  const {
    text = '定星科技',
    fontSize = 32,
    fillOpacity = '0.1',
    fillColor = '#083a7b',
  } = props
  const res = `
      <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="300px" height="180px" viewBox="0 0 180 180">
        <text x="-100" y="-30" fill='${fillColor}'  transform = "rotate(-35 220 -220)" fill-opacity='${fillOpacity}' font-size='${fontSize}'> ${text}</text>
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
        zIndex: 999,
        pointerEvents: 'none',
      }}
    />
  )
}

const WaterMarkContent = (props: any) => {
  const { text, fontSize, fillOpacity, fillColor } = props

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
      <SvgTextBg {...memoInfo} />
    </div>
  )
}

export default WaterMarkContent
