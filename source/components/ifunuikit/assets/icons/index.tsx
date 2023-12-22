import React from 'react'
import { createFromIconfontCN } from '@ant-design/icons'

const IconFont = createFromIconfontCN({
  scriptUrl:
    'https://lf1-cdn-tos.bytegoofy.com/obj/iconpark/svg_20673_58.88e5cdffbe2a095b786a952dbf025949.js',
})

const Icon = (props: Parameters<typeof IconFont>[0]) => (
  <IconFont {...props} type={`i-${props.type}`} />
)

export default Icon
