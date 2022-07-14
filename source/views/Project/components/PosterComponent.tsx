import { Popover } from 'antd'
import styled from '@emotion/styled'
import projectImg from '@/assets/projectImg.png'
import posterImg from '@/assets/poster.png'
import IconFont from '@/components/IconFont'

const ImgWrap = styled.div({
  position: 'relative',
  borderRadius: 6,
  height: 176,
  overflow: 'hidden',
  img: {
    height: '100%',
    width: '100%',
  },
})

const ChangeWrap = styled.div({
  position: 'absolute',
  bottom: 0,
  width: '100%',
  height: 32,
  background: 'rgba(50, 50, 51, 0.4)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  fontSize: 14,
  fontWeight: 400,
})

const ChooseTitle = styled.div({
  color: '#646566',
  fontSize: 12,
  fontWeight: 400,
  marginBottom: 8,
})

const PosterGroup = styled.div({
  display: 'flex',
  flexWrap: 'wrap',
  marginBottom: 16,
})

export default () => {
  const choosePoster = (
    <div style={{ padding: 16 }}>
      <ChooseTitle>请选择一个封面</ChooseTitle>
      <PosterGroup>{}</PosterGroup>
    </div>
  )

  return (
    <div>
      <IconFont type="project" />
      <ImgWrap>
        <img src={projectImg} alt="" />
        <Popover placement="bottom" content={choosePoster}>
          <ChangeWrap>修改图片</ChangeWrap>
        </Popover>
      </ImgWrap>
    </div>
  )
}
