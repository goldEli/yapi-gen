// 详情弹层

import { useDispatch, useSelector } from '@store/index'
import { setIsDetailScreenModal } from '@store/project'
import { Content, ModalWrap } from './style'
import DemandDetail from './DemandDetail'
import FlawDetail from './FlawDetail'
import AffairsDetail from './AffairsDetail'
import { useSearchParams } from 'react-router-dom'
import { getParamsData } from '@/tools'
import { useEffect } from 'react'

const DetailScreenModal = () => {
  const dispatch = useDispatch()
  const { isDetailScreenModal } = useSelector(store => store.project)
  const { visible, params } = isDetailScreenModal
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const { fullScreen } = useSelector(store => store.kanBan)
  // const { isOpenScreenDetail, id, specialType, type, detailId } = paramsData

  const detailContent = [
    { specialType: 1, content: <AffairsDetail /> },
    { specialType: 2, content: <FlawDetail /> },
    { specialType: 3, content: <DemandDetail /> },
  ]

  useEffect(() => {
    // 如果地址栏上带有此参数，默认打开全屏弹层
    if (paramsData?.isOpenScreenDetail) {
      const resultParams: any = {
        id: paramsData?.id,
        specialType: paramsData?.specialType,
        type: paramsData?.type,
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
  }, [paramsData?.isOpenScreenDetail])

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
        height: fullScreen ? '100vh' : 'calc(100vh - 56px)',
        minWidth: '1400px',
        marginTop: fullScreen ? 0 : 56,
      }}
      width="100vw"
      zIndex={50}
      // 界面全屏时需要挂载到全屏的那个dom元素身上才能显示出来
      getContainer={
        fullScreen
          ? () => document.querySelector('.kanBanFullScreenBox') as any
          : // eslint-disable-next-line no-undefined
            undefined
      }
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
