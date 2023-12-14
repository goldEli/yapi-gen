import { Button, Popover } from 'antd'
import { NoticeTitleWrap } from '../style'
import CommonIconFont from '@/components/CommonIconFont'
import { useSelector } from '@store/index'
const useNoticePopoverTitle = (setMsgVisible: any) => {
  const { msgStatics } = useSelector(store => store.mine)
  const { dynamics } = msgStatics ?? {}
  const { total } = dynamics ?? {}
  const close = () => {
    setMsgVisible(false)
  }
  const TitleBox = (
    <NoticeTitleWrap>
      <div>动态（{total}）</div>
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
