// 暂无权限页面

/* eslint-disable complexity */
import styled from '@emotion/styled'
import { getIsPermission } from '@/tools/index'
import { useTranslation } from 'react-i18next'
import IconFont from './IconFont'

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
    color: 'var(--neutral-n1-d1)',
    fontSize: 18,
  },
})

const PermissionWrap = ({
  auth,
  permission,
  children,
}: {
  auth: string
  permission: any[]
  children: any
}) => {
  const [t] = useTranslation()

  if (!permission || permission?.length <= 0) {
    return ''
  }

  if (
    permission?.includes(auth) ||
    permission?.filter((i: any) => i.includes(auth))?.length > 0
  ) {
    return children
  }

  return (
    <Wrap style={{ height: '100%' }}>
      <IconFont type="noData" style={{ fontSize: 200 }} />
      <div>{t('components.noPermission')}</div>
    </Wrap>
  )
}

export default PermissionWrap
