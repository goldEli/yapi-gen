import React, { useState } from 'react'
import { Collapse } from 'antd'
import styled from '@emotion/styled'
import { CloseWrap } from '@/components/StyleCommon'
import IconFont from '@/components/IconFont'
import MoreDropdown from '@/components/MoreDropdown'

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
  .ant-collapse-item > .ant-collapse-content > .ant-collapse-content-box {
    padding: 12px 16px 0;
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
  justify-content: space-between;
  height: 32px;
  cursor: pointer;
  .name {
    font-size: 14px;
    color: var(--neutral-n2);
    margin-left: 8px;
  }
  &:hover {
    .name {
      color: var(--primary-d2);
    }
    .dropdownIcon {
      visibility: visible;
    }
  }
`

const ItemBox = styled.div`
  display: flex;
  align-items: center;
`

interface CalendarManagerListProps {
  title: string
}

const CalendarManagerList: React.FC<CalendarManagerListProps> = props => {
  const [isMoreVisible, setIsMoreVisible] = useState(false)
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
              <span className="name">{props.title}</span>
              <CloseWrap width={24} height={24}>
                <IconFont className="icon" type="plus" />
              </CloseWrap>
            </Title>
          }
          key="1"
        >
          <CalendarManagerListItem>
            <ItemBox>
              <IconFont
                type="put"
                style={{ fontSize: 16, color: 'var(--neutral-n3)' }}
              />
              <span className="name">张三</span>
            </ItemBox>
            <MoreDropdown
              isMoreVisible={isMoreVisible}
              menu={<div>1121</div>}
              onChangeVisible={setIsMoreVisible}
            />
          </CalendarManagerListItem>
        </Panel>
      </CollapseWrap>
    </div>
  )
}

export default CalendarManagerList
