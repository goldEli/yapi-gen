import { Tooltip, type TableColumnProps } from 'antd'
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
import { setRightSprintList } from '@store/sprint'
import { useTranslation } from 'react-i18next'
import StateTag from '@/components/StateTag'
import { getParamsData } from '@/tools'
import { useSearchParams } from 'react-router-dom'
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

  const columns: TableColumnProps<any>[] = [
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
    {
      title: '编号',
      dataIndex: 'story_prefix_key',
      key: 'story_prefix_key',
      width: 200,
    },
    {
      title: '标题',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render(value, record) {
        return (
          <div>
            <Tooltip placement="top" title={record.category}>
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
            {value}
          </div>
        )
      },
    },
    { title: '长故事', dataIndex: 'long_story_name' },
    { title: '子事务', dataIndex: 'child_story_count' },
    {
      title: '经办人',
      dataIndex: 'handlers',
      key: 'handlers',
      width: 180,
      render: (text: any, record: any) => {
        return (
          <MultipleAvatar
            max={3}
            list={record.handlers?.map((i: any) => ({
              id: i.id,
              name: i.name,
              avatar: i.avatar,
            }))}
          />
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
            children={<div>11111</div>}
            onChangeStatus={function (value: any): void {
              throw new Error('Function not implemented.')
            }}
            record={record}
          />
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
      const source = [...destList.stories]

      const item = destList.stories.find(
        (_: any, i: any) => i === result.source?.index,
      )
      source.splice(result.source?.index, 1)
      source.splice(result.destination?.index ?? 0, 0, item)
      const res: any = data.map(k => {
        if (k.id === result.destination?.droppableId) {
          return { ...k, stories: source }
        }
        return k
      })
      dispatch(setRightSprintList(res))
    } else {
      // 不同表格拖动
      const data = [...rightSprintList]
      const destIdx = data.findIndex(
        k => k.id === result.destination?.droppableId,
      )
      const sourceIdx = data.findIndex(k => k.id === result.source?.droppableId)
      const item = data[sourceIdx].stories.find(
        (_: any, i: any) => i === result.source?.index,
      )
      const source = [...data[sourceIdx].stories]
      source.splice(result.source?.index, 1)
      const dest = [...data[destIdx].stories]
      dest.splice(result.destination?.index ?? 0, 0, item)
      const res = data.map(k => {
        if (k.id === result.destination?.droppableId) {
          return { ...k, stories: dest }
        }
        if (k.id === result.source?.droppableId) {
          return { ...k, stories: source }
        }
        return k
      })
      dispatch(setRightSprintList(res))
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
