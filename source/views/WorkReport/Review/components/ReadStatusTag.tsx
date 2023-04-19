import { Badge } from 'antd'
import styled from '@emotion/styled'
import { useTranslation } from 'react-i18next'

const mapStatusColor = {
  read: '#D5D6D9',
  no: '#FF5C5E',
  have: '#6688FF',
}

const ReadSateTagWrap = styled.div`
  span {
    margin-left: 7px;
    font-size: 14px;
    font-family: MiSans-Regular, MiSans;
    font-weight: 400;
    color: #323233;
  }
`

type ReadStatusProps = {
  status: keyof typeof mapStatusColor
}

const ReadStatusTag = (props: ReadStatusProps) => {
  const [t] = useTranslation()
  const mapStatusText = {
    read: t('p2.noRead'),
    no: t('p2.haveRead'),
    have: t('report.list.haveComment'),
  }

  const { status } = props
  return (
    <ReadSateTagWrap>
      <Badge color={mapStatusColor[status]} />
      <span>{mapStatusText[status]}</span>
    </ReadSateTagWrap>
  )
}

export default ReadStatusTag
