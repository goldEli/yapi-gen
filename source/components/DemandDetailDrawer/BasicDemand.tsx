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
import { message, Tooltip } from 'antd'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ChangePriorityPopover from '../ChangePriorityPopover'
import IconFont from '../IconFont'
import { getMessage } from '../Message'
import {
  AddWrap,
  CanOperation,
  IconFontWrapEdit,
  SliderWrap,
} from '../StyleCommon'
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
  console.log('props.detail?.schedule', props.detail?.schedule)
  const [notFoldList, setNotFoldList] = useState<any>([])
  const [isShowFields, setIsShowFields] = useState(false)
  const [schedule, setSchedule] = useState(props.detail?.schedule || 0)
  const { basicFieldList } = useSelector(store => store.global)
  const { userInfo, isRefresh } = useSelector(store => store.user)
  const { projectInfo } = useSelector(store => store.project)
  const [canOperationKeys, setCanOperationKeys] = useState<any>({})
  const { demandDetailDrawerProps } = useSelector(store => store.demand)

  const isCanEdit =
    projectInfo.projectPermissions?.length > 0 &&
    projectInfo.projectPermissions?.filter(
      (i: any) => i.identity === 'b/story/update',
    )?.length > 0
  useEffect(() => {
    setSchedule(props.detail?.schedule)
  }, [props.detail?.schedule])
  // 修改进度
  const onChangeSchedule = async () => {
    if (
      props.detail?.user?.map((i: any) => i.user.id)?.includes(userInfo?.id) &&
      props.detail.status.is_start !== 1 &&
      props.detail.status.is_end !== 1
    ) {
      const obj = {
        projectId: props.detail.projectId,
        id: props.detail?.id,
        otherParams: { schedule },
      }
      try {
        await updateTableParams(obj)
        props.onUpdate?.()
      } catch (error) {
        //
      }
    }
  }

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
    setNotFoldList(
      result?.filter(
        (i: any) =>
          i.isFold === 1 &&
          i.status === 1 &&
          !['finish_at', 'created_at', 'user_name'].includes(i.content),
      ),
    )
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
    // 如果不属于下列字段的则渲染
    if (!['schedule', 'parent_id', 'priority'].includes(item.content)) {
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
        >
          {['users_copysend_name', 'users_name'].includes(item.content) && (
            <MultipleAvatar
              max={3}
              list={
                item.content === 'users_name'
                  ? props.detail?.user?.map((i: any) => ({
                      id: i.user.id,
                      name: i.user.name,
                      avatar: i.user.avatar,
                    }))
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
    } else if (item.content === 'schedule') {
      nodeComponent = (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginLeft: '15px',
            width: '100%',
          }}
          onMouseUp={onChangeSchedule}
        >
          <SliderWrap
            isDisabled={
              props.detail?.user
                ?.map((i: any) => i.user.id)
                ?.includes(userInfo?.id) && props.detail.status.is_start !== 1
                ? props.detail.status.is_end !== 1
                : null
            }
            style={{ width: '70%', maxWidth: 200 }}
            value={schedule}
            tipFormatter={(value: any) => `${value}%`}
            onChange={value => setSchedule(value)}
            tooltipVisible={false}
            disabled={
              !(
                props.detail?.user
                  ?.map((i: any) => i.user.id)
                  ?.includes(userInfo?.id) &&
                props.detail.status.is_start !== 1 &&
                props.detail.status.is_end !== 1
              )
            }
          />
          <span
            style={{ color: 'var(--neutral-n2)', marginLeft: 16, fontSize: 14 }}
          >
            {schedule}%
          </span>
        </div>
      )
    } else if (item.content === 'parent_id') {
      nodeComponent = (
        <DetailParent
          hasEdit={isCanEdit}
          detail={props.detail}
          onUpdate={props.onUpdate}
          type={1}
          canOperationKeys={canOperationKeys}
        />
      )
    } else if (item.content === 'priority') {
      nodeComponent = (
        <ChangePriorityPopover
          isCanOperation={isCanEdit}
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
            }}
          >
            <CanOperation isCanEdit={isCanEdit}>
              <IconFont
                style={{
                  fontSize: 20,
                  color: props.detail?.priority?.color,
                  marginRight: 4,
                }}
                type={props.detail?.priority?.icon}
              />
              <span>{props.detail?.priority?.content_txt || '--'}</span>
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
    // if (props.isOpen && props.detail?.id) {
    //   getFieldData()
    // }
    getFieldData()
  }, [props.isOpen, props.detail])

  useEffect(() => {
    if (isRefresh) {
      getFieldData()
    }
  }, [isRefresh])

  return (
    <div style={{ marginTop: '20px' }} id="tab_info">
      <Label>{t('newlyAdd.basicInfo')}</Label>
      {notFoldList?.map((i: any) => {
        return (
          <InfoItem key={i.content}>
            <LimitLabel label={i.title} width={90} />
            <ContentWrap
              style={{ width: i.content === 'schedule' ? '100%' : 'inherit' }}
            >
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
            <ContentWrap
              style={{ width: i.content === 'schedule' ? '100%' : 'inherit' }}
            >
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
