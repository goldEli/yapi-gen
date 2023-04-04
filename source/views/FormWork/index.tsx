/* eslint-disable @typescript-eslint/naming-convention */
import styled from '@emotion/styled'
import { useState } from 'react'
import FormWorkSide from '@/components/AllSide/FormWorkSide'
import RightFormWork from './RightWrap'
const FormWorkWrap = styled.div`
  width: 100%;
  display: flex;
`
const FormWork = () => {
  return (
    <FormWorkWrap>
      <FormWorkSide />
      <RightFormWork />
    </FormWorkWrap>
  )
}
export default FormWork
