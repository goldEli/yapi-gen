import { Badge } from 'antd'
import styled from '@emotion/styled'

const mapStatusColor = {
  read: '#D5D6D9',
  no: '#FF5C5E',
  have: '#6688FF',
}

const mapStatusText = {
  read: '已读',
  no: '未读',
  have: '已评',
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
  const { status } = props
  return (
    <ReadSateTagWrap>
      <Badge color={mapStatusColor[status]} />
      <span>{mapStatusText[status]}</span>
    </ReadSateTagWrap>
  )
}

export default ReadStatusTag
