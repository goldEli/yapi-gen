import React from 'react'
import { Collapse } from 'antd'
import styled from '@emotion/styled'

const { Panel } = Collapse

const Title = styled.div`
  display: flex;
  justify-content: space-between;
  .name {
  }
  .icon {
  }
`
const CalendarListItem = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  .name {
  }
`
const CheckBox = styled.div`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border-radius: 3px;
  border: 1px solid gray;
  cursor: pointer;
`

interface CalendarListProps {
  children?: React.ReactNode
}

const CalendarList: React.FC<CalendarListProps> = props => {
  return (
    <div>
      <Collapse defaultActiveKey={['1']} ghost>
        <Panel
          header={
            <Title>
              <span className="name">CalendarList</span>
              <span className="icon">+</span>
            </Title>
          }
          key="1"
        >
          <CalendarListItem>
            <CheckBox />
            <span className="name">张三</span>
          </CalendarListItem>
        </Panel>
      </Collapse>
    </div>
  )
}

export default CalendarList
