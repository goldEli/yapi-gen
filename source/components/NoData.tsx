import styled from '@emotion/styled'
import empty from '@/assets/empty.svg'

const Wrap = styled.div({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'white',
  height: '100%',
  width: '100%',
  borderRadius: 4,
  img: {
    width: 240,
    marginBottom: 35,
  },
  div: {
    color: '#323233',
    fontSize: 18,
  },
})

const NoData = () => {
  return (
    <Wrap>
      <img src={empty} alt="" />
      <div>暂无数据</div>
    </Wrap>
  )
}

export default NoData
