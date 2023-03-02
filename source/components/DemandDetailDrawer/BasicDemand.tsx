/* eslint-disable complexity */
/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
import { useGetloginInfo } from '@/hooks/useGetloginInfo'
import { getCategoryConfigList, getDemandList } from '@/services/demand'
import { getCustomNormalValue, removeNull } from '@/tools'
import { useSelector } from '@store/index'
import { DatePicker, Select, Tooltip, TreeSelect } from 'antd'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ChangePriorityPopover from '../ChangePriorityPopover'
import IconFont from '../IconFont'
import { PriorityWrap } from '../StyleCommon'
import TableQuickEdit from '../TableQuickEdit'
import { ContentWrap, InfoItem, Label, MaxLabel, ShowLabel } from './style'

interface Props {
  detail?: any
  isOpen?: boolean
  onUpdate(): void
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
  const { basicFieldList } = useSelector(store => store.global)

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

  // 获取基本字段的默认值
  const getDefaultValue = (content: any) => {
    let value: any
    // 处理人取值
    if (content === 'users_name') {
      value = {
        defaultText: props.detail?.user?.length
          ? props.detail?.user?.map((i: any) => i.user.id)
          : [],
        defaultHtml: props.detail?.user?.length
          ? props.detail?.user?.map((i: any) => i.user.name).join(';')
          : '--',
      }
    } else if (content === 'users_copysend_name') {
      // 抄送人取值
      value = {
        defaultText: props.detail?.copySend?.length
          ? props.detail?.copySend?.map((i: any) => i.copysend.id)
          : [],
        defaultHtml: props.detail?.copySend?.length
          ? props.detail?.copySend?.map((i: any) => i.copysend.name).join(';')
          : '--',
      }
    } else if (content === 'iterate_name') {
      // 迭代取值
      value = {
        defaultText:
          props.detail?.iterateName === '--' ? '' : props.detail?.iterateName,
        defaultHtml:
          props.detail?.iterateName === '--' ? '--' : props.detail?.iterateName,
      }
    } else if (content === 'class') {
      // 需求分类取值
      value = {
        defaultText: props.detail?.class,
        defaultHtml: props.detail?.className
          ? props.detail?.className
          : t('newlyAdd.unclassified'),
      }
    } else if (content === 'expected_start_at') {
      // 开始时间取值
      value = {
        defaultText: props.detail?.expectedStart || '',
        defaultHtml: props.detail?.expectedStart || '--',
        valueType: ['date'],
      }
    } else if (content === 'expected_end_at') {
      // 结束时间取值
      value = {
        defaultText: props.detail?.expectedEnd || '',
        defaultHtml: props.detail?.expectedEnd || '--',
        valueType: ['date'],
      }
    }
    return value
  }

  // 返回基本字段
  const getBasicTypeComponent = (item: any) => {
    let nodeComponent

    // 如果不属于下列字段的则渲染
    if (!['schedule', 'parent_id', 'priority'].includes(item.content)) {
      const filterContent = basicFieldList?.filter(
        (i: any) => i.content === item.content,
      )[0]
      const defaultValues = getDefaultValue(item.content)
      nodeComponent = (
        <TableQuickEdit
          item={props.detail}
          isInfo
          keyText={filterContent?.keyText}
          type={filterContent?.attr}
          defaultText={defaultValues.defaultText}
          value={defaultValues.valueType || null}
          onUpdate={props.onUpdate}
        >
          {defaultValues.defaultHtml}
        </TableQuickEdit>
      )
    }

    return nodeComponent
  }

  // 返回自定义字段
  const getCustomComponent = (item: any) => {
    return (
      <TableQuickEdit
        item={props.detail}
        isInfo
        keyText={item.content}
        type={item.fieldContent?.attr}
        defaultText={props.detail?.customField?.[item.content]?.value}
        isCustom
        remarks={item?.remarks}
        onUpdate={props.onUpdate}
      >
        <span>
          {getCustomNormalValue(
            item.fieldContent?.attr,
            props.detail?.customField[item.content],
          )}
        </span>
      </TableQuickEdit>
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
            <ContentWrap>
              {i.isCustomize === 1
                ? getCustomComponent(i)
                : getBasicTypeComponent(i)}
            </ContentWrap>
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
