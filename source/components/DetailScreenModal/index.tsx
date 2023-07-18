// 详情弹层

import { useDispatch, useSelector } from '@store/index'
import CommonModal2 from '../CommonModal2'
import { setIsDetailScreenModal } from '@store/project'

const DetailScreenModal = () => {
  const dispatch = useDispatch()
  const { isDetailScreenModal } = useSelector(store => store.project)
  const { visible, params } = isDetailScreenModal

  //   关闭弹窗
  const onClose = () => {
    dispatch(setIsDetailScreenModal({ visible: false, params: {} }))
  }

  return (
    <CommonModal2
      noFooter
      bodyStyle={{
        height: '100vh',
        minWidth: '1400px',
      }}
      width="100vw"
      dex={50}
      isShowMask={false}
      isVisible={visible}
      onClose={onClose}
    >
      1
    </CommonModal2>
  )
}

export default DetailScreenModal
