/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
import { getCategoryConfigList } from '@/services/demand'
import { Tooltip } from 'antd'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ContentWrap, InfoItem, Label, MaxLabel, ShowLabel } from './style'

interface Props {
  detail?: any
  isOpen?: boolean
}

const LimitLabel = (props: { label: string; width: number }) => {
  return (
    <Label>
      <Tooltip
        title={props.label}
        getPopupContainer={node => node}
        placement="topLeft"
      >
        <MaxLabel width={props.width}>{props.label}</MaxLabel>
      </Tooltip>
    </Label>
  )
}

const BasicDemand = (props: Props) => {
  const [t] = useTranslation()
  // 折叠字段
  const [foldList, setFoldList] = useState<any>([])
  // 不折叠字段
  const [notFoldList, setNotFoldList] = useState<any>([])
  const [isShowFields, setIsShowFields] = useState(false)

  const getFieldData = async () => {
    const result = await getCategoryConfigList({
      projectId: props.detail.projectId,
      categoryId: props.detail.category,
    })
    setFoldList(
      result?.filter(
        (i: any) =>
          i.isFold === 2 &&
          i.status === 1 &&
          !['finish_at', 'created_at', 'user_name'].includes(i.content),
      ),
    )
    setNotFoldList(
      result?.filter(
        (i: any) =>
          i.isFold === 1 &&
          i.status === 1 &&
          !['finish_at', 'created_at', 'user_name'].includes(i.content),
      ),
    )
  }

  useEffect(() => {
    if (props.isOpen) {
      getFieldData()
    }
  }, [props.isOpen])

  return (
    <div>
      <Label>基本信息</Label>
      {notFoldList?.map((i: any) => {
        return (
          <InfoItem key={i.content}>
            <LimitLabel label={i.title} width={90} />
            <ContentWrap>22</ContentWrap>
          </InfoItem>
        )
      })}
      {!isShowFields && foldList?.length > 0 && (
        <ShowLabel onClick={() => setIsShowFields(true)}>
          {t('newlyAdd.open')}
        </ShowLabel>
      )}
      {isShowFields &&
        foldList?.map((i: any) => (
          <InfoItem key={i.content}>
            <LimitLabel label={i.title} width={90} />
            <ContentWrap>111</ContentWrap>
          </InfoItem>
        ))}
      {isShowFields && foldList?.length > 0 && (
        <ShowLabel onClick={() => setIsShowFields(false)}>
          {t('newlyAdd.close')}
        </ShowLabel>
      )}
    </div>
  )
}

export default BasicDemand
