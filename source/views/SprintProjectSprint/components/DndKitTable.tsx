import { Checkbox, Tooltip, type TableColumnProps } from 'antd'
import XTable from './XTable'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import IconFont from '@/components/IconFont'
import styled from '@emotion/styled'
import ChangePriorityPopover from '@/components/ChangePriorityPopover'
import ChangeStatusPopover from '@/components/ChangeStatusPopover/index'
import { useSelector, useDispatch } from '@store/index'
import {
  setRightSprintList,
  setSprintRefresh,
  setSprintRightListRefresh,
} from '@store/sprint'
import { useTranslation } from 'react-i18next'
import StateTag from '@/components/StateTag'
import { getIsPermission, getParamsData } from '@/tools'
import { useSearchParams } from 'react-router-dom'
import MultipleAvatar from '@/components/MultipleAvatar'
import { setAffairsDetailDrawer } from '@store/affairs'
import { saveAffairsDetailDrawer } from '@store/affairs/affairs.thunk'
import {
  deleteAffairs,
  updateAffairsPriority,
  updateAffairsStatus,
} from '@/services/affairs'
import { getMessage } from '@/components/Message'
import TableQuickEdit from '@/components/TableQuickEdit'
import { SprintDropdownMenu } from './SprintDropdownMenu'
import { useEffect, useState } from 'react'
import MoreDropdown from '@/components/MoreDropdown'
import DeleteConfirm from '@/components/DeleteConfirm'
import { setAddWorkItemModal } from '@store/project'
import { getLongStory, moveStory, sortStory } from '@/services/sprint'
import moment from 'moment'
import ClickDropdown from './ClickDropdown'
import { useDeleteConfirmModal } from '@/hooks/useDeleteConfirmModal'

