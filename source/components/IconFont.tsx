import { createFromIconfontCN } from '@ant-design/icons'
import { forwardRef, type CSSProperties } from 'react'

const IconFont = createFromIconfontCN({
  scriptUrl: [
    'https://lf1-cdn-tos.bytegoofy.com/obj/iconpark/svg_16144_102.8e724c9abb1af63b9510fd76b7d0a0d1.js',
  ],
})

const Icon = (
  props: {
    type: string
    className?: string
    style?: CSSProperties
    [key: string]: any
  },
  ref: any,
) => (
  <IconFont
    ref={ref}
    type={props.type}
    className={props.className}
    style={props.style}
  />
)

export default forwardRef(Icon)
