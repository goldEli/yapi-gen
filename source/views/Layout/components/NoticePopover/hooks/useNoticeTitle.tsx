import { Button, Popover } from 'antd'
import { NoticeTitleWrap } from '../style'
import CommonIconFont from '@/components/CommonIconFont'
import { useSelector } from '@store/index'
import { CloseWrap } from '@/components/StyleCommon'
import IconFont from '@/components/IconFont'
import { useTranslation } from 'react-i18next'
const useNoticePopoverTitle = (setMsgVisible: any, popoverRef: any) => {
  const { msgStatics } = useSelector(store => store.mine)
  const { dynamics, allnews } = msgStatics ?? {}
  const { total } = dynamics ?? {}
  const [t] = useTranslation()
  const close = () => {
    popoverRef.current.props.onPopupVisibleChange(false)
    setMsgVisible(false)
  }
  const TitleBox = (
    <NoticeTitleWrap>
      {allnews ? (
        <div>
          {t('dynamic')}（{allnews}）
        </div>
      ) : (
        <div>{t('dynamic')}</div>
      )}
      <CloseWrap
        color="var(--neutral-n2)"
        onClick={close}
        width={32}
        height={32}
      >
        <IconFont
          style={{ fontSize: 20, color: 'var(--neutral-n2)' }}
          type="close"
        />
      </CloseWrap>
    </NoticeTitleWrap>
  )
  return {
    TitleBox,
    close,
  }
}
export default useNoticePopoverTitle
