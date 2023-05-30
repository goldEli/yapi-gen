import { getShapeLeft } from '@/services/demand'
import { useEffect, useState } from 'react'
import { Item, Items, PopoverStatusWrap } from '../style'

interface StatusListItem {
  id: number
  is_end: number
  is_start: number
  statusId: number
  content: string
}

interface Props {
  onOpenModal(item: any): void
  popoverVisible: boolean
  projectId: number
  //   需求、事务、缺陷id
  id: number
}

const StatusPopover = (props: Props) => {
  const [statusList, setStatusList] = useState<StatusListItem[]>([])

  const onOpenModal = (i: any) => {
    props.onOpenModal(i)
  }

  //   获取状态列表
  const getStatusList = async () => {
    const res2 = await getShapeLeft({
      id: props.projectId,
      nId: props.id,
    })
    setStatusList(
      res2.map((i: any) => ({
        id: i.id,
        is_end: i.is_end,
        is_start: i.is_start,
        content: i.status.content,
        projectId: i.project_id,
        canChange: i.can_changes_category_status,
        statusName: i.story_status_config.name || '--',
      })),
    )
  }

  useEffect(() => {
    if (props.popoverVisible) {
      getStatusList()
    }
  }, [props.popoverVisible])

  return (
    <Items>
      {statusList.map((i: any) => (
        <Item key={i.id} onClick={() => onOpenModal(i)}>
          <div className="name">{i.statusName}</div>
          <div className="provider">
            <div />
            <span />
          </div>
          <PopoverStatusWrap
            state={
              i?.is_start === 1 && i?.is_end === 2
                ? 1
                : i?.is_end === 1 && i?.is_start === 2
                ? 2
                : i?.is_start === 2 && i?.is_end === 2
                ? 3
                : 0
            }
          >
            {i.content}
          </PopoverStatusWrap>
        </Item>
      ))}
    </Items>
  )
}

export default StatusPopover
