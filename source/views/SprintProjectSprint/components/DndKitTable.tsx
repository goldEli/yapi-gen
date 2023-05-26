import { type TableColumnProps } from 'antd'
import XTable from './XTable'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import IconFont from '@/components/IconFont'
import styled from '@emotion/styled'
import MoreDropdown from '@/components/MoreDropdown'
import { DemandOperationDropdownMenu } from '@/components/TableDropdownMenu/DemandDropdownMenu'
import ChangePriorityPopover from '@/components/ChangePriorityPopover'
import { PriorityWrap } from '@/components/StyleCommon'
import ChangeStatusPopover from '@/components/ChangeStatusPopover/index'
import { useSelector, useDispatch } from '@store/index'
import { setSprintTableData } from '@store/sprint'
import { useTranslation } from 'react-i18next'
import StateTag from '@/components/StateTag'
import { getParamsData } from '@/tools'
import { useSearchParams } from 'react-router-dom'
import TableQuickEdit from '@/components/TableQuickEdit'
import MultipleAvatar from '@/components/MultipleAvatar'

const MoveFont = styled(IconFont)`
  fontsize: 16;
  color: var(--neutral-n3);
  &:hover {
    color: var(--primary-d2);
    cursor: move;
  }
  cursor: move;
`

type TableItem = {
  id: string
  name?: string
  sex?: string
  age?: number
  address?: string
}

const DndKitTable = () => {
  const [t] = useTranslation()
  const { rightSprintList } = useSelector(state => state.sprint)
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData.id

  const onChangeState = async (item: any) => {
    // try {
    //   await updatePriority({
    //     demandId: item.id,
    //     priorityId: item.priorityId,
    //     projectId,
    //   })
    //   getMessage({ msg: t('common.prioritySuccess'), type: 'success' })
    //   props.onChangeRow?.()
    // } catch (error) {
    //   //
    // }
  }
  const onUpdate = (row: any, isClass?: any) => {}

  const columns: TableColumnProps<TableItem>[] = [
    {
      render: (text: any, record: any) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <MoreDropdown
              menu={
                <DemandOperationDropdownMenu
                  onEditChange={() => {}}
                  onDeleteChange={() => {}}
                  onCreateChild={() => {}}
                  record={record}
                />
              }
            />
          </div>
        )
      },
    },
    {
      dataIndex: 'sort',
      render: () => <MoveFont type="move" />,
    },
    { title: '编号', dataIndex: 'story_prefix_key' },
    { title: '标题', dataIndex: 'name' },
    { title: '长故事', dataIndex: 'long_story_name' },
    { title: '子事务', dataIndex: 'child_story_count' },
    { title: '经办人', dataIndex: 'handlers_name_ids' },
    {
      title: '经办人',
      dataIndex: 'handlers',
      key: 'handlers',
      width: 180,
      render: (text: any, record: any) => {
        return (
          // <TableQuickEdit
          //   type="fixed_select"
          //   defaultText={record?.handlers_name_ids || []}
          //   keyText="users"
          //   item={record}
          //   onUpdate={() => onUpdate(record)}
          // >
          <MultipleAvatar
            max={3}
            list={record.handlers?.map((i: any) => ({
              id: i.id,
              name: i.name,
              avatar: i.avatar,
            }))}
          />
          // </TableQuickEdit>
        )
      },
    },
    {
      title: t('common.priority'),
      dataIndex: 'priority',
      key: 'priority',
      width: 180,
      render: (text: any, record: Record<string, string | number>) => {
        return (
          <ChangePriorityPopover
            isCanOperation
            onChangePriority={item => onChangeState(item)}
            record={{ project_id: projectId, id: record.id }}
          >
            <PriorityWrap>
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
      render: (text: any, record: any) => {
        return (
          <ChangeStatusPopover
          // isCanOperation={isCanEdit && !record.isExamine}
          // projectId={state.projectId}
          // record={record}
          // onChangeStatus={item => state.onChangeStatus(item, record)}
          >
            <StateTag
              // onClick={record.isExamine ? onExamine : void 0}
              // isShow={isCanEdit || record.isExamine}
              isShow
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
        )
      },
    },
  ]

  const handleDragEnd = (result: DropResult) => {
    console.log(result)
    if (result.destination?.droppableId === result.source.droppableId) {
      // 同表格换位置
      const data = [...rightSprintList]
      const idx = data.findIndex(k => k.id === result.destination?.droppableId)
      const destList = data[idx]
      const source = [...destList.list]

      const item = destList.list.find(
        (_: any, i: any) => i === result.source?.index,
      )
      source.splice(result.source?.index, 1)
      source.splice(result.destination?.index ?? 0, 0, item)
      const res: any = data.map(k => {
        if (k.id === result.destination?.droppableId) {
          return { ...k, list: source }
        }
        return k
      })
      dispatch(setSprintTableData(res))
    } else {
      // 不同表格拖动
      const data = [...rightSprintList]
      const destIdx = data.findIndex(
        k => k.id === result.destination?.droppableId,
      )
      const sourceIdx = data.findIndex(k => k.id === result.source?.droppableId)
      const item = data[sourceIdx].list.find(
        (_: any, i: any) => i === result.source?.index,
      )
      const source = [...data[sourceIdx].list]
      source.splice(result.source?.index, 1)
      const dest = [...data[destIdx].list]
      dest.splice(result.destination?.index ?? 0, 0, item)
      const res = data.map(k => {
        if (k.id === result.destination?.droppableId) {
          return { ...k, list: dest }
        }
        if (k.id === result.source?.droppableId) {
          return { ...k, list: source }
        }
        return k
      })
      dispatch(setSprintTableData(res))
    }
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      {rightSprintList?.map((item: any) => {
        return (
          <XTable
            key={item.id}
            data={item}
            list={item?.stories?.map((i: any) => ({
              ...i,
              id: `${item.id}-${i.id}`,
            }))}
            columns={columns}
          />
        )
      })}
    </DragDropContext>
  )
}

export default DndKitTable
