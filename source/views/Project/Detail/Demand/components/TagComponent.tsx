/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-empty-function */
/* eslint-disable @typescript-eslint/naming-convention */
import styled from '@emotion/styled'
import { Input, Popover, Space } from 'antd'
import { useState } from 'react'
import IconFont from '@/components/IconFont'

const TagCheckedItem = styled.div<{ color?: string }>(
  {
    height: 22,
    lineHeight: '22px',
    padding: '0 8px',
    fontSize: 12,
    position: 'relative',
    color: '#969799',
    marginRight: 8,
    border: '1px solid #EBEDF0',
    boxSizing: 'border-box',
    borderRadius: 6,
    '.icon': {
      display: 'none',
    },
    '&:hover': {
      '.icon': {
        display: 'block',
      },
    },
  },
  ({ color }) => ({
    color: color || '#969799',
    border: `1px solid ${color}`,
  }),
)

const TagWrap = styled.div({
  display: 'flex',
  flexDirection: 'column',
})

const TagItem = styled.div({
  display: 'flex',
  alignItems: 'center',
  height: 32,
  cursor: 'pointer',
  paddingLeft: 16,
  div: {
    height: 16,
    width: 16,
    borderRadius: 4,
    marginRight: 8,
  },
  span: {
    color: '#646566',
    fontSize: 14,
  },
  '&:hover': {
    background: '#F0F4FA',
    span: {
      color: '#2877ff',
    },
  },
})

interface TagProps {
  onChangeList(val: []): void
  tap?(value: any, active: any): void
}

const TagBox = (props: TagProps) => {
  const [value, setValue] = useState('')
  const tagList = [
    { name: '有风险', color: 'red' },
    { name: '等待转测', color: 'green' },
  ]
  return (
    <TagWrap title="">
      <div style={{ padding: '16px 16px 4px 16px' }}>
        <Input.Search value={value} onChange={e => setValue(e.target.value)} />
      </div>
      {tagList
        .filter(k => k.name.includes(value))
        .map(i => (
          <TagItem key={i.name}>
            <div style={{ background: i.color }} />
            <span>{i.name}</span>
          </TagItem>
        ))}
      <TagItem hidden={!value}>
        <span>创建【创建新标签】标签</span>
      </TagItem>
    </TagWrap>
  )
}

interface Props {
  addWrap: React.ReactElement
}

const TagComponent = (props: Props) => {
  const [tagGroup, setTagGroup] = useState([{ name: '已确认' }])
  const colorList = ['#FF5C5E', '#43BA9A', '#2877FF', '#969799']
  const colorStatus = (
    <Space
      style={{ display: 'flex', alignItems: 'center', padding: 16 }}
      size={8}
    >
      {colorList.map(i => (
        <div
          key={i}
          style={{ background: i, height: 16, width: 16, borderRadius: 4 }}
        />
      ))}
    </Space>
  )
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <TagCheckedItem>
        {tagGroup.map(i => (
          <div key={i.name} style={{ cursor: 'pointer', alignItems: 'center' }}>
            <Popover placement="bottom" trigger="click" content={colorStatus}>
              {i.name}
            </Popover>
            <IconFont
              className="icon"
              style={{ position: 'absolute', right: -6, top: -6 }}
              type="close-circle"
            />
          </div>
        ))}
      </TagCheckedItem>
      <Popover
        placement="bottom"
        trigger="click"
        content={<TagBox tap={() => {}} onChangeList={setTagGroup} />}
        getPopupContainer={node => node}
      >
        {props.addWrap}
      </Popover>
    </div>
  )
}

export default TagComponent
