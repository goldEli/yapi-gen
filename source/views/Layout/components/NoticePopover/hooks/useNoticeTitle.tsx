import { Button, Popover } from 'antd'
import { NoticeTitleWrap } from '../style'
import CommonIconFont from '@/components/CommonIconFont'
import { useSelector } from '@store/index'
const useNoticePopoverTitle = (setMsgVisible: any, popoverRef: any) => {
  const { msgStatics } = useSelector(store => store.mine)
  const { dynamics, allnews } = msgStatics ?? {}
  const { total } = dynamics ?? {}
  const close = () => {
    popoverRef.current.props.onPopupVisibleChange(false)
    setMsgVisible(false)
  }
  const TitleBox = (
    <NoticeTitleWrap>
      <div>动态（{allnews}）</div>
      <CommonIconFont
        type="close"
        color="var(--neutral-n2)"
        onClick={close}
      ></CommonIconFont>
    </NoticeTitleWrap>
  )
  return {
    TitleBox,
    close,
  }
}
export default useNoticePopoverTitle
