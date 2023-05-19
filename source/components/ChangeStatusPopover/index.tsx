import { Popover } from 'antd'
import { ReactNode, useState } from 'react'
import StatusPopover from './StatusPopover'
import StatusModal from './StatusModal'

interface Props {
  isShow?: boolean
  children: ReactNode
  //   onChangeStatus(value: any): void
  record: any
  projectId?: any
  isCanOperation?: boolean
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
      infoId: 1003275,
      // ?? props.record.id
      dealName: '王灵娇;杨一',
      formContent: '测试-add',
      formIsStart: 1,
      formIsEnd: 2,
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
      />
      <Popover
        open={popoverVisible}
        onOpenChange={setPopoverVisible}
        placement="bottomLeft"
        trigger="click"
        destroyTooltipOnHide
        getPopupContainer={n => (props.isShow ? n : document.body)}
        //   overlayStyle={{ width: 683 }}
        // 设置宽度是用于弹窗自适应宽度后会左右摆动问题
        content={
          <StatusPopover
            onOpenModal={onOpenModal}
            popoverVisible={popoverVisible}
            projectId={27}
            id={1003275}
          />
        }
      >
        {props.children}
      </Popover>
    </>
  )
}

export default ChangeStatusPopover
