import styled from '@emotion/styled'
import { Input, Popover, Space } from 'antd'
import { useState } from 'react'
import IconFont from '@/components/IconFont'

const DemandCheckedItem = styled.div({
  height: 22,
  lineHeight: '22px',
  padding: '0 8px',
  fontSize: 12,
  position: 'relative',
  color: '#323233',
  boxSizing: 'border-box',
  borderRadius: 6,
  '.icon': {
    visibility: 'hidden',
    marginLeft: 8,
  },
  '&:hover': {
    '.icon': {
      visibility: 'visible',
    },
  },
})

const DemandWrap = styled.div({
  display: 'flex',
  flexDirection: 'column',
})

const DemandItem = styled.div({
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

interface DemandProps {
  onChangeList(val: []): void
  tap?(value: any, active: any): void
}

const TagBox = (props: DemandProps) => {
  const [value, setValue] = useState('')
  const DemandList = [
    { name: '有风险',
      color: 'red' },
    { name: '等待转测',
      color: 'green' },
  ]
  return (
    <DemandWrap title="">
      <div style={{ padding: '16px 16px 4px 16px' }}>
        <Input.Search value={value} onChange={e => setValue(e.target.value)} />
      </div>
      {DemandList.filter(k => k.name.includes(value)).map(i => (
        <DemandItem key={i.name}>
          <div style={{ background: i.color }} />
          <span>{i.name}</span>
        </DemandItem>
      ))}
    </DemandWrap>
  )
}

interface Props {
  addWrap: React.ReactElement
}

export default (props: Props) => {
  const [demandGroup, setDemandGroup] = useState([{ name: '已确认' }])
  const colorList = ['#FF5C5E', '#43BA9A', '#2877FF', '#969799']
  const colorStatus = (
    <Space
      style={{ display: 'flex',
        alignItems: 'center',
        padding: 16 }}
      size={8}
    >
      {colorList.map(i => (
        <div
          style={{ background: i,
            height: 16,
            width: 16,
            borderRadius: 4 }}
        />
      ))}
    </Space>
  )
  return (
    <div style={{ display: 'flex',
      alignItems: 'center' }}>
      <DemandCheckedItem>
        {demandGroup.map(i => (
          <div
            style={{ cursor: 'pointer',
              display: 'flex',
              alignItems: 'center' }}
          >
            <Popover placement="bottom" trigger="click" content={colorStatus}>
              {i.name}
            </Popover>
            <IconFont className="icon" type="close" />
          </div>
        ))}
      </DemandCheckedItem>
      {demandGroup.length
        ? ''
        : (
          <Popover
            placement="bottom"
            trigger="click"
            content={<TagBox tap={() => {}} onChangeList={setDemandGroup} />}
            getPopupContainer={node => node}
          >
            {props.addWrap}
          </Popover>
        )}
    </div>
  )
}
