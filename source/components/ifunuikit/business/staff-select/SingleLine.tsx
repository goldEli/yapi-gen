// div 样式
import styled from '@emotion/styled'

const SingleLine = styled.div<{ width: number }>(
  {
    whiteSpace: 'nowrap',
    wordBreak: 'break-all',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontSize: '14px',
    fontWeight: 400,
    color: '#646566',
  },
  ({ width }) => ({
    maxWidth: width,
  }),
)

export default SingleLine
