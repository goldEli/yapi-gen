import { Popover, Upload, Space } from 'antd'
import styled from '@emotion/styled'
import projectImg from '@/assets/projectImg.png'
import posterImg from '@/assets/poster.png'
import { IconFont } from '@staryuntech/ant-pro'

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
  cursor: 'pointer',
})

const ChooseTitle = styled.div({
  color: '#646566',
  fontSize: 12,
  fontWeight: 400,
  marginBottom: 8,
})

const PosterGroup = styled(Space)({
  display: 'flex',
  flexWrap: 'wrap',
  marginBottom: 8,
})
const AddUplaod = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: 28,
  borderRadius: 6,
  width: 60,
  boxSizing: 'border-box',
  border: '1px solid #EBEDF0',
  marginBottom: 8,
  cursor: 'pointer',
})

export default () => {
  const choosePoster = (
    <div style={{ width: 340 }}>
      <ChooseTitle>请选择一个封面</ChooseTitle>
      <PosterGroup size={8}>
        <img
          style={{ marginBottom: 8, cursor: 'pointer' }}
          src={posterImg}
          alt=""
        />
        <img
          style={{ marginBottom: 8, cursor: 'pointer' }}
          src={posterImg}
          alt=""
        />
        <img
          style={{ marginBottom: 8, cursor: 'pointer' }}
          src={posterImg}
          alt=""
        />
        <img
          style={{ marginBottom: 8, cursor: 'pointer' }}
          src={posterImg}
          alt=""
        />
        <img
          style={{ marginBottom: 8, cursor: 'pointer' }}
          src={posterImg}
          alt=""
        />
        <img
          style={{ marginBottom: 8, cursor: 'pointer' }}
          src={posterImg}
          alt=""
        />
      </PosterGroup>
      <ChooseTitle>自定义封面</ChooseTitle>
      <Upload>
        <AddUplaod>
          <IconFont style={{ color: '#969799' }} type="plus" />
        </AddUplaod>
      </Upload>
      <span style={{ fontSize: 12, fontWeight: 400, color: '#969799' }}>
        图片格式支持jpg、png，大小为220*104px
      </span>
    </div>
  )

  return (
    <div>
      <ImgWrap>
        <img src={projectImg} alt="" />
        <Popover
          placement="bottom"
          content={choosePoster}
          getPopupContainer={node => node}
        >
          <ChangeWrap>修改图片</ChangeWrap>
        </Popover>
      </ImgWrap>
    </div>
  )
}
