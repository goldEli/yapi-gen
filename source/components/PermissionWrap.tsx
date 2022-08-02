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
  hasWidth,
  children,
}: {
  auth: boolean
  hasWidth?: boolean
  children?: any
}) => {
  if (!auth) {
    return children
  }
  return (
    <Wrap style={{ height: hasWidth ? 'calc(100% - 64px)' : '100%' }}>
      暂无权限查看，请联系管理员
    </Wrap>
  )
}

export default PermissionWrap
