/* eslint-disable complexity */
/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
import {
  getCategoryConfigList,
  updatePriority,
  updateTableParams,
} from '@/services/demand'
import { getCustomNormalValue } from '@/tools'
import { useDispatch, useSelector } from '@store/index'
import { Tooltip } from 'antd'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ChangePriorityPopover from '../ChangePriorityPopover'
import IconFont from '../IconFont'
import { getMessage } from '../Message'
import { CanOperation, IconFontWrapEdit, SliderWrap } from '../StyleCommon'
import TableQuickEdit from '../TableQuickEdit'
import {
  ContentWrap,
  InfoItem,
  Label,
  LabelItem,
  MaxLabel,
  ShowLabel,
  haveAuto,
} from './style'
import DetailParent from '../DetailParent'
import MultipleAvatar from '../MultipleAvatar'
import { setIsRefresh } from '@store/user'

interface Props {
  detail?: any
  isOpen?: boolean
  onUpdate(): void
  isInfoPage?: boolean
  isPreview?: boolean
}

const LimitLabel = (props: { label: string; width: number }) => {
  return (
    <LabelItem>
      <Tooltip
        title={props.label}
        getPopupContainer={node => node}
        placement="topLeft"
      >
        <MaxLabel width={props.width}>{props.label}</MaxLabel>
      </Tooltip>
    </LabelItem>
  )
}

