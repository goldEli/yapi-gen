import useDeleteConfirmModal from '@/hooks/useDeleteConfirmModal'
import { useDispatch, useSelector } from '@store/index'
import { setSprintDetailDrawer } from '@store/sprint'
import { Drawer } from 'antd'

const SprintDetailDrawer = () => {
  const leftWidth = 640
  const dispatch = useDispatch()
  const { open, DeleteConfirmModal } = useDeleteConfirmModal()
  const { sprintDetailDrawer } = useSelector(store => store.sprint)

  // 关闭弹窗
  const onCancel = () => {
    dispatch(
      setSprintDetailDrawer({
        visible: false,
        params: {},
      }),
    )
  }
  return (
    <>
      <DeleteConfirmModal />
      <Drawer
        closable={false}
        placement="right"
        bodyStyle={{ padding: 0, position: 'relative' }}
        width={leftWidth}
        open={sprintDetailDrawer.visible}
        onClose={onCancel}
        destroyOnClose
        maskClosable={false}
        mask={false}
        getContainer={false}
        className="drawerRoot"
      ></Drawer>
    </>
  )
}

export default SprintDetailDrawer
