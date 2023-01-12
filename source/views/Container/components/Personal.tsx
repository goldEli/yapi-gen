// 个人信息面板

/* eslint-disable react/jsx-handler-names */
import { useState } from 'react'
import { Spin } from 'antd'
import { css } from '@emotion/css'
import styled from '@emotion/styled'
import { useModel } from '@/models'
import { useTranslation } from 'react-i18next'
import CommonModal from '@/components/CommonModal'
import { useSelector } from '@store/index'

const PersonalHead = styled.div`
  display: flex;
  justify-content: center;
`
const PersonalFooter = styled.div`
  display: flex;
  justify-content: space-around;
  padding-right: 20px;
`

const Left = styled.div``
const Line = styled.div`
  color: rgba(100, 101, 102, 1);
  margin-top: 24px;
`

const Right = styled.div``
const imgCss = css`
  width: 104px;
  height: 104px;
  border-radius: 50%;
`

const SetHead = styled.div`
  width: 104px;
  height: 104px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  font-size: 32px;
  background: #a4acf5;
  background-blend-mode: normal;
  border: 1px solid #f0f2fd;
  color: white;
  margin-right: 8px;
`

export const Personal = (props: { visible: boolean; close(): void }) => {
  const [t] = useTranslation()
  const { userInfo, loginInfo } = useSelector(
    (store: { user: any }) => store.user,
  )
  // eslint-disable-next-line react/hook-use-state
  const [isShow] = useState<any>(false)

  const labelList = [
    {
      label: t('common.phone'),
      value: userInfo.account,
    },
    {
      label: t('common.email'),
      value: userInfo.email,
    },
    {
      label: t('common.nickname'),
      value: userInfo.nickname,
    },
    {
      label: t('common.name'),
      value: userInfo.name,
    },
    {
      label: t('common.sex'),
      value: userInfo.gender === 1 ? t('common.male') : t('common.female'),
    },
    {
      label: t('container.department'),
      value: userInfo.department_name,
    },
    {
      label: t('common.job'),
      value: userInfo.position_name,
    },
    {
      label: t('common.permissionGroup'),
      value: userInfo.group_name,
    },
  ]
  return (
    <CommonModal
      onClose={() => props.close()}
      isVisible={props.visible}
      title={t('container.personInfo')}
      isShowFooter
    >
      {isShow ? <Spin /> : null}
      {!isShow && (
        <div style={{ paddingBottom: 16 }}>
          <PersonalHead>
            {userInfo.avatar ? (
              <img className={imgCss} src={userInfo.avatar} />
            ) : (
              <SetHead>
                {String(userInfo?.name?.trim().slice(0, 1)).toLocaleUpperCase()}
              </SetHead>
            )}
          </PersonalHead>
          <PersonalFooter>
            <Left>
              {labelList.map(item => (
                <Line key={item.label}>{item.label ? item.label : '-'}</Line>
              ))}
            </Left>
            <Right>
              {labelList.map(item => (
                <Line key={item.label}>{item.value ? item.value : '-'}</Line>
              ))}
            </Right>
          </PersonalFooter>
        </div>
      )}
    </CommonModal>
  )
}
