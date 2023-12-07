// 详情弹层

import { useDispatch, useSelector } from '@store/index'
import { setIsDetailScreenModal } from '@store/project'
import { Content, ModalWrap, ModelClose } from './style'
import DemandDetail from './DemandDetail'
import FlawDetail from './FlawDetail'
import AffairsDetail from './AffairsDetail'
import { useSearchParams } from 'react-router-dom'
import { getParamsData } from '@/tools'
import { useEffect } from 'react'
import CommonIconFont from '../CommonIconFont'
import { saveScreenDetailModal } from '@store/project/project.thunk'
import useOpenDemandDetail from '@/hooks/useOpenDemandDetail'

const DetailScreenModal = () => {
  const dispatch = useDispatch()
  // 不能删除open方法
  const [openDemandDetail, closeScreenModal] = useOpenDemandDetail()
  const { userPreferenceConfig } = useSelector(store => store.user)
  const { isDetailScreenModal, projectInfo } = useSelector(
    store => store.project,
  )
  const { visible, params } = isDetailScreenModal
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const { fullScreen } = useSelector(store => store.kanBan)
  const { layoutSideCollapse } = useSelector(store => store.global)

  const detailContent = [
    { specialType: 1, content: <AffairsDetail /> },
    { specialType: 2, content: <FlawDetail /> },
    { specialType: 3, content: <DemandDetail /> },
  ]

  // 关闭弹窗
  const onClose = () => {
    dispatch(saveScreenDetailModal({ visible: false, params: {} }))
    closeScreenModal()
  }

  useEffect(() => {
    // 如果地址栏上带有isOpenScreenDetail此参数，并且传入id与项目id一致，并且个人偏好数据有的情况下
    if (
      paramsData?.isOpenScreenDetail &&
      (projectInfo?.id || paramsData?.id) &&
      userPreferenceConfig?.previewModel
    ) {
      const resultParams: any = {
        id: projectInfo?.id || paramsData?.id,
        specialType: paramsData?.specialType,
        type: paramsData?.specialType,
      }
      switch (paramsData?.specialType) {
        case 1:
          resultParams.sprintId = paramsData?.detailId
          break
        case 2:
          resultParams.flawId = paramsData?.detailId
          break
        default:
          resultParams.demandId = paramsData?.detailId
          break
      }
      dispatch(
        setIsDetailScreenModal({
          visible: true,
          params: resultParams,
        }),
      )
    }
  }, [paramsData?.isOpenScreenDetail, projectInfo, userPreferenceConfig])

  return (
    <ModalWrap
      layoutSideCollapse={layoutSideCollapse}
      all={
        userPreferenceConfig.previewModel === 3 ||
        (params?.employeeCurrentId || 0) > 0
      }
      footer={false}
      open={visible}
      closable={false}
      title={false}
      maskClosable={
        userPreferenceConfig.previewModel === 3 || params?.employeeCurrentId
          ? true
          : false
      }
      destroyOnClose
      keyboard={false}
      wrapClassName="vertical-center-modal"
      focusTriggerAfterClose={false}
      mask={
        userPreferenceConfig.previewModel === 3 ||
        (params?.employeeCurrentId || 0) > 0
      }
      bodyStyle={{
        height: fullScreen
          ? '100vh'
          : userPreferenceConfig.previewModel === 3 ||
            (params?.employeeCurrentId || 0) > 0
          ? '80vh'
          : 'calc(100vh - 56px)',
        marginTop: fullScreen ? 0 : 56,
      }}
      width={
        fullScreen
          ? '100vw'
          : layoutSideCollapse
          ? 'calc(100vw - 200px)'
          : 'calc(100vw - 80px)'
      }
      zIndex={
        userPreferenceConfig.previewModel === 3 ||
        (params?.employeeCurrentId || 0) > 0
          ? 1000
          : 50
      }
      // 界面全屏时需要挂载到全屏的那个dom元素身上才能显示出来
      getContainer={
        fullScreen
          ? () => document.querySelector('.kanBanFullScreenBox') as any
          : // eslint-disable-next-line no-undefined
            undefined
      }
    >
      <ModelClose onClick={onClose}>
        <CommonIconFont
          type="close-solid2"
          size={40}
          color="var(--neutral-white-d1)"
        />
      </ModelClose>
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
