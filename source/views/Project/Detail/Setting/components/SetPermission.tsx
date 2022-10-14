import { Button, Modal, Select } from 'antd'
import { css } from '@emotion/css'
import styled from '@emotion/styled'
import { useModel } from '@/models'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { getParamsData } from '@/tools'

const PersonalHead = styled.div`
  display: flex;
  justify-content: center;
`
const PersonalFooter = styled.div`
  display: flex;
  justify-content: space-around;
`
const Footer = styled.footer`
  align-items: center;
  margin-top: 36px;
  display: flex;
  flex-direction: row-reverse;
  height: 56px;
  gap: 16px;
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
  line-height: 104px;
  text-align: center;
  border-radius: 50%;
  font-size: 32px;
  background: #a4acf5;
  background-blend-mode: normal;
  border: 2px solid rgba(40, 119, 255, 0.16);
  border: 1px solid white;
  color: white;
`

// eslint-disable-next-line complexity
const SetPermissionWrap = (props: {
  data: any
  isVisible: boolean
  onClose(): void
  onConfirm(roleId: string): void
}) => {
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData.id
  const [t] = useTranslation()
  const { data } = props
  const [roleOptions, setRoleOptions] = useState([])
  const [infoId, setInfoId] = useState<any>(0)
  const { getProjectPermission } = useModel('project')

  const init = async () => {
    const result = await getProjectPermission({ projectId })
    setRoleOptions(result.list)
    setInfoId(
      result.list.filter((item: any) => {
        return item.id === data.userGroupId
      }).length
        ? data.userGroupId
        : '',
    )
  }

  useEffect(() => {
    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleChange = (value: any) => {
    setInfoId(value)
  }

  const onConfirm = () => {
    props.onConfirm(infoId)
  }

  return (
    <Modal
      width={420}
      footer={null}
      onCancel={() => props.onClose()}
      title={t('setting.editPermission1')}
      visible={props.isVisible}
      maskClosable={false}
      destroyOnClose
      keyboard={false}
      wrapClassName="vertical-center-modal"
    >
      <PersonalHead>
        {data?.avatar
          ? <img className={imgCss} src={data?.avatar} alt="" />
          : (
              <SetHead>
                {String(
                  data?.name?.substring(0, 1).trim()
                    .slice(0, 1),
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
            <Select
              value={infoId}
              style={{ width: 120 }}
              onChange={handleChange}
              getPopupContainer={node => node}
              showSearch
              optionFilterProp="label"
              options={roleOptions.map((item: any) => ({
                label: item.name,
                value: item.id,
              }))}
            />
          </RightLine>
        </Right>
      </PersonalFooter>
      <Footer>
        <Button type="primary" onClick={onConfirm}>
          {t('common.confirm')}
        </Button>
        <Button onClick={() => props.onClose()}>{t('common.cancel')}</Button>
      </Footer>
    </Modal>
  )
}

export default SetPermissionWrap
