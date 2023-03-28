import React from 'react'
import { Collapse } from 'antd'
import styled from '@emotion/styled'
import { CloseWrap } from '@/components/StyleCommon'
import IconFont from '@/components/IconFont'

const { Panel } = Collapse

const CollapseWrap = styled(Collapse)`
  .ant-collapse-item > .ant-collapse-header {
    display: flex;
    align-items: center;
    padding: 0;
  }
  .ant-collapse-item > .ant-collapse-header .ant-collapse-arrow {
    margin-right: 8px;
  }
`

const Title = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  .name {
    font-size: 14px;
    color: var(--neutral-n1-d1);
    font-family: SiYuanMedium;
  }
  .icon {
    font-size: 18px;
    color: var(--neutral-n2);
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
      <CollapseWrap
        defaultActiveKey={['1']}
        ghost
        expandIcon={({ isActive }) => (
          <IconFont
            style={{
              fontSize: 14,
              color: 'var(--neutral-n3)',
            }}
            type="down-icon"
            rotate={isActive ? 0 : -90}
          />
        )}
      >
        <Panel
          header={
            <Title>
              <span className="name">我管理的</span>
              <CloseWrap width={24} height={24}>
                <IconFont className="icon" type="plus" />
              </CloseWrap>
            </Title>
          }
          key="1"
        >
          <CalendarManagerListItem>
            <CheckBox />
            <span className="name">张三</span>
          </CalendarManagerListItem>
          <CalendarManagerListItem>
            <CheckBox />
            <span className="name">张三</span>
          </CalendarManagerListItem>
        </Panel>
      </CollapseWrap>
    </div>
  )
}

export default CalendarManagerList
