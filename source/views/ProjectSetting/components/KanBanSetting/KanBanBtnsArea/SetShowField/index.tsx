// 需求筛选处-设置的下拉菜单

import { updateCompanyUserPreferenceConfig } from '@/services/user'
import styled from '@emotion/styled'
import { useDispatch, useSelector } from '@store/index'
import { setUserPreferenceConfig } from '@store/user'
import { Menu, message } from 'antd'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getMessage } from '@/components/Message'
import IconFont from '@/components/IconFont'
import CommonIconFont from '@/components/CommonIconFont'
import { useNavigate } from 'react-router-dom'

const ChangeItem = styled.div<{ isActive?: boolean; height?: number }>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: SiYuanRegular;
  /* height: ${props => props.height || 32}px; */
  cursor: pointer;
  color: ${props =>
    props.isActive ? 'var(--primary-d2)' : 'var(--neutral-n2)'};
  &:hover {
    /* color: var(--primary-d2); */
    svg {
      /* color: var(--primary-d2); */
    }
  }
`
interface Props {
  // 是否有预览模式
  notView?: boolean
}

const SetShowField = (props: Props) => {
  const [t] = useTranslation()
  const { userPreferenceConfig } = useSelector(store => store.user)
  const dispatch = useDispatch()
  const [active, setActive] = useState()
  const navigate = useNavigate()
  const onChangeViewMode = async (type: number) => {
    await updateCompanyUserPreferenceConfig({
      previewModel: type,
      id: userPreferenceConfig?.id,
    })
    getMessage({
      msg: t('switch_preview_mode_successfully') as string,
      type: 'success',
    })
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
        <div
          onClick={() => {
            navigate('/SprintProjectManagement/Setting')
          }}
        >
          {t('configuration_panel')}
        </div>
      ),
    },
    {
      key: '1-1',
      label: t('requirement_opening_mode'),
      children: [
        {
          key: '1',
          label: (
            <ChangeItem
              height={22}
              onClick={() => onChangeViewMode(1)}
              isActive={
                active === '1' || userPreferenceConfig.previewModel === 1
              }
            >
              <span style={{ paddingRight: 10 }}>{t('popup_preview')}</span>
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
              height={22}
              onClick={() => onChangeViewMode(2)}
              isActive={
                active === '2' || userPreferenceConfig.previewModel === 2
              }
            >
              <span style={{ paddingRight: 10 }}>{t('details_preview')}</span>
              {(active === '2' || userPreferenceConfig.previewModel === 2) && (
                <CommonIconFont type="check" color={'var(--primary-d2)'} />
              )}
            </ChangeItem>
          ),
        },
      ],
    },
  ]

  const onClick = (e: any) => {
    setActive(e.key)
  }
  return (
    <Menu
      getPopupContainer={node => node}
      selectedKeys={[String(userPreferenceConfig?.previewModel)]}
      onClick={(e: any) => onClick(e)}
      items={menuItems}
      expandIcon={
        <IconFont
          style={{
            marginTop: '5px',
            fontSize: '16px!important',
            color: 'var(--neutral-n3)',
          }}
          type="right"
        />
      }
    />
  )
}

export default SetShowField
