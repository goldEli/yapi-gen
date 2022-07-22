/* eslint-disable @typescript-eslint/naming-convention */
import { Input, Button } from 'antd'
import styled from '@emotion/styled'
import posterImg from '@/assets/poster.png'
import IconFont from '@/components/IconFont'

const WrapRight = styled.div({
  width: '424px',
})

const Title = styled.div({
  fontSize: 14,
  fontWeight: 400,
  color: 'black',
})

const CommentItem = styled.div({
  display: 'flex',
  justifyContent: 'flex-start',
  marginTop: 24,
  '&: hover': {
    '.anticon': {
      display: 'block!important',
      cursor: 'pointer',
    },
  },
  img: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    marginRight: 12,
  },
})

const TextWrap = styled.div({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  '.textTop': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    '.name': {
      color: 'black',
      fontSize: 14,
      marginRight: 12,
    },
    '.anticon': {
      color: '#969799',
      fontSize: 16,
      position: 'absolute',
      right: 0,
      top: 3,
      display: 'none',
    },
  },
  '.common': {
    fontSize: 12,
    color: '#969799',
  },
  '.content': {
    color: '#646566',
    fontSize: 12,
    fontWeight: 400,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: 'flex',
    WebkitLineClamp: 4,
    WebkitBoxOrient: 'vertical',
    paddingRight: 30,
  },
})

const TextareaWrap = styled.div({
  marginTop: 67,
  height: 179,
  borderRadius: 6,
  border: '1px solid #EBEDF0',
  padding: 16,
  textAlign: 'right',
  '.ant-input': {
    border: 'none',
    padding: 0,
  },
  '.ant-input:focus,.ant-input:active': {
    border: 'none',
    boxShadow: 'none',
  },
})

const list = [
  { name: '黑飞', from: '从【规划中】添加', time: '2022-02-21', text: '内容' },
  {
    name: '黑飞',
    from: '从【规划中】添加',
    time: '2022-02-21',
    text: '内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容',
  },
]

const WrapRightBox = () => {
  return (
    <WrapRight>
      <Title>评论</Title>
      {list.map(item => (
        <CommentItem key={item.name}>
          <img src={posterImg} alt="" />
          <TextWrap>
            <div className="textTop">
              <IconFont type="close" />
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span className="name">{item.name}</span>
                <span className="common">{item.from}</span>
              </div>
              <div className="common" style={{ paddingRight: 30 }}>
                {item.time}
              </div>
            </div>
            <div className="content">{item.text}</div>
          </TextWrap>
        </CommentItem>
      ))}
      <TextareaWrap>
        <Input.TextArea
          placeholder="输入评论，按Enter快速发布"
          autoSize={{ minRows: 5, maxRows: 5 }}
        />
        <Button type="primary">回复</Button>
      </TextareaWrap>
    </WrapRight>
  )
}

export default WrapRightBox
