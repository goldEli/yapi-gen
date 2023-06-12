import CommonIconFont from '@/components/CommonIconFont'
import CommonModal from '@/components/CommonModal'
import { useState } from 'react'
import { MsgText, Row, Text, TextColor } from '../Style'
import WacthExportPerson from './WacthExportPerson'

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
          <span className="text">
            将按照筛选结果导出Excel，如需其他结果请重新筛选
          </span>
        </MsgText>
        <Row>
          <span>导出周期</span>
          <TextColor>{props.time}</TextColor>
        </Row>
        {props.personData?.length >= 1 && (
          <Row>
            {props.personData?.length ? (
              <span>已选 ({props.personData?.length}人)</span>
            ) : (
              <span>已选</span>
            )}
            <Text
              onClick={() => {
                props.onClose(), setIsOpen(true)
              }}
            >
              查看成员{' '}
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
        title="查看成员"
        isVisible={isOpen}
        onConfirm={() => setIsOpen(false)}
        onClose={() => setIsOpen(false)}
      />
    </>
  )
}
export default Export
