import { useDispatch, useSelector } from '@store/index'
import { Drawer } from 'antd'
import { DragLine, MouseDom } from '../StyleCommon'
import { useState } from 'react'
import { setContrastDrawer } from '@store/employeeProfile'
import { BackIcon, Content, Header } from './style'
import CommonIconFont from '../CommonIconFont'

const EmployeeProfileContrast = () => {
  const dispatch = useDispatch()
  const { contrastDrawer, filterParams } = useSelector(
    store => store.employeeProfile,
  )
  const { visible, params } = contrastDrawer
  const [focus, setFocus] = useState(false)
  const leftWidth = 960

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
    dispatch(
      setContrastDrawer({
        visible: false,
        params: {},
      }),
    )
  }

  return (
    <Drawer
      closable={false}
      placement="right"
      bodyStyle={{ padding: 0, position: 'relative' }}
      width={leftWidth}
      open={visible}
      onClose={onCancel}
      destroyOnClose
      getContainer={false}
      className="drawerRoot"
    >
      <MouseDom active={focus} onMouseDown={onDragLine} style={{ left: 0 }}>
        <DragLine active={focus} className="line" style={{ marginLeft: 0 }} />
      </MouseDom>
      <Header>
        <BackIcon onClick={onCancel}>
          <CommonIconFont type="right-02" size={20} color="var(--neutral-n2)" />
        </BackIcon>
      </Header>
      <Content>1212</Content>
    </Drawer>
  )
}

export default EmployeeProfileContrast
