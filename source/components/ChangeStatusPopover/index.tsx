import { Popover } from 'antd'
import { ReactNode, useState } from 'react'
import StatusPopover from './StatusPopover'
import StatusModal from './StatusModal'

interface Props {
  isShow?: boolean
  children: ReactNode
  onChangeStatus(value: any): void
  record: any
  projectId?: number
  isCanOperation?: boolean
  // 1-需求，2-事务，3-缺陷
  type?: 1 | 2 | 3
}

const ChangeStatusPopover = (props: Props) => {
  const [popoverVisible, setPopoverVisible] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [checkStatusItem, setCheckStatusItem] = useState<any>({})

  // 打开状态流转弹窗
  const onOpenModal = (item: any) => {
    setIsVisible(true)
    setPopoverVisible(false)
    setCheckStatusItem({
      ...item,
      infoId: props.record.id,
      dealName: props.record?.userName,
      fromContent: props.record?.status?.status?.content,
      fromIsStart: props.record?.status?.is_start,
      fromIsEnd: props.record?.status?.is_end,
      fromId: props.record?.status?.id,
      statusName: item.statusName,
    })
  }

  const onClosModal = () => {
    setIsVisible(false)
    setCheckStatusItem({})
  }

  return (
    <>
      <StatusModal
        isVisible={isVisible}
        checkStatusItem={checkStatusItem}
        onClose={onClosModal}
        record={props.record}
        onChangeStatusConfirm={props.onChangeStatus}
        type={props.type}
      />

      <Popover
        open={popoverVisible}
        onOpenChange={setPopoverVisible}
        placement="bottomLeft"
        trigger="click"
        destroyTooltipOnHide
        getPopupContainer={n => (props.isShow ? n : document.body)}
        // 设置宽度是用于弹窗自适应宽度后会左右摆动问题
        content={
          props.isCanOperation && (
            <StatusPopover
              onOpenModal={onOpenModal}
              popoverVisible={popoverVisible}
              projectId={props.record.project_id ?? props.record.projectId}
              id={props.record.id}
              type={props.type}
            />
          )
        }
      >
        {props.children}
      </Popover>
    </>
  )
}

export default ChangeStatusPopover
