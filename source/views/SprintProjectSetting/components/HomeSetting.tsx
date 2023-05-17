import React, { useState } from 'react'
import styled from '@emotion/styled'
import { css } from '@emotion/react'
import type { RadioChangeEvent } from 'antd'
import { Radio } from 'antd'
const Wrap = styled.div`
  padding-left: 24px;
`
const Title = styled.div`
  color: var(--neutral-n1-d1);
  font-size: var(--font14);
`
const SubTitle = styled.div`
  color: var(--neutral-n3);
  font-size: var(--font12);
  margin-top: 4px;
`
const RadioWrap = styled.div`
  margin-top: 16px;
  .ant-radio-wrapper {
    color: var(--neutral-n1-d1) !important;
    font-size: var(--font14) !important;
  }
`
interface IProps {}
const HomeSetting: React.FC<IProps> = props => {
  const [value, setValue] = useState('1')
  return (
    <Wrap>
      <Title>项目首页配置</Title>
      <SubTitle>定义项目默认首页位置</SubTitle>
      <RadioWrap>
        <Radio.Group
          onChange={e => {
            setValue(e.target.value)
          }}
          value={value}
        >
          <Radio value={1}>事务列表</Radio>
          <Radio value={2}>冲刺</Radio>
          <Radio value={3}>Kanban</Radio>
          <Radio value={4}>报表</Radio>
        </Radio.Group>
      </RadioWrap>
    </Wrap>
  )
}
export default HomeSetting
