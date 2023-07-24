import { useTranslation } from 'react-i18next'
import IconFont from '../IconFont'
import { ExamineWrap, TopWrap } from './style'
import useDeleteConfirmModal from '@/hooks/useDeleteConfirmModal'

interface StatusExamineProps {
  onCancel(): void
  //   1是需求，2是事务，3是缺陷
  type: number
  //   审核过程
  verifyInfo?: any
  isVerify?: boolean
}

const StatusExamine = (props: StatusExamineProps) => {
  const [t] = useTranslation()
  const { open, DeleteConfirmModal } = useDeleteConfirmModal()
  const list = [
    {
      type: 1,
      text: t('other.areYouCancelDemand'),
      sub: t('other.cancelTextDemand'),
    },
    {
      type: 2,
      text: t('other.areYouCancelAffairs'),
      sub: t('other.cancelTextAffairs'),
    },
    {
      type: 3,
      text: t('other.areYouCancelFlaw'),
      sub: t('other.cancelTextFlaw'),
    },
  ]

  //   点击取消审核
  const onClose = () => {
    open({
      title: t('newlyAdd.cancelExamine'),
      text: list.filter((i: any) => i.type === props.type)[0]?.text,
      onConfirm: () => {
        props.onCancel()
        return Promise.resolve()
      },
    })
  }
  return (
    <>
      <DeleteConfirmModal />
      <ExamineWrap>
        <TopWrap>
          <div className="text">
            <IconFont className="icon" type="Warning" />
            <div className="sub">
              {list.filter((i: any) => i.type === props.type)[0]?.sub}
            </div>
          </div>
          {props.isVerify && (
            <div className="cancel" onClick={onClose}>
              {t('newlyAdd.cancelExamine')}
            </div>
          )}
        </TopWrap>
      </ExamineWrap>
    </>
  )
}

export default StatusExamine