const MoveFont = styled(IconFont)`
  fontsize: 16;
  color: var(--neutral-n3);
  &:hover {
    color: var(--primary-d2);
    cursor: move;
  }
  cursor: move;
`
const TitleWrap = styled.div<{ isClose?: boolean }>`
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
    color: var(--primary-d2);
  }
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
    projectInfo.projectType === 1 ? 'b/story/update' : 'b/transaction/update',
  )
  const hasDel = getIsPermission(
    projectInfo?.projectPermissions,
    projectInfo.projectType === 1 ? 'b/story/delete' : 'b/transaction/delete',
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
      // console.log(error)
    }
  }

  useEffect(() => {
    getLongStoryData()
  }, [isUpdateAddWorkItem])

  // 更改状态
  const onChangeStatus = async (value: any) => {
    await updateAffairsStatus(value)
    getMessage({ msg: t('common.statusSuccess'), type: 'success' })
    dispatch(setSprintRefresh(1))
  }

  // 更改优先级
  const onChangeState = async (item: any) => {
    await updateAffairsPriority({
      sprintId: item.id,
      priorityId: item.priorityId,
      projectId,
    })
    getMessage({ msg: t('common.prioritySuccess'), type: 'success' })
    dispatch(setSprintRefresh(1))
  }

  const onExamine = () => {
    getMessage({ msg: t('newlyAdd.underReview'), type: 'warning' })
  }

  // 更新列表
  const onUpdate = () => {
    dispatch(setSprintRefresh(1))
  }

  // 点击打开详情并组装当前平级的需求id列表
  const onClickItem = (item: any) => {
    const group_id = Number(item.id?.split('_')[0]) || 0
    const id = Number(item.id?.split('_')[1]) || 0
    const demandIds: any[] = rightSprintList
      .find(k => k.id === group_id)
      ?.stories?.map((k: any) => k.id)

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
    // todo 编辑事物
    dispatch(
      setAddWorkItemModal({
        visible: true,
        params: {
          editId,
          projectId: record?.project_id,
          type: 4,
          title: '编辑事务',
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
          msg: '移动成功',
          type: 'success',
        })
        if (needFresh) {
          dispatch(setSprintRightListRefresh(1))
        }
        return true
      }
    } catch (error) {
      // console.log('error', error)
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
      getLongStoryData()
    }
    dispatch(setSprintRefresh(1))
  }

  // 判断当前事务是否超出冲刺时间范围
  const getIsExceedTimeRange = (item: any) => {
    const groupId = item.iterate_id
    const sprintObj = rightSprintList.find(k => k.id === groupId)
    if (
      (moment(item.expected_start_at).isSame(sprintObj?.start_at) ||
        moment(item.expected_start_at).isAfter(sprintObj?.start_at)) &&
      (moment(item.expected_end_at).isSame(sprintObj?.end_at) ||
        moment(item.expected_end_at).isBefore(sprintObj?.end_at))
    ) {
      return false
    }
    return true
  }

  const columns: TableColumnProps<any>[] = [
    {
      render: (text: any, record: any) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
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
          </div>
        )
      },
    },
    {
      dataIndex: 'sort',
      render: () => <MoveFont type="move" />,
    },
    {
      title: '编号',
      dataIndex: 'story_prefix_key',
      key: 'story_prefix_key',
      width: 200,
      render(value, record) {
        return (
          <TitleWrap
            style={{
              color: record.status?.is_end === 1 ? 'var(--neutral-n3)' : '',
            }}
            onClick={() => {
              onClickItem(record)
            }}
          >
            <span className="content">{value}</span>
          </TitleWrap>
        )
      },
    },
    {
      title: '标题',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render(value, record) {
        return (
          <TitleWrap
            onClick={() => {
              onClickItem(record)
            }}
            isClose={record.status?.is_end === 1}
          >
            <Tooltip placement="topLeft" title={record.category}>
              <img
                src={
                  record.category_attachment
                    ? record.category_attachment
                    : 'https://varlet.gitee.io/varlet-ui/cat.jpg'
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
              <span className="content">{value}</span>
            </Tooltip>
          </TitleWrap>
        )
      },
    },
    {
      title: '长故事',
      dataIndex: 'long_story_name',
      width: 200,
      render: (text: any, record: any) => {
        return isCanEdit ? (
          <div>{text ? text : '--'}</div>
        ) : (
          <ClickDropdown
            setIsVisible={setIsVisible}
            setDeleteItem={setDeleteItem}
            record={record}
            longStoryList={longStoryList}
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
    { title: '子事务', dataIndex: 'child_story_count' },
    {
      title: '经办人',
      dataIndex: 'handlers',
      key: 'handlers',
      width: 180,
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
            isBindBody="1"
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
      width: 180,
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
                <IconFont
                  className="priorityIcon"
                  type={text?.icon}
                  style={{
                    fontSize: 20,
                    color: text?.color,
                  }}
                />
              ) : null}
              <span style={{ marginLeft: '5px' }}>
                {!text?.icon && <span>--</span>}
                <IconFont className="icon" type="down-icon" />
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
      width: 190,
      render: (text: any, temp: any) => {
        const id = temp.id?.split('_')?.[1]
        const record = { ...temp, id, isExamine: temp.verify_lock === 1 }
        return (
          <>
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
                name={record.status.status.content}
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
            {getIsExceedTimeRange(temp) && record?.iterate_id !== 0 ? (
              <Tooltip placement="top" title="该事务超出冲刺时间范围">
                <IconFont
                  style={{
                    fontSize: 16,
                    marginLeft: 20,
                    color: 'var(--function-warning)',
                  }}
                  type="warning-02"
                />
              </Tooltip>
            ) : null}
          </>
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
          msg: '移动成功',
          type: 'success',
        })
      } else {
        getMessage({
          msg: result?.message,
          type: 'error',
        })
        dispatch(setSprintRefresh(1))
      }
    } catch (error) {
      // console.log(error)
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
        (getIsExceedTimeRange(item) || haveOnlyOne(sourceList)) &&
        Number(result.destination?.droppableId) !== 0
      ) {
        open({
          title: '移动事务',
          okText: '移动',
          children: (
            <div>
              <div>该操作会影响冲刺范围</div>
              <div>{`${item.name} 将从冲刺【${sourceList.name}】移到冲刺【${destList.name}】。`}</div>
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
      {(props?.checkCommission
        ? rightSprintList.filter((i: any) => i.id === 0)
        : rightSprintList
      )?.map((item: any) => {
        return (
          <XTable
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
      <DeleteConfirm
        title={`删除【${deleteItem?.story_prefix_key}】？`}
        isVisible={isVisible}
        onChangeVisible={() => setIsVisible(!isVisible)}
        onConfirm={onDeleteConfirm}
      >
        <div style={{ marginBottom: 9 }}>
          你将永久删除该{deleteItem.isLong ? '长故事' : '事务'}
          ，删除后将不可恢复请谨慎操作!
        </div>
        <Checkbox onChange={e => setIsDeleteCheck(e.target.checked)}>
          同时删除该{deleteItem.isLong ? '长故事' : '事务'}下所有子
          {deleteItem.isLong ? '长故事' : '事务'}
        </Checkbox>
      </DeleteConfirm>
      <DeleteConfirmModal />
    </DragDropContext>
  )
}

export default DndKitTable
