import CommonIconFont from '@/components/CommonIconFont'
import CommonModal from '@/components/CommonModal'
import { useState } from 'react'
import { MsgText, Row, Text, TextColor } from '../Style'
import WacthExportPerson from './WacthExportPerson'
import { useTranslation } from 'react-i18next'
interface PropsType {
  title: string
  isVisible: boolean
  onConfirm: () => void
  onClose: () => void
  time: string
  personData: any
}

const Export = (props: PropsType) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [t] = useTranslation()
  console.log(props.personData, 'props.personData')
  return (
    <>
      <CommonModal
        isVisible={props.isVisible}
        title={props.title}
        onClose={() => props.onClose()}
        onConfirm={() => props.onConfirm()}
      >
        <MsgText>
          <CommonIconFont
            type={'Warning'}
            size={16}
            color="var(--function-warning)"
          />
          <span className="text">{t('performance.exportMsg')}</span>
        </MsgText>
        <Row>
          <span> {t('performance.exportMsg1')}</span>
          <TextColor>{props.time}</TextColor>
        </Row>
        {props.personData?.length >= 1 && (
          <Row>
            {props.personData?.length ? (
              <span>
                {t('performance.select')} ({props.personData?.length}人)
              </span>
            ) : (
              <span>{t('performance.select')}</span>
            )}
            <Text
              onClick={() => {
                props.onClose(), setIsOpen(true)
              }}
            >
              {t('performance.watchMenber')}
              <CommonIconFont
                type={'right'}
                size={16}
                color="var(--auxiliary-text-t2-d2)"
              />
            </Text>
          </Row>
        )}
      </CommonModal>
      <WacthExportPerson
        personData={props.personData}
        title={t('performance.watchMenber')}
        isVisible={isOpen}
        onConfirm={() => setIsOpen(false)}
        onClose={() => setIsOpen(false)}
      />
    </>
  )
}
export default Export
