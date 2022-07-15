import React, { useState } from 'react'
import { Select, Button } from 'antd'
import { css } from '@emotion/css'
const { Option } = Select
import IconFont from '@/components/IconFont'
import styled from '@emotion/styled'

const selectCss = css`
  margin-top: 48px;
  margin-bottom: 24px;
`
const textareaCss = css`
  display: flex;
  align-items: start;
`
const areaCss = css`
  box-sizing: border-box;
  padding: 5px 0 0 12px;
  /* color: rgba(187, 189, 191, 1); */
  resize: none;
  border: 1px solid rgba(235, 237, 240, 1);
  width: 240px;
  height: 132px;
  &::placeholder {
    color: rgba(187, 189, 191, 1);
  }
`
const Left = styled.div`
  width: 120px;
  height: 316px;
  box-sizing: border-box;
  padding-top: 32px;
  display: flex;
  flex-direction: column;

  align-items: center;
  border-right: 1px solid #ebedf0;
`
const Right = styled.div`
  box-sizing: border-box;
  padding-left: 24px;
  width: 354px;
  height: 316px;
`
const Contain = styled.div`
  position: relative;
  width: 475px;
  height: 316px;
  display: flex;
`
const StyledShape = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  padding: 1px 8px 1px 8px;
  width: 60px;
  height: 25px;
  background: rgba(255, 255, 255, 1);
  background-blend-mode: normal;
  border: 1px solid rgba(235, 237, 240, 1);
  border-radius: 6px;
  margin-bottom: 16px;
  text-align: center;
  &:hover {
    border: 1px solid rgba(40, 119, 255, 1);
    color: rgba(40, 119, 255, 1);
  }
`
const ButtonFooter = styled.div`
  height: 56px;
  display: flex;
  align-items: center;
  margin-top: 24px;
  flex-direction: row-reverse;
  box-sizing: border-box;
  padding-right: 24px;
`
const Close = styled.span`
  position: absolute;
  right: 24px;
  top: 6px;
`
const shape = [
  { id: 1, name: '规划中' },
  { id: 2, name: '实现中' },
  { id: 3, name: '已实现' },
  { id: 4, name: '已关闭' },
]
type ShapeProps = {
  record: Record<string, number | string>
  hide: () => void
}
export const ShapeContent = (props: ShapeProps) => {
  const { record, hide } = props

  const [text, setText] = useState('')
  const handleChange = (value: string) => {
    console.log(`selected ${value}`)
  }

  return (
    <Contain>
      <Left>
        {shape.map(item => (
          <div key={item.id}>
            <StyledShape
              style={{
                color: item.id === record.level ? 'rgba(40, 119, 255, 1)' : '',
                border:
                  item.id === record.level
                    ? ' 1px solid rgba(40, 119, 255, 1)'
                    : '',
              }}
            >
              {item.name}
            </StyledShape>
            {item.id === record.level}
          </div>
        ))}
      </Left>
      <Right>
        <div className={selectCss}>
          <span style={{ marginRight: '24px' }}> 处理人</span>
          <Select
            defaultValue="lucy"
            style={{ width: 240 }}
            onChange={handleChange}
          >
            <Option value="jack">Jack</Option>
            <Option value="lucy">Lucy</Option>
            <Option value="disabled" disabled>
              Disabled
            </Option>
            <Option value="Yiminghe">yiminghe</Option>
          </Select>
        </div>
        <div className={textareaCss}>
          <span style={{ marginRight: '38px' }}>评论</span>
          <textarea
            className={areaCss}
            placeholder="请输入评论处理意见"
          ></textarea>
        </div>
        <ButtonFooter>
          <Button style={{ marginLeft: '16px' }} type="primary">
            流转
          </Button>
          <Button onClick={() => hide()}>取消</Button>
        </ButtonFooter>
      </Right>
      <Close onClick={() => hide()}>
        <IconFont type="close" style={{ fontSize: 20 }} />
      </Close>
    </Contain>
  )
}
