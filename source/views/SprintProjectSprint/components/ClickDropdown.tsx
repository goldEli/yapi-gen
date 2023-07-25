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
  clearLongStory(val: number): void
  activeKey: number
}

const ClickDropdown = (props: Props) => {
  const [popoverVisible, setPopoverVisible] = useState(false)
  const { setIsVisible, setDeleteItem, record, longStoryList, clearLongStory } =
    props
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
          activeKey={props?.activeKey}
          setIsVisible={(item: any) => {
            setIsVisible(true)
            setDeleteItem({ ...item, isLong: true })
          }}
          longStoryList={longStoryList}
          record={record}
          setPopoverVisible={setPopoverVisible}
          clearLongStory={clearLongStory}
        />
      }
    >
      {props.children}
    </Popover>
  )
}
export default ClickDropdown
