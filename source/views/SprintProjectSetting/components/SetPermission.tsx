// 项目设置

import { Select } from 'antd'
import { css } from '@emotion/css'
import styled from '@emotion/styled'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import CommonModal from '@/components/CommonModal'
import CustomSelect from '@/components/CustomSelect'
import CommonUserAvatar from '@/components/CommonUserAvatar'

const PersonalHead = styled.span`
  display: flex;
  justify-content: end;
  margin-top: 20px;
`
const PersonalFooter = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0px 24px;
`
const Left = styled.div``
const Line = styled.div`
  color: rgba(100, 101, 102, 1);
  margin-top: 24px;
  line-height: 32px;
`
const RightLine = styled(Line)`
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
  color: rgba(50, 50, 51, 1);
  display: flex;
  justify-content: flex-end;
`

const Right = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const imgCss = css`
  width: 104px;
  height: 104px;
  border-radius: 50%;
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
      width={528}
      onClose={() => props.onClose()}
      title={t('setting.editPermission1')}
      isVisible={props.isVisible}
      onConfirm={onConfirm}
    >
      <PersonalFooter>
        <Right>
          <Line>{t('head_portrait')}</Line>
          <PersonalHead>
            <CommonUserAvatar avatar={data?.avatar} size="large" />
          </PersonalHead>
        </Right>
        <Right>
          <Line>{t('common.phone')}</Line>
          <RightLine>{data.phone ? data.phone : '--'}</RightLine>
        </Right>
        <Right>
          <Line>{t('common.email')}</Line>
          <RightLine>{data.email ? data.email : '--'}</RightLine>
        </Right>

        <Right>
          <Line>{t('common.name')}</Line>
          <RightLine>{data.name ? data.name : '--'}</RightLine>
        </Right>

        <Right>
          <Line>{t('common.nickname')}</Line>
          <RightLine>{data.nickname ? data.nickname : '--'}</RightLine>
        </Right>
        <Right>
          <Line>{t('common.permissionGroup')}</Line>

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
