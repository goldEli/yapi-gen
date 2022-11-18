// 暂无权限页面

/* eslint-disable complexity */
import styled from '@emotion/styled'
import empty from '/empty.svg'
import { getIsPermission } from '@/tools/index'
import { useTranslation } from 'react-i18next'

const Wrap = styled.div({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'white',
  height: '100%',
  width: '100%',
  borderRadius: 4,
  img: {
    width: 240,
    marginBottom: 35,
  },
  div: {
    color: '#323233',
    fontSize: 18,
  },
})

const PermissionWrap = ({
  auth,
  hasWidth,
  permission,
  isType,
  children,
  isPadding,
}: {
  auth: any
  hasWidth?: boolean
  permission?: any
  isType?: number
  children?: any
  isPadding?: boolean
}) => {
  const [t] = useTranslation()
  if (!permission?.length) {
    return ''
  }
  if (permission?.length && !isType) {
    if (!getIsPermission(permission, auth)) {
      return permission ? children : ''
    }
  } else if (permission?.length && isType === 1) {
    return permission?.filter((i: any) => i.group_name === auth).length
      ? children
      : ''
  } else if (permission?.length && isType === 2) {
    return permission?.filter((i: any) => String(i.identity).includes(auth))
      .length
      ? children
      : ''
  }

  return (
    <Wrap style={{ height: hasWidth ? 'calc(100vh - 64px)' : '100%' }}>
      <img src={empty} alt="" />
      <div>{t('components.noPermission')}</div>
    </Wrap>
  )
}

export default PermissionWrap
