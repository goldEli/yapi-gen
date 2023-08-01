/* eslint-disable react/jsx-no-leaked-render */
import { useTranslation } from 'react-i18next'
import IconFont from '../IconFont'
import { ExamineWrap, TopWrap } from './style'
import useDeleteConfirmModal from '@/hooks/useDeleteConfirmModal'
import VerifyProcess from '../VerifyProcess'
import { Space } from 'antd'

interface StatusExamineProps {
  onCancel(): void
  //   1是需求，2是事务，3是缺陷
  type: number
  //   是否包含审核流程
  verifyInfo?: any
  // 是否有权限取消审核
  isVerify?: boolean
  onCheck?(): void
  // 是否是浮层
  isDrawer?: boolean
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
          <Space size={16}>
            {!props.isDrawer && (
              <div className="cancel" onClick={props.onCheck}>
                {t('circulationRecords')}
              </div>
            )}
            {props.isVerify && (
              <div className="cancel" onClick={onClose}>
                {t('newlyAdd.cancelExamine')}
              </div>
            )}
          </Space>
        </TopWrap>
        {props.verifyInfo && (
          <div style={{ marginTop: 24 }}>
            <VerifyProcess info={props.verifyInfo} />
          </div>
        )}
      </ExamineWrap>
    </>
  )
}

export default StatusExamine
