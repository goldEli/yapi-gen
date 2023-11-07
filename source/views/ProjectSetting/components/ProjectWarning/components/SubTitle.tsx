import React from 'react'
import { SubTitleBox } from '../style'

const SubTitle = (props: any) => {
  const { title } = props
  return <SubTitleBox>{title}</SubTitleBox>
}
export default SubTitle
