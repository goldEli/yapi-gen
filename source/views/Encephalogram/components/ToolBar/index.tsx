import React from 'react'
import { ToolBarBox, RightWrap } from '@/views/Encephalogram/styles'
import Tabs from '@/components/Tabs'
import { Space } from 'antd'
import IconFont from '@/components/IconFont'

const ToolBar = () => {
  const onChange = id => {
    console.log(id)
  }
  return (
    <ToolBarBox>
      <RightWrap type="1">
        <Tabs
          tabsValue={[
            {
              text: '按人员',
              id: 0,
            },
            {
              text: '按任务',
              id: 1,
            },
          ]}
          active={0}
          onChange={onChange}
        />
      </RightWrap>
      <RightWrap type="2">
        <Space size={16}>
          <IconFont
            type="fewer-screen"
            style={{
              fontSize: 24,
              color: 'var(--neutral-n2)',
            }}
          />
          <IconFont
            type="sync"
            style={{
              fontSize: 24,
              color: 'var(--neutral-n2)',
              margin: '0 4px',
            }}
          />
          <span className="line" />
        </Space>
        <Space size={16}>
          <IconFont
            type="zoomin"
            style={{
              fontSize: 24,
              color: 'var(--neutral-n2)',
              margin: '0 4px',
            }}
          />
          <span>100%</span>
          <IconFont
            type="close"
            style={{
              fontSize: 24,
              color: 'var(--neutral-n2)',
              margin: '0 4px',
            }}
          />
          <span className="line" />
        </Space>
        <IconFont
          type="download"
          style={{ fontSize: 24, color: 'var(--neutral-n2)'}}
        />
      </RightWrap>
    </ToolBarBox>
  )
}

export default ToolBar
