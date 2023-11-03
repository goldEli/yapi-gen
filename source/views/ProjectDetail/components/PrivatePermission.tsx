// 私有项目无权限页面

import { useTranslation } from 'react-i18next'
import styled from '@emotion/styled'
import { useNavigate } from 'react-router-dom'
import CommonButton from '@/components/CommonButton'
import { setProjectInfo } from '@store/project'
import { useDispatch } from '@store/index'

const Wrap = styled.div({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'white',
  height: '100%',
  width: '100%',
  borderRadius: 6,
  padding: 16,
  div: {
    color: 'var(--neutral-n3)',
    fontSize: 14,
    marginTop: 24,
  },
})

const PrivatePermission = () => {
  const [t] = useTranslation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // 点击跳转到项目页面
  const onToProject = () => {
    navigate('/Profile')
    dispatch(setProjectInfo({}))
  }

  return (
    <Wrap>
      <img
        src="https://mj-system-1308485183.cos.accelerate.myqcloud.com/public/privatePermission.png"
        style={{ width: 240 }}
        alt=""
      />
      <div>{t('new_p1.kongT')}</div>
      <CommonButton
        style={{ marginTop: 24 }}
        onClick={onToProject}
        type="secondary"
      >
        {t('new_p1.kongP')}
      </CommonButton>
    </Wrap>
  )
}

export default PrivatePermission
