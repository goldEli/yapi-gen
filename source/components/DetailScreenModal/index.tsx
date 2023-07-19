// 详情弹层

import { useDispatch, useSelector } from '@store/index'
import { setIsDetailScreenModal } from '@store/project'
import { Content, ModalWrap } from './style'
import DemandDetail from './DemandDetail'
import FlawDetail from './FlawDetail'
import AffairsDetail from './AffairsDetail'

const DetailScreenModal = () => {
  const dispatch = useDispatch()
  const { isDetailScreenModal } = useSelector(store => store.project)
  const { visible, params } = isDetailScreenModal

  const detailContent = [
    { specialType: 1, content: <AffairsDetail /> },
    { specialType: 2, content: <FlawDetail /> },
    { specialType: 3, content: <DemandDetail /> },
  ]

  //   关闭弹窗
  const onClose = () => {
    dispatch(setIsDetailScreenModal({ visible: false, params: {} }))
  }
  console.log(params, '=paramsparamsparamsparams')

  return (
    <ModalWrap
      footer={false}
      open={visible}
      closable={false}
      title={false}
      maskClosable={false}
      destroyOnClose
      keyboard={false}
      wrapClassName="vertical-center-modal"
      focusTriggerAfterClose={false}
      mask={false}
      bodyStyle={{
        height: 'calc(100vh - 56px)',
        minWidth: '1400px',
        marginTop: 56,
      }}
      width="100vw"
      onCancel={onClose}
      zIndex={50}
    >
      {/* 渲染相应的模块 */}
      <Content>
        {
          detailContent?.filter(
            (i: any) => i.specialType === params.specialType,
          )[0]?.content
        }
      </Content>
    </ModalWrap>
  )
}

export default DetailScreenModal
