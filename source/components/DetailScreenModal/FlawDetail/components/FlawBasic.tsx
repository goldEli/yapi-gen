import { getCustomNormalValue } from '@/tools'
import { useDispatch, useSelector } from '@store/index'
import { message, Tooltip } from 'antd'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ContentWrap,
  InfoItemBasic,
  Label,
  LabelItem,
  MaxLabel,
  ShowLabel,
} from '../style'
import { getMessage } from '@/components/Message'
import TableQuickEdit from '@/components/TableQuickEdit'
import {
  CanOperation,
  IconFontWrapEdit,
  SeverityWrap,
  SliderWrap,
} from '@/components/StyleCommon'
import ChangePriorityPopover from '@/components/ChangePriorityPopover'
import IconFont from '@/components/IconFont'
import { updateFlawPriority, updateFlawTableParams } from '@/services/flaw'
import { getCategoryConfigList } from '@/services/demand'
import ChangeSeverityPopover from '@/components/ChangeSeverityPopover'
import DetailParent from '@/components/DetailParent'
import MultipleAvatar from '@/components/MultipleAvatar'
import { setIsRefresh } from '@store/user'
import CommonProgress from '@/components/CommonProgress'

interface Props {
  detail?: any
  isOpen?: boolean
  onUpdate(): void
  hasPadding?: boolean
  // 是否是详情页面
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

const FlawBasic = (props: Props) => {
  const [t] = useTranslation()
  const dispatch = useDispatch()
  // 折叠字段
  const [foldList, setFoldList] = useState<any>([])
  // 不折叠字段
  const [notFoldList, setNotFoldList] = useState<any>([])
  const [isShowFields, setIsShowFields] = useState(false)
  const [schedule, setSchedule] = useState(props.detail?.schedule || 0)
  const { basicFieldList } = useSelector(store => store.global)
  const { userInfo, isRefresh } = useSelector(store => store.user)
  const { projectInfo } = useSelector(store => store.project)
  const [canOperationKeys, setCanOperationKeys] = useState<any>({})
  const { affairsDetailDrawer } = useSelector(store => store.affairs)
  useEffect(() => {
    setSchedule(props.detail?.schedule)
  }, [props.detail?.schedule])
  const isCanEdit =
    projectInfo.projectPermissions?.length > 0 &&
    projectInfo.projectPermissions?.filter(
      (i: any) => i.identity === 'b/flaw/update',
    )?.length > 0

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
      await updateFlawTableParams(obj)
      props.onUpdate?.()
    }
  }

  // 修改优先级
  const onChangeState = async (item: any) => {
    try {
      await updateFlawPriority({
        id: props.detail.id,
        priorityId: item.priorityId,
        projectId: props.detail.projectId,
      })
      getMessage({ msg: t('common.prioritySuccess'), type: 'success' })
      props.onUpdate?.()
    } catch (error) {
      //
    }
  }

  // 修改严重程度
  const onChangeSeverity = async (item: any) => {
    await updateFlawTableParams({
      id: item.id,
      projectId: props.detail.projectId,
      otherParams: {
        severity: item.severity,
      },
    })
    getMessage({ msg: t('successfullyModified'), type: 'success' })
    props.onUpdate?.()
  }

  // 提交参数需改变的 key
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
    const keys: any = []
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
    } else if (['iterate_name'].includes(content)) {
      // 迭代取值
      value = {
        defaultText:
          props.detail?.iterateName === '--' ? '' : props.detail?.iterateName,
        defaultHtml:
          props.detail?.iterateName === '--' ? '--' : props.detail?.iterateName,
      }
    } else if (content === 'discovery_version') {
      // 发现版本取值
      value = {
        defaultText: props.detail?.discovery_version_name ?? '--',
        defaultHtml: props.detail?.discovery_version_name ?? '--',
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
    } else if (content === 'solution') {
      // 解决方法
      value = {
        defaultText: props.detail?.solution || '',
        defaultHtml: props.detail?.solution || '--',
        valueType: ['text'],
      }
    }
    return value
  }

  // 返回基本字段
  const getBasicTypeComponent = (item: any) => {
    let nodeComponent

    // 如果不属于下列字段的则渲染
    if (!['parent_id', 'priority', 'severity'].includes(item.content)) {
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
          isMineOrHis={affairsDetailDrawer.params?.isMineOrHis}
          isInfoPage={props.isInfoPage}
          isBug
          isPreview={props.isPreview}
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
    } else if (item.content === 'parent_id') {
      nodeComponent = (
        <DetailParent
          hasEdit={!props.isPreview && isCanEdit}
          detail={props.detail}
          onUpdate={props.onUpdate}
          type={2}
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
            <CanOperation isCanEdit={isCanEdit}>
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
    } else if (item.content === 'severity') {
      nodeComponent = (
        <ChangeSeverityPopover
          isCanOperation={isCanEdit && !props.isPreview}
          record={{
            id: props.detail.id,
            project_id: props.detail.projectId,
          }}
          onChangeSeverity={onChangeSeverity}
        >
          <div
            style={{
              cursor: isCanEdit ? 'pointer' : 'inherit',
              display: 'flex',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <CanOperation isCanEdit={isCanEdit}>
              <SeverityWrap
                style={{
                  background: props.detail.severity?.color,
                  width: 'max-content',
                  cursor: isCanEdit ? 'pointer' : 'initial',
                }}
              >
                {props.detail.severity?.content ?? '--'}
              </SeverityWrap>
              {isCanEdit ? <IconFontWrapEdit type="down-icon" /> : null}
            </CanOperation>
          </div>
        </ChangeSeverityPopover>
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
        isMineOrHis={affairsDetailDrawer.params?.isMineOrHis}
        isInfoPage={props.isInfoPage}
        isBug
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
        width: '100%',
        paddingLeft: props.hasPadding ? '24px' : 12,
        height: 'calc(100% - 108px)',
        overflowY: 'auto',
        overflowX: 'hidden',
        backgroundColor: 'white',
        marginTop: '12px',
      }}
      id="tab_info"
      className="info_item_tab"
    >
      <div style={{ marginBottom: 20 }}>
        {props.isInfoPage ? (
          <CommonProgress
            update={props?.detail}
            isTable={false}
            percent={props?.detail?.schedule}
            type="flaw"
            hasEdit={
              !!isCanEdit &&
              !props.isPreview &&
              props?.detail?.user
                ?.map((i: any) => i?.user?.id)
                ?.includes(userInfo?.id)
            }
            id={props?.detail?.id}
            project_id={props?.detail?.projectId}
            onConfirm={props.onUpdate}
          />
        ) : null}
      </div>

      <Label>{t('newlyAdd.basicInfo')}</Label>
      {notFoldList
        ?.filter((i: any) => i.content !== 'schedule')
        ?.map((i: any) => {
          return (
            <InfoItemBasic key={i.content}>
              <LimitLabel label={i.title} width={90} />
              <ContentWrap
                style={{ width: i.content === 'schedule' ? '100%' : 'inherit' }}
              >
                {i.isCustomize === 1
                  ? getCustomComponent(i)
                  : getBasicTypeComponent(i)}
              </ContentWrap>
            </InfoItemBasic>
          )
        })}
      {!isShowFields && foldList?.length > 0 && (
        <ShowLabel onClick={() => setIsShowFields(true)}>
          {t('newlyAdd.open')}
        </ShowLabel>
      )}
      {isShowFields
        ? foldList
            ?.filter((i: any) => i.content !== 'schedule')
            ?.map((i: any) => (
              <InfoItemBasic key={i.content}>
                <LimitLabel label={i.title} width={90} />
                <ContentWrap
                  style={{
                    width: i.content === 'schedule' ? '100%' : 'inherit',
                  }}
                >
                  {i.isCustomize === 1
                    ? getCustomComponent(i)
                    : getBasicTypeComponent(i)}
                </ContentWrap>
              </InfoItemBasic>
            ))
        : null}
      {isShowFields && foldList?.length > 0 ? (
        <ShowLabel onClick={() => setIsShowFields(false)}>
          {t('newlyAdd.close')}
        </ShowLabel>
      ) : null}
    </div>
  )
}

export default FlawBasic
