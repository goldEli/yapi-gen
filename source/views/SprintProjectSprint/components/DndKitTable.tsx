import { Checkbox, Tooltip, type TableColumnProps } from 'antd'
import XTable from './XTable'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import IconFont from '@/components/IconFont'
import styled from '@emotion/styled'
import ChangePriorityPopover from '@/components/ChangePriorityPopover'
import ChangeStatusPopover from '@/components/ChangeStatusPopover/index'
import { ClickWrap } from '@/components/StyleCommon'
import CommonIconFont from '@/components/CommonIconFont'
import { useSelector, useDispatch } from '@store/index'
import {
  setRightSprintList,
  setSprintRefresh,
  setSprintRightListRefresh,
} from '@store/sprint'
import { useTranslation } from 'react-i18next'
import StateTag from '@/components/StateTag'
import { getIsPermission, getParamsData, copyLink } from '@/tools'
import { useSearchParams } from 'react-router-dom'
import MultipleAvatar from '@/components/MultipleAvatar'
import { setAffairsDetailDrawer } from '@store/affairs'
import { saveAffairsDetailDrawer } from '@store/affairs/affairs.thunk'
import {
  deleteAffairs,
  updateAffairsPriority,
  updateAffairsStatus,
  updateAffairsTableParams,
} from '@/services/affairs'
import { getMessage } from '@/components/Message'
import TableQuickEdit from '@/components/TableQuickEdit'
import { SprintDropdownMenu } from './SprintDropdownMenu'
import { useCallback, useEffect, useState } from 'react'
import MoreDropdown from '@/components/MoreDropdown'
import DeleteConfirm from '@/components/DeleteConfirm'
import { setAddWorkItemModal } from '@store/project'
import { getLongStory, moveStory, sortStory } from '@/services/sprint'
import moment from 'moment'
import ClickDropdown from './ClickDropdown'
import { useDeleteConfirmModal } from '@/hooks/useDeleteConfirmModal'
import CommonProgress from '@/components/CommonProgress'

