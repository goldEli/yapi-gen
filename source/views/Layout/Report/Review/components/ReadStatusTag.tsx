import { Badge } from 'antd'
import styled from '@emotion/styled'
import { useTranslation } from 'react-i18next'

const mapStatusColor: any = {
  read: '#D5D6D9',
  no: '#FF5C5E',
  have: '#6688FF',
}

const ReadSateTagWrap = styled.div`
  .label {
    margin-left: 7px;
    font-size: 14px;
    font-family: SiYuanRegular;
    font-weight: 400;
    color: #323233;
  }
`

type ReadStatusProps = {
  status: string
}

const ReadStatusTag = (props: ReadStatusProps) => {
  const [t] = useTranslation()
  const mapStatusText: any = {
    read: t('p2.haveRead'),
    no: t('p2.noRead'),
    have: t('report.list.haveComment'),
  }

  const { status } = props
  return (
    <ReadSateTagWrap>
      <Badge color={mapStatusColor[status]} />
      <span className="label">{mapStatusText[status]}</span>
    </ReadSateTagWrap>
  )
}

export default ReadStatusTag
