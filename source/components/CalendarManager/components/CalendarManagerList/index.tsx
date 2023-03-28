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
const CalendarManagerListItem = styled.div`
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

interface CalendarManagerListProps {
  children?: React.ReactNode
}

const CalendarManagerList: React.FC<CalendarManagerListProps> = props => {
  return (
    <div>
      <Collapse defaultActiveKey={['1']} ghost>
        <Panel
          header={
            <Title>
              <span className="name">CalendarManagerList</span>
              <span className="icon">+</span>
            </Title>
          }
          key="1"
        >
          <CalendarManagerListItem>
            <CheckBox />
            <span className="name">张三</span>
          </CalendarManagerListItem>
        </Panel>
      </Collapse>
    </div>
  )
}

export default CalendarManagerList
