// 需求筛选处-设置的下拉菜单

import { updateCompanyUserPreferenceConfig } from '@/services/user'
import styled from '@emotion/styled'
import { useDispatch, useSelector } from '@store/index'
import { setUserPreferenceConfig } from '@store/user'
import { Menu, message } from 'antd'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import CommonIconFont from '../CommonIconFont'
const ChangeItem = styled.div<{ isActive?: boolean; height?: number }>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: SiYuanRegular;
  height: ${props => props.height || 32}px;
  cursor: pointer;
  color: ${props =>
    props.isActive ? 'var(--primary-d2)' : 'var(--neutral-n2)'};
  &:hover {
    color: var(--primary-d2);
    svg {
      color: var(--primary-d2);
    }
  }
`
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
  const [active, setActive] = useState()
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
      key: '1-1',
      label: '需求打开方式',
      children: [
        {
          key: '1',
          label: (
            <ChangeItem
              onClick={() => onChangeViewMode(1)}
              isActive={
                active === '1' || userPreferenceConfig.previewModel === 1
              }
            >
              <span style={{ paddingRight: 10 }}>弹窗预览</span>
              {(active === '1' || userPreferenceConfig.previewModel === 1) && (
                <CommonIconFont type="check" color={'var(--primary-d2)'} />
              )}
            </ChangeItem>
          ),
        },
        {
          key: '2',
          label: (
            <ChangeItem
              onClick={() => onChangeViewMode(2)}
              isActive={
                active === '2' || userPreferenceConfig.previewModel === 2
              }
            >
              <span style={{ paddingRight: 10 }}>详情预览</span>
              {(active === '2' || userPreferenceConfig.previewModel === 2) && (
                <CommonIconFont type="check" color={'var(--primary-d2)'} />
              )}
            </ChangeItem>
          ),
        },
      ],
    },
  ]

  if (props.notView) {
    menuItems = menuItems.filter((i: any) => i.key === '0')
  }

  if (props.isGrid === 1) {
    menuItems = menuItems.filter((i: any) => i.key !== '0')
  }
  const onClick = (e: any) => {
    setActive(e.key)
  }
  return (
    <Menu
      getPopupContainer={node => node}
      selectedKeys={[String(userPreferenceConfig?.previewModel)]}
      onClick={(e: any) => onClick(e)}
      items={menuItems}
    />
  )
}

export default SetShowField
