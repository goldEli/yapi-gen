// 暂无权限页面

import styled from '@emotion/styled'
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
    color: 'var(--neutral-n3)',
    fontSize: 14,
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
    permission?.filter((i: any) => i?.includes(auth))?.length > 0
  ) {
    return children
  }

  return (
    <Wrap style={{ height: '100%' }}>
      <img
        src="https://mj-system-1308485183.cos.accelerate.myqcloud.com/public/privatePermission.png"
        style={{ width: 240, marginBottom: 24 }}
        alt=""
      />
      <div>{t('components.noPermission')}</div>
    </Wrap>
  )
}

export default PermissionWrap
