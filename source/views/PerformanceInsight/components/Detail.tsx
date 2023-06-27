/* eslint-disable react/jsx-handler-names */
import { DragLine, MouseDom } from '@/components/StyleCommon'
import { Drawer } from 'antd'
import { useState } from 'react'
interface Props {
  visible: boolean
  children: any
}
const Detail = (props: Props) => {
  const leftWidth = 640
  const [focus, setFocus] = useState(false)
  // 拖动线条
  const onDragLine = (e: React.MouseEvent) => {
    const drawer: HTMLElement = document.querySelector(
      '.drawerRoot .ant-drawer-content-wrapper',
    )!
    const drawerBody: HTMLElement = document.querySelector(
      '.drawerRoot .ant-drawer-body',
    )!
    const moveHandler = (ev: React.MouseEvent) => {
      setFocus(true)
      drawerBody.style.minWidth = '100%'
      drawerBody.style.right = '0px'
      const nextWidth = innerWidth - ev.clientX
      if (nextWidth <= leftWidth) return
      drawer!.style.width = innerWidth - ev.clientX + 'px'
    }
    drawer.style.transition = '0s'
    // const debounceWrap: any = throttle(moveHandler, 60, {})
    const debounceWrap: any = moveHandler
    document.addEventListener('mousemove', debounceWrap)
    document.addEventListener('mouseup', () => {
      drawer.style.transition = 'all 0.3s'
      setFocus(false)
      document.removeEventListener('mousemove', debounceWrap)
    })
  }
  // 关闭弹窗
  const onCancel = () => {
    // console.log(999)
    setFocus(false)
    // dispatch(saveViewReportDetailDrawer({ visible: false, id: 0, ids: [] }))
  }
  return (
    <div onClick={event => event.stopPropagation()}>
      <Drawer
        closable={false}
        placement="right"
        bodyStyle={{ padding: 0, position: 'relative' }}
        width={leftWidth}
        open={props.visible}
        onClose={onCancel}
        destroyOnClose
        maskClosable={false}
        mask={false}
        getContainer={false}
        className="drawerRoot"
      >
        <MouseDom active={focus} onMouseDown={onDragLine} style={{ left: 0 }}>
          <DragLine active={focus} className="line" style={{ marginLeft: 0 }} />
        </MouseDom>
        {props.children}
      </Drawer>
    </div>
  )
}
export default Detail
