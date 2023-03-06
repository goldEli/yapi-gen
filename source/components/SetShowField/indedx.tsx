// 需求筛选处-设置的下拉菜单

import { updateCompanyUserPreferenceConfig } from '@/services/user'
import { useDispatch, useSelector } from '@store/index'
import { setUserPreferenceConfig } from '@store/user'
import { Menu, message } from 'antd'
import { useTranslation } from 'react-i18next'

interface Props {
  // 是否有预览模式
  notView?: boolean
  onChangeFieldVisible(): void
  isGrid?: number
}

const SetShowField = (props: Props) => {
  const [t] = useTranslation()
  const { userPreferenceConfig } = useSelector(store => store.user)
  const dispatch = useDispatch()

  const onChangeViewMode = async (type: number) => {
    await updateCompanyUserPreferenceConfig({
      previewModel: type,
      id: userPreferenceConfig?.id,
    })
    message.success('切换预览模式成功！')
    dispatch(
      setUserPreferenceConfig({
        ...userPreferenceConfig,
        ...{ previewModel: type },
      }),
    )
  }

  let menuItems = [
    {
      key: '0',
      label: (
        <div onClick={props.onChangeFieldVisible}>{t('common.setField')}</div>
      ),
    },
    {
      key: '1',
      label: <div onClick={() => onChangeViewMode(1)}>弹窗预览</div>,
    },
    {
      key: '2',
      label: <div onClick={() => onChangeViewMode(2)}>详情预览</div>,
    },
  ]

  if (props.notView) {
    menuItems = menuItems.filter((i: any) => i.key === '0')
  }

  if (props.isGrid === 1) {
    menuItems = menuItems.filter((i: any) => i.key !== '0')
  }

  return (
    <Menu
      selectedKeys={[String(userPreferenceConfig?.previewModel)]}
      items={menuItems}
    />
  )
}

export default SetShowField