const MoveFont = styled(IconFont)`
  font-size: 16;
  color: var(--neutral-n3);
  &:hover {
    color: var(--primary-d2);
    cursor: move;
  }
  cursor: move;
`
const TitleWrap = styled.div<{ isClose?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  .content {
    width: 160px;
    display: inline-block;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    &:hover {
      color: var(--primary-d2);
    }
    text-decoration: ${(props: any) =>
      props.isClose ? 'line-through' : 'inherit'};
    color: ${(props: any) => (props.isClose ? 'var(--neutral-n3)' : 'inherit')};
  }
`
const CustomWidthBox = styled.div<{ isClose?: boolean }>`
  padding-right: 20px;
  .content {
    max-width: 400px;
    display: inline-block;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    text-decoration: ${(props: any) =>
      props.isClose ? 'line-through' : 'inherit'};
    color: ${(props: any) => (props.isClose ? 'var(--neutral-n3)' : 'inherit')};
  }
`

const LongStoryWrap = styled.div`
  display: flex;
  .content {
    max-width: 160px;
    display: inline-block;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .icon {
    display: none;
  }
  &:hover .icon {
    display: inline-block;
    color: var(--neutral-n4);
  }
`
const CustomMoreDropdownWrap = styled.div`
  display: flex;
  align-items: center;
  svg {
    color: var(--neutral-n3);
  }
`

const CustomReactBox = styled.div`
  background: var(--neutral-n8);
  padding: 12px;
`

const PriorityWrap = styled.div<{ isShow?: boolean }>(
  {
    display: 'flex',
    alignItems: 'center',
    div: {
      color: 'var(--neutral-n1-d2)',
      fontSize: 14,
      marginLeft: 8,
    },
    '.icon': {
      marginLeft: 8,
      visibility: 'hidden',
      fontSize: 14,
      color: 'var(--neutral-n4)',
    },
    '.priorityIcon': {
      fontSize: 14,
    },
  },
  ({ isShow }) => ({
    cursor: isShow ? 'pointer' : 'inherit',
    '&: hover': {
      '.icon': {
        visibility: isShow ? 'visible' : 'hidden',
        color: 'var(--primary-d2)',
      },
    },
  }),
)

const DndKitTable = (props: any) => {
  const [t] = useTranslation()
  const { rightSprintList } = useSelector(state => state.sprint)
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData.id
  const { projectInfo, isUpdateAddWorkItem } = useSelector(
    store => store.project,
  )
  const [isShowMore, setIsShowMore] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [deleteItem, setDeleteItem] = useState<any>({})
  const [longStoryList, setLongStoryList] = useState<any>([])
  const { DeleteConfirmModal, open } = useDeleteConfirmModal()
  const [isDeleteCheck, setIsDeleteCheck] = useState(false)

  const isCanEdit = getIsPermission(
    projectInfo?.projectPermissions,
    'b/transaction/update',
  )
  const hasDel = getIsPermission(
    projectInfo?.projectPermissions,
    'b/transaction/delete',
  )

  // 获取长故事列表
  const getLongStoryData = async () => {
    try {
      const result = await getLongStory({
        order: 'desc',
        orderkey: 'updated_at',
        search: {
          all: 1,
          project_id: projectId,
        },
      })
      if (result && result.code === 0 && result.data) {
        setLongStoryList(result.data)
      }
    } catch (error) {
      //
    }
  }

  useEffect(() => {
    getLongStoryData()
  }, [isUpdateAddWorkItem])

  // 更改状态
  const onChangeStatus = async (value: any) => {
    await updateAffairsStatus(value)
    getMessage({ msg: t('common.statusSuccess'), type: 'success' })
    sessionStorage.setItem('noRefresh', 'true')
    dispatch(setSprintRefresh(1))
  }

  // 解除关联长故事
  const disassociateLongStory = useCallback(async (val: any) => {
    await updateAffairsTableParams({
      projectId,
      id: val,
      otherParams: {
        parent_id: 0,
      },
    })
    dispatch(setSprintRightListRefresh(1))
  }, [])

  // 更改优先级
  const onChangeState = async (item: any) => {
    await updateAffairsPriority({
      id: item.id,
      priorityId: item.priorityId,
      projectId,
    })
    getMessage({ msg: t('common.prioritySuccess'), type: 'success' })
    sessionStorage.setItem('noRefresh', 'true')
    dispatch(setSprintRefresh(1))
  }

  const onExamine = () => {
    getMessage({ msg: t('newlyAdd.underReview'), type: 'warning' })
  }

  // 更新列表
  const onUpdate = () => {
    sessionStorage.setItem('noRefresh', 'true')
    dispatch(setSprintRefresh(1))
  }

  // 点击打开详情并组装当前平级的需求id列表
  const onClickItem = (item: any) => {
    const group_id = Number(item.id?.split('_')[0]) || 0
    const id = Number(item.id?.split('_')[1]) || 0
    const demandIds: any[] = rightSprintList
      .find(k => k.id === group_id)
      ?.stories?.map((k: any) => k.id)
    sessionStorage.setItem('noRefresh', 'true')
    dispatch(
      setAffairsDetailDrawer({
        visible: true,
        params: { ...item, ...{ demandIds }, id },
      }),
    )
    dispatch(
      saveAffairsDetailDrawer({
        visible: true,
        params: { ...item, ...{ demandIds }, id },
      }),
    )
  }

  // 编辑事物
  const onEditItem = (record: any) => {
    const editId = Number(record?.id?.split('_')?.[1])
    sessionStorage.setItem('noRefresh', 'true')
    dispatch(
      setAddWorkItemModal({
        visible: true,
        params: {
          editId,
          projectId: record?.project_id,
          type: record.work_type,
          title: t('sprint.editTransaction'),
        },
      }),
    )
  }

  // 移动事务到别的冲刺
  const onRemoveSprintItem = async (
    iterate_id: number,
    story_id: number,
    to_iterate_id: number,
    needFresh: boolean,
  ) => {
    try {
      const result = await moveStory({
        iterate_id,
        story_id,
        to_iterate_id,
        project_id: projectId,
      })
      if (result && result.code === 0) {
        getMessage({
          msg: t('sprint.moveSuccess'),
          type: 'success',
        })
        if (needFresh) {
          sessionStorage.setItem('noRefresh', 'true')
          dispatch(setSprintRefresh(1))
        }
        return true
      }
    } catch (error) {
      //
    }
  }

  // 设置选中的事务
  const onDeleteChange = (item: any) => {
    const id = Number(item.id?.split('_')[1]) || 0
    setDeleteItem({ ...item, id })
    setIsVisible(true)
  }

  // 删除事务
  const onDeleteConfirm = async () => {
    await deleteAffairs({
      projectId,
      id: deleteItem.id,
      isDeleteChild: isDeleteCheck ? 1 : 2,
    })
    getMessage({ msg: t('common.deleteSuccess'), type: 'success' })
    setIsVisible(false)
    setDeleteItem({})
    if (deleteItem?.isLong) {
      if (props?.activeKey === 1) {
        sessionStorage.removeItem('noRefresh')
      } else {
        sessionStorage.setItem('noRefresh', 'true')
      }
      getLongStoryData()
    } else {
      sessionStorage.setItem('noRefresh', 'true')
    }
    dispatch(setSprintRefresh(1))
  }

  // 判断当前事务是否超出冲刺时间范围
  const getIsExceedTimeRange = (item: any, sprint?: any) => {
    let sprintObj = sprint
    const groupId = item.iterate_id
    if (!sprintObj) {
      sprintObj = rightSprintList.find(k => k.id === groupId)
    }
    if (
      ((moment(item.expected_start_at).isSame(sprintObj?.start_at) ||
        moment(item.expected_start_at).isAfter(sprintObj?.start_at)) &&
        (moment(item.expected_end_at).isSame(sprintObj?.end_at) ||
          moment(item.expected_end_at).isBefore(sprintObj?.end_at))) ||
      (!sprintObj?.start_at && !sprintObj?.end_at)
    ) {
      return false
    }
    return true
  }
  // 复制编号
  const onCopyNumber = (id: string) => {
    copyLink(id, t('copysuccess'), t('copyfailed'))
  }
  const columns: TableColumnProps<any>[] = [
    {
      width: 50,
      align: 'center',
      render: (text: any, record: any) => {
        return (
          <CustomMoreDropdownWrap>
            {!isCanEdit && !hasDel && (
              <MoreDropdown
                hasChild
                isMoreVisible={isShowMore}
                menu={
                  <SprintDropdownMenu
                    onDeleteChange={() => {
                      onDeleteChange(record)
                    }}
                    onEditItem={onEditItem}
                    onRemoveSprintItem={onRemoveSprintItem}
                    record={record}
                  />
                }
                onChangeVisible={setIsShowMore}
              />
            )}
          </CustomMoreDropdownWrap>
        )
      },
    },
    {
      dataIndex: 'sort',
      width: 50,
      render: () => <MoveFont type="move" style={{ fontSize: 16 }} />,
    },
    {
      title: t('sprint.Number'),
      dataIndex: 'story_prefix_key',
      key: 'story_prefix_key',
      width: 140,
      render(value, temp) {
        const id = temp.id?.split('_')?.[1]
        const record = { ...temp, id, isExamine: temp.verify_lock === 1 }
        return (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              position: 'relative',
              left: -19,
            }}
          >
            {getIsExceedTimeRange(temp) && record?.iterate_id !== 0 ? (
              <Tooltip placement="top" title={t('sprint.outOf')}>
                <IconFont
                  style={{
                    fontSize: 16,
                    color: 'var(--function-warning)',
                    marginRight: 5,
                  }}
                  type="warning-02"
                />
              </Tooltip>
            ) : (
              <div style={{ width: 21 }}></div>
            )}
            <TitleWrap
              style={{
                color: temp.status?.is_end === 1 ? 'var(--neutral-n3)' : '',
              }}
            >
              <ClickWrap>
                <div className="text" onClick={() => onClickItem(temp)}>
                  {value}
                </div>
                <CommonIconFont
                  type="share"
                  size={20}
                  color="var(--neutral-n3)"
                  onClick={() => onCopyNumber(value)}
                />
              </ClickWrap>
            </TitleWrap>
          </div>
        )
      },
    },
    {
      title: t('common.title'),
      dataIndex: 'name',
      key: 'name',
      width: 400,
      render(value, record) {
        return (
          <TitleWrap
            onClick={() => {
              onClickItem(record)
            }}
            isClose={record.status?.is_end === 1}
          >
            <Tooltip placement="top" title={record?.category_name}>
              <img
                src={
                  record.category_attachment ? record.category_attachment : ' '
                }
                style={{
                  width: '18px',
                  height: '18px',
                  marginRight: '8px',
                }}
                alt=""
              />
            </Tooltip>
            <Tooltip placement="topLeft" title={value}>
              <CustomWidthBox isClose={record.status?.is_end === 1}>
                <span
                  style={{
                    marginTop: 6,
                    maxWidth: 400,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    display: 'inline-block',
                    textDecoration:
                      record.status?.is_end === 1 ? 'line-through' : 'inherit',
                    color:
                      record.status?.is_end === 1
                        ? 'var(--neutral-n3)'
                        : 'inherit',
                  }}
                  className={
                    value?.length > 27
                      ? `customControlMaxWidth_${record?.iterate_id}`
                      : ''
                  }
                >
                  {value}
                </span>
              </CustomWidthBox>
            </Tooltip>
          </TitleWrap>
        )
      },
    },
    {
      title: t('sprint.longStory'),
      dataIndex: 'long_story_name',
      width: 200,
      render: (text: any, record: any) => {
        return isCanEdit ? (
          <div>{text ? text : '--'}</div>
        ) : (
          <ClickDropdown
            activeKey={props?.activeKey}
            setIsVisible={setIsVisible}
            setDeleteItem={setDeleteItem}
            record={record}
            longStoryList={longStoryList}
            clearLongStory={disassociateLongStory}
          >
            <LongStoryWrap>
              <Tooltip title={text}>
                <div className="content">{text ? text : '--'}</div>
              </Tooltip>
              <span style={{ marginLeft: '5px' }}>
                <IconFont className="icon" type="down-icon" />
              </span>
            </LongStoryWrap>
          </ClickDropdown>
        )
      },
    },
    { title: t('sprint.sub'), dataIndex: 'child_story_count', width: 120 },
    {
      title: t('situation.progress'),
      dataIndex: 'child_story_count',
      width: 120,
      render: (text: number, record: any) => {
        const id = record.id?.split('_')?.[1]
        return (
          <div>
            <CommonProgress
              project_id={record.project_id}
              percent={text}
              isTable
              id={id}
            />
          </div>
        )
      },
    },
    {
      title: t('common.dealName'),
      dataIndex: 'handlers',
      key: 'handlers',
      width: 140,
      render: (text: any, temp: any) => {
        const id = temp.id?.split('_')?.[1]
        const record = {
          ...temp,
          id,
          categoryConfigList: temp.category_config_list,
        }
        return (
          <TableQuickEdit
            type="fixed_select"
            defaultText={record?.handlers_name_ids || []}
            keyText="users"
            item={record}
            onUpdate={() => onUpdate()}
          >
            {record?.handlers?.length ? (
              <MultipleAvatar
                max={3}
                list={record?.handlers?.map((i: any) => ({
                  id: i.id,
                  name: i.name,
                  avatar: i.avatar,
                }))}
              />
            ) : null}
            {!record?.handlers?.length && '--'}
          </TableQuickEdit>
        )
      },
    },
    {
      title: t('common.priority'),
      dataIndex: 'priority',
      key: 'priority',
      width: 100,
      render: (text: any, temp: any) => {
        const id = temp.id?.split('_')?.[1]
        const record = { ...temp, id }
        return (
          <ChangePriorityPopover
            isCanOperation={
              !isCanEdit &&
              Object.keys(record.category_config_list).includes('priority')
            }
            onChangePriority={item => onChangeState(item)}
            record={{ project_id: projectId, id: record.id }}
          >
            <PriorityWrap isShow={!isCanEdit}>
              {text?.icon ? (
                <>
                  <IconFont
                    className="priorityIcon"
                    type={text?.icon}
                    style={{
                      fontSize: 20,
                      color: text?.color,
                    }}
                  />
                  <span>{text.content_txt}</span>
                </>
              ) : null}
              <span style={{ marginLeft: '5px' }}>
                {!text?.icon && <span>--</span>}
                <IconFont
                  className="icon"
                  style={{ color: 'var(--neutral-n4)' }}
                  type="down-icon"
                />
              </span>
            </PriorityWrap>
          </ChangePriorityPopover>
        )
      },
    },
    {
      title: t('common.status'),
      dataIndex: 'status',
      key: 'status',
      width: 170,
      render: (text: any, temp: any) => {
        const id = temp.id?.split('_')?.[1]
        const record = { ...temp, id, isExamine: temp.verify_lock === 1 }
        return (
          <ChangeStatusPopover
            isCanOperation={!isCanEdit && !record.isExamine}
            projectId={projectId}
            record={record}
            onChangeStatus={item => onChangeStatus(item)}
            type={2}
          >
            <StateTag
              onClick={record.isExamine ? onExamine : void 0}
              isShow={!isCanEdit || !record.verify_lock}
              name={record?.status?.status?.content}
              state={
                text?.is_start === 1 && text?.is_end === 2
                  ? 1
                  : text?.is_end === 1 && text?.is_start === 2
                  ? 2
                  : text?.is_start === 2 && text?.is_end === 2
                  ? 3
                  : 0
              }
            />
          </ChangeStatusPopover>
        )
      },
    },
    {
      title: t('common.createName'),
      dataIndex: 'creator',
      key: 'creator',
      width: 120,
      render: (text: string, record: any) => {
        return (
          <MultipleAvatar
            max={1}
            list={[
              {
                avatar: record.creator?.avatar,
                id: record.creator?.id,
                name: record.creator?.name,
              },
            ]}
          />
        )
      },
    },
    {
      title: t('common.expectedStart'),
      dataIndex: 'expected_start_at',
      key: 'expected_start_at',
      width: 170,
      render: (text: string, temp: any) => {
        const id = temp.id?.split('_')?.[1]
        const record = {
          ...temp,
          id,
          categoryConfigList: temp.category_config_list,
        }
        return (
          <TableQuickEdit
            type="date"
            defaultText={text}
            keyText="expected_start_at"
            item={record}
            onUpdate={() => onUpdate()}
            value={['datetime']}
          >
            <span>{text || '--'}</span>
          </TableQuickEdit>
        )
      },
    },
    {
      title: t('common.expectedEnd'),
      dataIndex: 'expected_end_at',
      key: 'expected_end_at',
      width: 170,
      render: (text: string, temp: any) => {
        const id = temp.id?.split('_')?.[1]
        const record = {
          ...temp,
          id,
          categoryConfigList: temp.category_config_list,
        }
        return (
          <TableQuickEdit
            type="date"
            defaultText={text}
            keyText="expected_end_at"
            item={record}
            onUpdate={() => onUpdate()}
            value={['datetime']}
          >
            <span>{text || '--'}</span>
          </TableQuickEdit>
        )
      },
    },
  ]

  // 拖动排序接口
  const handleSort = async (iterate_id: number, story_ids: number[]) => {
    try {
      const result: any = await sortStory({
        iterate_id,
        story_ids,
        project_id: projectId,
      })
      if (result && result.code === 0) {
        getMessage({
          msg: t('sprint.moveSuccess'),
          type: 'success',
        })
      } else {
        getMessage({
          msg: result?.message,
          type: 'error',
        })
        sessionStorage.setItem('noRefresh', 'true')
        dispatch(setSprintRefresh(1))
      }
    } catch (error) {
      sessionStorage.setItem('noRefresh', 'true')
      dispatch(setSprintRefresh(1))
    }
  }

  // 判断当前进行中的冲刺是否只有一条，只有一条的话拖走前弹出提示窗口
  const haveOnlyOne = (item: any) => {
    if (item?.status === 1 && item?.stories?.length === 1) {
      return true
    }
    return false
  }

  // 拖动事务放下后的处理
  const handleDragEnd = (result: DropResult) => {
    // 没有操作权限直接无效
    if (isCanEdit) return
    if (result.destination?.droppableId === result.source.droppableId) {
      // 同表格换位置
      const data = [...rightSprintList]
      const idx = data.findIndex(
        k => String(k.id) === result.destination?.droppableId,
      )
      const destList = data[idx]
      const source = [...destList.stories]
      const item = destList.stories.find(
        (_: any, i: any) => i === result.source?.index,
      )
      source.splice(result.source?.index, 1)
      source.splice(result.destination?.index ?? 0, 0, item)
      const res: any = data.map(k => {
        if (String(k.id) === result.destination?.droppableId) {
          return { ...k, stories: source }
        }
        return k
      })
      handleSort(
        destList?.id,
        source?.map((k: any) => k.id),
      )
      dispatch(setRightSprintList(res))
    } else {
      // 不同表格拖动
      const data = [...rightSprintList]
      const destIdx = data.findIndex(
        k => String(k.id) === result.destination?.droppableId,
      )
      const sourceIdx = data.findIndex(
        k => String(k.id) === result.source?.droppableId,
      )
      const item = data[sourceIdx].stories.find(
        (_: any, i: any) => i === result.source?.index,
      )
      const sourceList = data[sourceIdx]
      const destList = data[destIdx]
      const source = [...data[sourceIdx].stories]
      source.splice(result.source?.index, 1)
      const dest = [...data[destIdx].stories]
      dest.splice(result.destination?.index ?? 0, 0, item)
      const res = data.map(k => {
        if (String(k.id) === result.destination?.droppableId) {
          return { ...k, stories: dest }
        }
        if (String(k.id) === result.source?.droppableId) {
          return { ...k, stories: source }
        }
        return k
      })
      // 判断是否超出冲刺时间范围
      if (
        (getIsExceedTimeRange(item, destList) || haveOnlyOne(sourceList)) &&
        Number(result.destination?.droppableId) !== 0
      ) {
        open({
          title: t('sprint.moveTransaction'),
          okText: t('sprint.move'),
          children: (
            <div>
              <div>{t('sprint.affect')}</div>
              <div>{`${item.name} ${t('sprint.will')}【${sourceList.name}】${t(
                'sprint.to',
              )}【${destList.name}】。`}</div>
            </div>
          ),
          onConfirm: async () => {
            onRemoveSprintItem(
              sourceList?.id,
              item?.id,
              destList?.id,
              true,
            ).then((result: any) => {
              if (result) {
                handleSort(
                  destList?.id,
                  dest?.map((k: any) => k.id),
                )
                dispatch(setRightSprintList(res))
              }
            })
          },
        })
      } else {
        onRemoveSprintItem(sourceList?.id, item?.id, destList?.id, true).then(
          (result: any) => {
            if (result) {
              handleSort(
                destList?.id,
                dest?.map((k: any) => k.id),
              )
              dispatch(setRightSprintList(res))
            }
          },
        )
      }
    }
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <CustomReactBox>
        {(props?.activeKey === 0 && props?.checkCommission?.[props?.activeKey]
          ? rightSprintList.filter((i: any) => i.id === 0)
          : rightSprintList
        )?.map((item: any) => {
          return (
            <XTable
              activeKey={props?.activeKey}
              key={item.id}
              data={item}
              list={item?.stories?.map((i: any) => ({
                ...i,
                id: `${item.id}_${i.id}`,
              }))}
              columns={columns}
            />
          )
        })}
      </CustomReactBox>
      <DeleteConfirm
        title={`${t('sprint.delete')}【${deleteItem?.story_prefix_key}】？`}
        isVisible={isVisible}
        onChangeVisible={() => setIsVisible(!isVisible)}
        onConfirm={onDeleteConfirm}
      >
        <div style={{ marginBottom: 9 }}>
          {t('sprint.permanentlyDelete')}
          {deleteItem.isLong ? t('sprint.longStory') : t('affairs')}，
          {t('sprint.caution')}!
        </div>
        <Checkbox onChange={e => setIsDeleteCheck(e.target.checked)}>
          {t('sprint.also')}
          {deleteItem.isLong ? t('sprint.longStory') : t('affairs')}
          {t('sprint.subOwner')}
          {deleteItem.isLong ? t('sprint.longStory') : t('affairs')}
        </Checkbox>
      </DeleteConfirm>
      <DeleteConfirmModal />
    </DragDropContext>
  )
}

export default DndKitTable
