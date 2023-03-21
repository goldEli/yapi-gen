// 项目设置

import { Select } from 'antd'
import { css } from '@emotion/css'
import styled from '@emotion/styled'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import CommonModal from '@/components/CommonModal'
import CustomSelect from '@/components/CustomSelect'

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
const RightLine = styled(Line)`
  margin-top: 24px;
  color: rgba(50, 50, 51, 1);
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
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  border-radius: 50%;
  font-size: 32px;
  background: #a4acf5;
  background-blend-mode: normal;
  border: 2px solid rgba(40, 119, 255, 0.16);
  border: 1px solid white;
  color: var(--neutral-white-d2);
`
const SetPermissionWrap = (props: {
  data: any
  isVisible: boolean
  onClose(): void
  onConfirm(roleId: string): void
  projectPermission?: any
}) => {
  const [t] = useTranslation()
  const { data } = props
  const [infoId, setInfoId] = useState<any>(0)

  useEffect(() => {
    if (props.isVisible) {
      setInfoId(
        props?.projectPermission.filter((item: any) => {
          return item.value === data.userGroupId
        }).length
          ? data.userGroupId
          : '',
      )
    }
  }, [props.isVisible])

  const handleChange = (value: any) => {
    setInfoId(value)
  }

  const onConfirm = async () => {
    await props.onConfirm(infoId)
  }

  return (
    <CommonModal
      width={420}
      onClose={() => props.onClose()}
      title={t('setting.editPermission1')}
      isVisible={props.isVisible}
      onConfirm={onConfirm}
    >
      <PersonalHead>
        {data?.avatar ? (
          <img className={imgCss} src={data?.avatar} alt="" />
        ) : (
          <SetHead>
            {String(
              data?.name?.substring(0, 1)?.trim().slice(0, 1),
            ).toLocaleUpperCase()}
          </SetHead>
        )}
      </PersonalHead>
      <PersonalFooter>
        <Left>
          <Line>{t('common.phone')}</Line>
          <Line>{t('common.email')}</Line>
          <Line>{t('common.name')}</Line>
          <Line>{t('common.nickname')}</Line>
          <Line>{t('common.permissionGroup')}</Line>
        </Left>
        <Right>
          <RightLine>{data.phone ? data.phone : '--'}</RightLine>
          <RightLine>{data.email ? data.email : '--'}</RightLine>
          <RightLine>{data.name ? data.name : '--'}</RightLine>
          <RightLine>{data.nickname ? data.nickname : '--'}</RightLine>
          <RightLine>
            <CustomSelect
              value={infoId}
              style={{ width: 120 }}
              onChange={handleChange}
              getPopupContainer={(node: any) => node}
              showSearch
              optionFilterProp="label"
              options={props?.projectPermission}
            />
          </RightLine>
        </Right>
      </PersonalFooter>
    </CommonModal>
  )
}

export default SetPermissionWrap
