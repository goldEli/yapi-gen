import React, { useEffect } from 'react'
import styled from '@emotion/styled'
import { Checkbox, Progress } from 'antd'
import IconFont from '@/components/IconFont'

const Item = styled.div`
  cursor: pointer;
  height: 104px;
  background: #ffffff;
  border-radius: 6px 6px 6px 6px;
  border: 1px solid var(--neutral-n6-d1);
  box-sizing: border-box;
  padding: 16px;
  margin-bottom: 16px;
  &:hover {
    border: 1px solid var(--primary-d1);
  }
  .title {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    font-family: SiYuanMedium;
    font-weight: 500;
    color: var(--neutral-n1-d1);
    line-height: 22px;
  }
  .date {
    font-size: 12px;
    font-family: MiSans-Regular, MiSans;
    color: var(--neutral-n4);
    line-height: 20px;
  }
  .progress {
    display: flex;
    justify-content: space-between;
    .iconBox {
      display: flex;
      align-items: center;
    }
    .text {
      color: var(--neutral-n2);
      font-size: 14px;
      font-family: MiSans-Regular, MiSans;
    }
  }
`
const NoSprintButton = styled.div`
  cursor: pointer;
  height: 52px;
  background: var(--neutral-white-d4);
  border-radius: 6px 6px 6px 6px;
  border: 1px solid var(--neutral-n6-d1);
  line-height: 52px;
  text-align: center;
  font-size: 14px;
  font-family: MiSans-Regular, MiSans;
  font-weight: 400;
  color: var(--neutral-n2);
  .active {
    border: 1px solid var(--primary-d1);
  }
  &:hover {
    border: 1px solid var(--primary-d1);
  }
`

const TabItem = (props: any) => {
  const { data } = props
  return (
    <div>
      {data?.list?.map((item: any) => (
        <Item key={item.id}>
          <div className="title">
            <span>{item.name}</span>
            <Checkbox />
          </div>
          <div className="date">
            {item.start_at && item.end_at
              ? `${item.start_at} ~ ${item.end_at}`
              : '--'}
          </div>
          <div className="progress">
            <div className="iconBox">
              <IconFont
                type="recover"
                style={{
                  fontSize: 16,
                  marginLeft: 2,
                  color: 'var(--neutral-n3)',
                }}
              />
              <span className="text">{`${item.story_finish_count}/${item.story_count}`}</span>
              <IconFont
                type="branch"
                style={{
                  fontSize: 16,
                  marginLeft: 12,
                  marginRight: 5,
                  color: 'var(--neutral-n3)',
                }}
              />
              <span className="text">{item.child_story_total}</span>
            </div>
            <div style={{ width: 108 }}>
              <Progress
                strokeColor="var(--function-success)"
                percent={Number(item.story_finish_count / item.story_count)}
                size="small"
                trailColor="var(--neutral-n6-d2)"
              />
            </div>
          </div>
        </Item>
      ))}
      <NoSprintButton>{`未创建冲刺的事务（${data.unassigned_count}）`}</NoSprintButton>
    </div>
  )
}

export default TabItem
