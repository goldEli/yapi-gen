import CommonModal from '@/components/CommonModal'
import { DeleteConfirmProps } from '@/components/DeleteConfirm'
import IconFont from '@/components/IconFont'
import { getSprintDetail } from '@/services/sprint'
import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

type ModalProps = Omit<
  DeleteConfirmProps,
  'onConfirm' | 'onChangeVisible' | 'isVisible'
> & {
  onConfirm(): Promise<any>
}

const useShowTargetModal = () => {
  const [visible, setVisible] = useState(false)
  const [modalProps, setModalProps] = useState()
  const [info, setInfo] = useState<any>()
  const onConfirm = useRef<ModalProps['onConfirm'] | null>(null)
  const [t]: any = useTranslation()
  const getSprintInfo = async (project_id: any, id: any) => {
    try {
      const result: any = await getSprintDetail({
        project_id,
        id,
      })
      console.log(result)
      setInfo(result.data)
    } catch (error) {
      //
    }
  }

  const openTargetModal = async (options: any) => {
    setModalProps(options.title)
    await getSprintInfo(options.projectId, options.editId)
    setVisible(true)
    onConfirm.current = options.onConfirm
  }

  const TargetModal = () => (
    <CommonModal
      title={modalProps}
      onClose={() => setVisible(false)}
      isVisible={visible}
      noCancel
      onConfirm={async () => {
        await onConfirm?.current?.()
        setVisible(false)
      }}
    >
      <div style={{ padding: '0 4px 0 24px', height: '60vh' }}>
        <div
          style={{ padding: '0 20px 0 0', height: '100%', overflow: 'auto' }}
        >
          <div
            style={{
              minHeight: '22px',
              fontSize: '14px',
              marginBottom: 8,
              color: '#646566',
              lineHeight: '22px',
            }}
          >
            {t('sprintName')}
          </div>
          <div
            style={{
              height: '22px',
              fontSize: '14px',
              fontFamily: 'SiYuanMedium',
              color: '#323233',
              lineHeight: '22px',
            }}
          >
            {info?.name}
          </div>

          <div
            style={{
              display: 'flex',
              margin: '24px 0',
              alignItems: 'center',
              gap: 24,
            }}
          >
            <div
              style={{
                width: '140px',
                height: '64px',
                background: '#F5F5F7',
                display: 'flex',
                flexDirection: 'column',
                padding: '8px 12px',
                justifyContent: 'space-between',
              }}
            >
              <span>{t('startingTime')}</span>
              <span
                style={{
                  fontFamily: 'SiYuanMedium',
                }}
              >
                {info?.start_at}
              </span>
            </div>
            <IconFont
              style={{ fontSize: 24, color: '#969799' }}
              type="swap-right"
            />
            <div
              style={{
                width: '140px',
                height: '64px',
                background: '#F5F5F7',
                display: 'flex',
                flexDirection: 'column',
                padding: '8px 12px',
                justifyContent: 'space-between',
              }}
            >
              <span>{t('endTime')}</span>
              <span
                style={{
                  fontFamily: 'SiYuanMedium',
                }}
              >
                {info?.end_at}
              </span>
            </div>
          </div>

          <div
            style={{
              height: '22px',
              fontSize: '14px',
              marginBottom: 8,
              color: '#646566',
              lineHeight: '22px',
            }}
          >
            {t('sprintGoal')}
          </div>
          <div
            style={{
              fontSize: '14px',
              fontFamily: 'SiYuanMedium',
              color: '#323233',
              lineHeight: ' 22px',
              whiteSpace: 'break-spaces',
            }}
          >
            {info?.info ? info?.info : '--'}
          </div>
        </div>
      </div>
    </CommonModal>
  )

  return {
    openTargetModal,
    TargetModal,
  }
}
export default useShowTargetModal
