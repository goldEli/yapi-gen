// 公司成员详情编辑弹窗

import { Select } from 'antd'
import { css } from '@emotion/css'
import styled from '@emotion/styled'
import { useModel } from '@/models'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import CommonModal from '@/components/CommonModal'

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
  color: white;
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
  const [info, setInfo] = useState({
    roleId: data.user_group_id,
    userId: data.id,
  })
  const [infoId, setInfoId] = useState<any>(0)
  const { getRoleList } = useModel('staff')

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
    init()
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
      width={420}
      onClose={() => props.onClose()}
      title={t('staff.setPermission')}
      isVisible={props.isVisible}
      onConfirm={onConfirm}
    >
      <PersonalHead>
        {data?.avatar ? (
          <img className={imgCss} src={data?.avatar} alt="" />
        ) : (
          <SetHead>
            {String(data?.name?.trim().slice(0, 1)).toLocaleUpperCase()}
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
          <RightLine>{data.phone ? data.phone : '-'}</RightLine>
          <RightLine>{data.email ? data.email : '-'}</RightLine>
          <RightLine>{data.name ? data.name : '-'}</RightLine>
          <RightLine>{data.nickname ? data.nickname : '-'}</RightLine>
          <RightLine>
            <Select
              value={infoId}
              style={{ width: 120 }}
              onChange={handleChange}
              getPopupContainer={node => node}
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
