// 公司成员详情编辑弹窗

import { Select } from 'antd'
import { css } from '@emotion/css'
import styled from '@emotion/styled'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import CommonModal from '@/components/CommonModal'
import { getRoleList } from '@/services/staff'
import CustomSelect from '@/components/CustomSelect'
import CommonUserAvatar from '@/components/CommonUserAvatar'

const PersonalHead = styled.div`
  margin-top: 13px;
  display: flex;
  /* justify-content: center; */
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
  color: var(--neutral-n2);
  margin-top: 24px;
  line-height: 32px;
`
const RightLine = styled(Line)`
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
  color: var(--neutral-n1-d1);
  display: flex;
  justify-content: flex-end;
`

const Right = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const imgCss = css`
  width: 32px;
  height: 32px;
  border-radius: 50%;
`

export const StaffPersonal = (props: {
  data: any
  isVisible: boolean
  onClose(): void
  onConfirm(info: { userId: string; roleId: string }): void
}) => {
  const [t] = useTranslation()
  const { data } = props
  const [roleOptions, setRoleOptions] = useState([])
  const [infoId, setInfoId] = useState<any>(0)

  const init = async () => {
    const res3 = await getRoleList()

    setRoleOptions(res3.data)
    setInfoId(
      res3.data.filter((item: any) => {
        return item.id === data.user_group_id
      }).length
        ? data.user_group_id
        : '',
    )
  }

  useEffect(() => {
    if (props.isVisible) {
      init()
    }
  }, [props.isVisible])

  const handleChange = (value: any) => {
    setInfoId(value)
  }
  const onConfirm = async () => {
    await props.onConfirm({
      userId: data.id,
      roleId: infoId,
    })
  }

  return (
    <CommonModal
      width={528}
      onClose={() => props.onClose()}
      title={t('staff.setPermission')}
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
              options={roleOptions.map((item: any) => ({
                label: item.content_txt,
                value: item.id,
              }))}
            />
          </RightLine>
        </Right>
      </PersonalFooter>
    </CommonModal>
  )
}
