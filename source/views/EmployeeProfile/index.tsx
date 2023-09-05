import { useState } from 'react'
import EmployeeProfileHeader from './components/EmployeeProfileHeader'
import { ContentWrap, Wrap } from './style'

const EmployeeProfile = () => {
  return (
    <Wrap>
      <EmployeeProfileHeader />
      <ContentWrap></ContentWrap>
    </Wrap>
  )
}

export default EmployeeProfile
