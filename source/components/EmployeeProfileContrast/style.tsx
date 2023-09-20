import styled from '@emotion/styled'

export const Header = styled.div`
  height: 52px;
  background: var(--neutral-white-d5);
  border-bottom: 1px solid var(--neutral-n6-d2);
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const BackIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--hover-d2);
  cursor: pointer;
  &:hover {
    svg {
      color: var(--primary-d2);
    }
  }
`

export const Content = styled.div`
  height: calc(100% - 52px);
  width: 100%;
  padding: 0px 24px;
  background: #fff;
  padding-top: 0px;
`

export const TimeWrap = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--neutral-n1-d1);
  font-family: SiYuanMedium;
  font-size: 16px;
  height: 72px;
`

export const Box = styled.div`
  display: flex;
  height: calc(100% - 72px);
  .ant-spin-container {
    display: flex;
  }
`

export const TitleWrap = styled.div`
  height: 32px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  .label {
    font-size: 14px;
    color: var(--neutral-n1-d1);
    font-family: SiYuanMedium;
  }
  .sub {
    display: flex;
    align-items: center;
    color: var(--neutral-n2);
    .text {
      font-size: 12px;
      cursor: pointer;
    }
    &:hover {
      color: var(--primary-d2) !important;
    }
  }
`

export const Wrap = styled.div`
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .work {
    background: rgba(102, 136, 255, 0.1);
  }
  .report {
    background: rgba(250, 151, 70, 0.1);
  }
`

export const Line = styled.div`
  width: 1px;
  height: 100%;
  background: var(--neutral-n6-d2);
  margin: 0 12px;
`

export const ItemGroup = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100% - 40px);
  overflow-y: auto;
`

export const ItemBox = styled.div<{ isWork?: boolean }>`
  width: 100%;
  padding: 12px;
  height: 86px;
  display: flex;
  align-items: flex-start;
  .avatar {
    margin-top: 4px;
  }
  .right {
    display: flex;
    flex-direction: column;
    margin-left: 8px;
    width: calc(100% - 40px);
    .name {
      display: flex;
      align-items: center;
      font-size: 14px;
      color: var(--neutral-n1-d1);
      .progress {
        height: 22px;
        border-radius: 50px;
        padding: 0 8px;
        background: rgba(67, 186, 154, 0.1);
        color: var(--function-success);
        font-size: 12px;
        line-height: 22px;
      }
    }
    .position {
      width: 100%;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      font-size: 12px;
      color: var(--neutral-n2);
    }
    .totalBox {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      .total {
        font-size: 12px;
        color: var(--neutral-n2);
      }
      .sub {
        font-size: 12px;
        color: var(--neutral-n1-d1);
      }
    }
  }
  /* &:hover {
    background: ${props => (props.isWork ? 'var(--hover-d2)' : 'none')};
  } */
`
