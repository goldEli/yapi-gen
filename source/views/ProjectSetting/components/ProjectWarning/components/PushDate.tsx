import React from 'react'
import SubTitle from './SubTitle'
import { PushDateBox, PushDateContent } from '../style'
const PushDate = () => {
  return (
    <PushDateBox>
      <SubTitle title="推送通知"></SubTitle>
      <PushDateContent></PushDateContent>
    </PushDateBox>
  )
}
export default PushDate
