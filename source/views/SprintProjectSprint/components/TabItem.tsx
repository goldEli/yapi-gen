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

const TabItem = () => {
  return (
    <div>
      <Item>
        <div className="title">
          <span>三月第一周的冲刺</span>
          <Checkbox />
        </div>
        <div className="date">2022-06-17 ~ 2022-07-30</div>
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
            <span className="text">3/10</span>
            <IconFont
              type="branch"
              style={{
                fontSize: 16,
                marginLeft: 12,
                marginRight: 5,
                color: 'var(--neutral-n3)',
              }}
            />
            <span className="text">3</span>
          </div>
          <div style={{ width: 108 }}>
            <Progress
              strokeColor="var(--function-success)"
              percent={30}
              size="small"
              trailColor="var(--neutral-n6-d2)"
            />
          </div>
        </div>
      </Item>
      <Item>
        <div className="title">
          <span>三月第一周的冲刺</span>
          <Checkbox />
        </div>
        <div className="date">2022-06-17 ~ 2022-07-30</div>
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
            <span className="text">3/10</span>
            <IconFont
              type="branch"
              style={{
                fontSize: 16,
                marginLeft: 12,
                marginRight: 5,
                color: 'var(--neutral-n3)',
              }}
            />
            <span className="text">3</span>
          </div>
          <div style={{ width: 108 }}>
            <Progress
              strokeColor="var(--function-success)"
              percent={30}
              size="small"
              trailColor="var(--neutral-n6-d2)"
            />
          </div>
        </div>
      </Item>
      <Item>
        <div className="title">
          <span>三月第一周的冲刺</span>
          <Checkbox />
        </div>
        <div className="date">2022-06-17 ~ 2022-07-30</div>
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
            <span className="text">3/10</span>
            <IconFont
              type="branch"
              style={{
                fontSize: 16,
                marginLeft: 12,
                marginRight: 5,
                color: 'var(--neutral-n3)',
              }}
            />
            <span className="text">3</span>
          </div>
          <div style={{ width: 108 }}>
            <Progress
              strokeColor="var(--function-success)"
              percent={30}
              size="small"
              trailColor="var(--neutral-n6-d2)"
            />
          </div>
        </div>
      </Item>
      <Item>
        <div className="title">
          <span>三月第一周的冲刺</span>
          <Checkbox />
        </div>
        <div className="date">2022-06-17 ~ 2022-07-30</div>
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
            <span className="text">3/10</span>
            <IconFont
              type="branch"
              style={{
                fontSize: 16,
                marginLeft: 12,
                marginRight: 5,
                color: 'var(--neutral-n3)',
              }}
            />
            <span className="text">3</span>
          </div>
          <div style={{ width: 108 }}>
            <Progress
              strokeColor="var(--function-success)"
              percent={30}
              size="small"
              trailColor="var(--neutral-n6-d2)"
            />
          </div>
        </div>
      </Item>
      <Item>
        <div className="title">
          <span>三月第一周的冲刺</span>
          <Checkbox />
        </div>
        <div className="date">2022-06-17 ~ 2022-07-30</div>
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
            <span className="text">3/10</span>
            <IconFont
              type="branch"
              style={{
                fontSize: 16,
                marginLeft: 12,
                marginRight: 5,
                color: 'var(--neutral-n3)',
              }}
            />
            <span className="text">3</span>
          </div>
          <div style={{ width: 108 }}>
            <Progress
              strokeColor="var(--function-success)"
              percent={30}
              size="small"
              trailColor="var(--neutral-n6-d2)"
            />
          </div>
        </div>
      </Item>
      <Item>
        <div className="title">
          <span>三月第一周的冲刺</span>
          <Checkbox />
        </div>
        <div className="date">2022-06-17 ~ 2022-07-30</div>
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
            <span className="text">3/10</span>
            <IconFont
              type="branch"
              style={{
                fontSize: 16,
                marginLeft: 12,
                marginRight: 5,
                color: 'var(--neutral-n3)',
              }}
            />
            <span className="text">3</span>
          </div>
          <div style={{ width: 108 }}>
            <Progress
              strokeColor="var(--function-success)"
              percent={30}
              size="small"
              trailColor="var(--neutral-n6-d2)"
            />
          </div>
        </div>
      </Item>
      <Item>
        <div className="title">
          <span>三月第一周的冲刺</span>
          <Checkbox />
        </div>
        <div className="date">2022-06-17 ~ 2022-07-30</div>
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
            <span className="text">3/10</span>
            <IconFont
              type="branch"
              style={{
                fontSize: 16,
                marginLeft: 12,
                marginRight: 5,
                color: 'var(--neutral-n3)',
              }}
            />
            <span className="text">3</span>
          </div>
          <div style={{ width: 108 }}>
            <Progress
              strokeColor="var(--function-success)"
              percent={30}
              size="small"
              trailColor="var(--neutral-n6-d2)"
            />
          </div>
        </div>
      </Item>
      <Item>
        <div className="title">
          <span>三月第一周的冲刺</span>
          <Checkbox />
        </div>
        <div className="date">2022-06-17 ~ 2022-07-30</div>
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
            <span className="text">3/10</span>
            <IconFont
              type="branch"
              style={{
                fontSize: 16,
                marginLeft: 12,
                marginRight: 5,
                color: 'var(--neutral-n3)',
              }}
            />
            <span className="text">3</span>
          </div>
          <div style={{ width: 108 }}>
            <Progress
              strokeColor="var(--function-success)"
              percent={30}
              size="small"
              trailColor="var(--neutral-n6-d2)"
            />
          </div>
        </div>
      </Item>
      <Item>
        <div className="title">
          <span>三月第一周的冲刺</span>
          <Checkbox />
        </div>
        <div className="date">2022-06-17 ~ 2022-07-30</div>
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
            <span className="text">3/10</span>
            <IconFont
              type="branch"
              style={{
                fontSize: 16,
                marginLeft: 12,
                marginRight: 5,
                color: 'var(--neutral-n3)',
              }}
            />
            <span className="text">3</span>
          </div>
          <div style={{ width: 108 }}>
            <Progress
              strokeColor="var(--function-success)"
              percent={30}
              size="small"
              trailColor="var(--neutral-n6-d2)"
            />
          </div>
        </div>
      </Item>
      <Item>
        <div className="title">
          <span>三月第一周的冲刺</span>
          <Checkbox />
        </div>
        <div className="date">2022-06-17 ~ 2022-07-30</div>
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
            <span className="text">3/10</span>
            <IconFont
              type="branch"
              style={{
                fontSize: 16,
                marginLeft: 12,
                marginRight: 5,
                color: 'var(--neutral-n3)',
              }}
            />
            <span className="text">3</span>
          </div>
          <div style={{ width: 108 }}>
            <Progress
              strokeColor="var(--function-success)"
              percent={30}
              size="small"
              trailColor="var(--neutral-n6-d2)"
            />
          </div>
        </div>
      </Item>
      <NoSprintButton>未创建冲刺的事务（9）</NoSprintButton>
    </div>
  )
}

export default TabItem
