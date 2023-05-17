import StateTag from '@/components/StateTag'
import { getShapeLeft } from '@/services/demand'
import styled from '@emotion/styled'
import { useEffect, useState } from 'react'

const Items = styled.div`
  padding: 4px 0;
  border-radius: 6px;
  background: var(--neutral-white-d5);
  width: max-content;
`

const Item = styled.div`
  height: 40px;
  padding: 0 16px;
  width: 100%;
  cursor: pointer;
  display: flex;
  align-items: center;
  .name {
    font-size: 14px;
    color: var(--neutral-n2);
  }
  .provider {
    display: flex;
    align-items: center;
    margin: 0 12px;
    position: relative;
    div {
      height: 0px;
      border-bottom: 1px dashed var(--neutral-n5);
      width: 32px;
    }
    span {
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--neutral-n5);
    }
  }
  &:hover {
    background: var(--hover-d3);
  }
`

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
        statusId: i.status_id,
        content: i.status.content,
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
          <div className="name">流转名称</div>
          <div className="provider">
            <div />
            <span />
          </div>
          <StateTag
            name={i.content}
            state={
              i?.is_start === 1 && i?.is_end === 2
                ? 1
                : i?.is_end === 1 && i?.is_start === 2
                ? 2
                : i?.is_start === 2 && i?.is_end === 2
                ? 3
                : 0
            }
          />
        </Item>
      ))}
    </Items>
  )
}

export default StatusPopover
