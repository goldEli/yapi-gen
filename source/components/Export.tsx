import CommonIconFont from '@/components/CommonIconFont'
import CommonModal from '@/components/CommonModal'
import { useState } from 'react'
import WacthExportPerson from './WacthExportPerson'
import { useTranslation } from 'react-i18next'
import styled from '@emotion/styled'
const MsgText = styled.div`
  padding: 0 16px;
  margin: 0 24px;
  // width: 384px;
  height: 40px;
  border-radius: 6px;
  background: rgba(250, 151, 70, 0.1);
  font-size: 14px;
  color: var(--function-warning);
  display: flex;
  align-items: center;
  .text {
    margin-left: 8px;
  }
  .msg {
    color: var(--neutral-n2);
    font-size: 12px;
  }
`

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 24px;
  margin-top: 29px;
  color: var(--neutral-n2);
`
const TextColor = styled.span`
  color: var(--neutral-n1-d1);
  font-size: 14px;
`
const Text = styled.span`
  font-size: 14px;
  color: var(--auxiliary-text-t2-d2);
  .text {
    margin-right: 8px;
  }
  &:hover {
    cursor: pointer;
  }
`
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