const BasicDemand = (props: Props) => {
  const dispatch = useDispatch()
  const [t] = useTranslation()
  // 折叠字段
  const [foldList, setFoldList] = useState<any>([])
  // 不折叠字段
  const [notFoldList, setNotFoldList] = useState<any>([])
  const [isShowFields, setIsShowFields] = useState(false)
  const [schedule, setSchedule] = useState(props.detail?.schedule || 0)
  const { basicFieldList } = useSelector(store => store.global)
  const { isRefresh } = useSelector(store => store.user)
  const { projectInfo } = useSelector(store => store.project)
  const [canOperationKeys, setCanOperationKeys] = useState<any>({})
  const { demandDetailDrawerProps } = useSelector(store => store.demand)
  const { userId } = useSelector(store => store.employeeProfile)

  const isCanEdit =
    projectInfo.projectPermissions?.length > 0 &&
    projectInfo.projectPermissions?.filter(
      (i: any) => i.identity === 'b/story/update',
    )?.length > 0
  useEffect(() => {
    setSchedule(props.detail?.schedule)
  }, [props.detail?.schedule])

  const onChangeState = async (item: any) => {
    try {
      await updatePriority({
        demandId: props.detail.id,
        priorityId: item.priorityId,
        projectId: props.detail.projectId,
      })
      getMessage({ msg: t('common.prioritySuccess'), type: 'success' })
      props.onUpdate?.()
    } catch (error) {
      //
    }
  }

  const onChangeBasicKey = (key: any) => {
    const needChangeList: any = {
      class: 'class_id',
      iterate_name: 'iterate_id',
      users_name: 'users',
      users_copysend_name: 'copysend',
    }
    return Object.keys(needChangeList).includes(key) ? needChangeList[key] : key
  }

  const getFieldData = async () => {
    const result = await getCategoryConfigList({
      projectId: props.detail?.projectId,
      categoryId: props.detail?.category,
    })
    // 重组数据
    let keys: any = []
    result?.forEach((element: any) => {
      keys.push([onChangeBasicKey(element.content), element.isRequired])
    }),
      setCanOperationKeys(Object.fromEntries(keys))
    setFoldList(
      result?.filter(
        (i: any) =>
          i.isFold === 2 &&
          i.status === 1 &&
          !['finish_at', 'created_at', 'user_name'].includes(i.content),
      ),
    )
    const tempFoldList = result?.filter?.(
      (i: any) =>
        i.isFold === 1 &&
        i.status === 1 &&
        !['finish_at', 'created_at', 'user_name'].includes(i.content),
    )
    // 人员模块页面里面得处理人更名为参与人
    const resFoldList = tempFoldList.map?.((s: any) => {
      if (
        location.href.includes('/EmployeeProfile') &&
        s.content === 'users_name'
      ) {
        return {
          ...s,
          title: t('participants'),
        }
      }
      return s
    })
    setNotFoldList(resFoldList)
    dispatch(setIsRefresh(false))
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
    let tempUserList: any = props.detail?.user?.map((i: any) => ({
      id: i.user.id,
      name: i.user.name,
      avatar: i.user.avatar,
    }))

    // 参与人过滤下日报创建人
    if (
      item.content === 'users_name' &&
      location.href.includes('/EmployeeProfile') &&
      userId
    ) {
      tempUserList = tempUserList?.filter((l: any) => l.id !== userId)
    }

    // 如果不属于下列字段的则渲染
    if (!['parent_id', 'priority'].includes(item.content)) {
      const filterContent = basicFieldList?.filter(
        (i: any) => i.content === item.content,
      )[0]
      const defaultValues = getDefaultValue(item.content)
      nodeComponent = (
        <TableQuickEdit
          item={{
            ...props.detail,
            ...{ categoryConfigList: canOperationKeys },
          }}
          isInfo
          keyText={filterContent?.keyText}
          type={filterContent?.attr}
          defaultText={defaultValues?.defaultText}
          value={defaultValues?.valueType || null}
          onUpdate={props.onUpdate}
          isMineOrHis={demandDetailDrawerProps?.isMineOrHis}
          isInfoPage={props.isInfoPage}
          isPreview={props.isPreview}
        >
          {['users_copysend_name', 'users_name'].includes(item.content) && (
            <MultipleAvatar
              max={3}
              list={
                item.content === 'users_name'
                  ? tempUserList
                  : props.detail?.copySend?.map((i: any) => ({
                      id: i.copysend.id,
                      name: i.copysend.name,
                      avatar: i.copysend.avatar,
                    }))
              }
            />
          )}
          {!['users_copysend_name', 'users_name'].includes(item.content) && (
            <>{defaultValues?.defaultHtml}</>
          )}
        </TableQuickEdit>
      )
    } else if (item.content === 'parent_id') {
      nodeComponent = (
        <DetailParent
          hasEdit={!props.isPreview && isCanEdit}
          detail={props.detail}
          onUpdate={props.onUpdate}
          type={1}
          canOperationKeys={canOperationKeys}
        />
      )
    } else if (item.content === 'priority') {
      nodeComponent = (
        <ChangePriorityPopover
          isCanOperation={isCanEdit && !props.isPreview}
          record={{
            id: props.detail.id,
            project_id: props.detail.projectId,
          }}
          onChangePriority={onChangeState}
        >
          <div
            style={{
              cursor: isCanEdit ? 'pointer' : 'inherit',
              display: 'flex',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <CanOperation isCanEdit={isCanEdit} isPreview={props.isPreview}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <IconFont
                  style={{
                    fontSize: 20,
                    color: props.detail?.priority?.color,
                    marginRight: 4,
                  }}
                  type={props.detail?.priority?.icon}
                />
                <span>{props.detail?.priority?.content_txt || '--'}</span>
              </div>
              {isCanEdit ? <IconFontWrapEdit type="down-icon" /> : null}
            </CanOperation>
          </div>
        </ChangePriorityPopover>
      )
    }

    return nodeComponent
  }

  // 返回自定义字段
  const getCustomComponent = (item: any) => {
    return (
      <TableQuickEdit
        item={{
          ...props.detail,
          ...{ categoryConfigList: canOperationKeys },
          ...{ fieldContentValue: item.fieldContent.value },
        }}
        isInfo
        keyText={item.content}
        type={item.fieldContent?.attr}
        defaultText={props.detail?.customField?.[item.content]?.value}
        isCustom
        remarks={item?.remarks}
        onUpdate={props.onUpdate}
        isMineOrHis={demandDetailDrawerProps?.isMineOrHis}
        isInfoPage={props.isInfoPage}
        isPreview={props.isPreview}
      >
        <span>
          {getCustomNormalValue(
            item.fieldContent?.attr,
            props.detail?.customField?.[item.content],
          )}
        </span>
      </TableQuickEdit>
    )
  }

  useEffect(() => {
    if (props.detail?.category) {
      getFieldData()
    }
  }, [props.detail])

  useEffect(() => {
    if (isRefresh && props.detail?.category) {
      getFieldData()
    }
  }, [isRefresh])

  return (
    <div
      style={{
        backgroundColor: 'white',
        marginBottom: 12,
        padding: '12px 24px',
      }}
      id="tab_info"
      className="info_item_tab"
    >
      <Label>{t('newlyAdd.basicInfo')}</Label>
      {notFoldList
        ?.filter((i: any) => i.content !== 'schedule')
        ?.map((i: any) => {
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
        foldList
          ?.filter((i: any) => i.content !== 'schedule')
          ?.map((i: any) => (
            <InfoItem key={i.content}>
              <LimitLabel label={i.title} width={90} />
              <ContentWrap>
                {i.isCustomize === 1
                  ? getCustomComponent(i)
                  : getBasicTypeComponent(i)}
              </ContentWrap>
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
