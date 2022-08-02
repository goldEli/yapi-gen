import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from '@emotion/styled'

const Wrap = styled.div({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'white',
  height: '100%',
  width: '100%',
  borderRadius: 4,

  // height: '100%',
})

const PermissionWrap = ({
  auth,
  children,
}: {
  auth: boolean
  children?: any
}) => {
  if (!auth) {
    return children
  }
  return <Wrap>暂无权限查看，请联系管理员</Wrap>
}

export default PermissionWrap
