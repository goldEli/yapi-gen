import { css } from '@emotion/css'
import styled from '@emotion/styled'
import { Timeline } from 'antd'

export const Items = styled.div`
  padding: 4px 0;
  border-radius: 6px;
  background: var(--neutral-white-d5);
  width: max-content;
`

export const Item = styled.div`
  height: 40px;
  padding: 0 16px;
  width: 100%;
  cursor: pointer;
  display: flex;
  align-items: center;
  .name {
    font-size: 14px;
    color: var(--neutral-n2);
  }
  .provider {
    display: flex;
    align-items: center;
    margin: 0 12px;
    position: relative;
    div {
      height: 0px;
      border-bottom: 1px dashed var(--neutral-n5);
      width: 32px;
    }
    span {
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--neutral-n5);
    }
  }
  &:hover {
    background: var(--hover-d3);
  }
`

export const FormWrap = styled.div`
  box-sizing: border-box;
  padding: 0 10px 0 24px;
  max-height: 60vh;
  overflow-y: auto;
`

export const MyDiv = styled.div<{ show?: boolean }>`
  display: flex;
  align-items: center;
  border-radius: 2px;
  padding: 6px 14px;
  transition: all 0.3s;
  /* height: 32px; */
  cursor: pointer;
  background-color: ${props => (props.show ? 'var(--auxiliary-b6)' : '')};
  &:hover {
    background-color: #f5f5f5;
  }
`

export const ExcessiveBox = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  justify-content: center;
`

export const ExcessiveLine = styled.div`
  display: flex;
  align-items: center;
  margin: 0 12px;
  .circle {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--neutral-n5);
  }
`

export const ExcessiveProvider = styled.div`
  position: relative;
  width: 202px;
  height: 0;
  border-bottom: 1px dashed var(--neutral-n5);
  display: flex;
  align-items: center;
  justify-content: center;
  span {
    position: absolute;
    top: -26px;
    color: var(--neutral-n3);
    font-size: 12px;
    width: 80%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    text-align: center;
  }
`

export const VerifyTitle = styled.div`
  height: 22px;
  font-size: 14px;
  font-family: SiYuanMedium;
  color: var(--neutral-n1-d2);
  line-height: 22px;
  margin-bottom: 20px;
`

export const LineBoxTitle2 = styled.div`
  margin-right: 40px;
  height: 22px;
  font-size: 14px;
  font-family: PingFang SC-Regular, PingFang SC;
  font-weight: 400;
  color: var(--neutral-n1-d1);
  margin-bottom: 8px;
  line-height: 22px;
`

export const ArrorBox = styled.div`
  display: flex;
  flex-wrap: wrap;
`

export const symbol = css`
  color: var(--neutral-n4);
  position: absolute;
  width: 16px;
  height: 16px;
  border-radius: 0px 0px 0px 0px;
  top: 5px;
  right: -25px;
`

export const ArrorItem = styled.div`
  position: relative;
  height: 50px;
  display: flex;
  /* flex-direction: column; */
  display: flex;
  align-items: center;
  justify-content: space-between;
  &:nth-last-child(1) {
    .${symbol} {
      visibility: hidden;
    }
  }
`

export const PopoverStatusWrap = styled.div<{
  isShow?: boolean
  state?: number
}>(
  {
    height: 22,
    borderRadius: 6,
    fontSize: '12px',
    cursor: 'pointer',
    padding: '1px 14px',
    maxWidth: 120,
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    width: 'max-content',
  },
  ({ state }) => ({
    color:
      state === 1
        ? 'var(--neutral-white-d7)'
        : state === 2
        ? 'var(--neutral-n1-d1)'
        : state === 3
        ? 'var(--neutral-white-d7)'
        : '',
    background:
      state === 1
        ? 'var(--auxiliary-b1)'
        : state === 2
        ? 'var(--neutral-n7)'
        : state === 3
        ? 'var(--function-success)'
        : '',
  }),
)

export const TimelineWrap = styled(Timeline)`
  .ant-timeline-item-last {
    .ant-timeline-item-head-blue {
      border-color: var(--neutral-n5);
    }
  }
`

export const StatusTitle = styled.div`
  padding-left: 24px;
  box-sizing: border-box;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  img {
    width: 20px;
    height: 20px;
    margin-right: 8px;
  }
`
