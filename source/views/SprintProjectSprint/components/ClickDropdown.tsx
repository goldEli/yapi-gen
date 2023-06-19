import { Popover } from 'antd'
import { ReactNode, useState } from 'react'
import { LatelyLongStoryMenu } from './LatelyLongStoryMenu'

interface Props {
  isShow?: boolean
  children: ReactNode
  setIsVisible(val: boolean): void
  setDeleteItem: any
  record: any
  longStoryList: any
}

const ClickDropdown = (props: Props) => {
  const [popoverVisible, setPopoverVisible] = useState(false)
  const { setIsVisible, setDeleteItem, record, longStoryList } = props
  return (
    <Popover
      visible={popoverVisible}
      onVisibleChange={setPopoverVisible}
      placement="bottomLeft"
      trigger="click"
      destroyTooltipOnHide
      getPopupContainer={n => (props.isShow ? n : document.body)}
      content={
        <LatelyLongStoryMenu
          setIsVisible={(item: any) => {
            setIsVisible(true)
            setDeleteItem({ ...item, isLong: true })
          }}
          longStoryList={longStoryList}
          record={record}
          setPopoverVisible={setPopoverVisible}
        />
      }
    >
      {props.children}
    </Popover>
  )
}
export default ClickDropdown
