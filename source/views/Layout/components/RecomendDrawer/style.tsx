import { css } from '@emotion/css'
import styled from '@emotion/styled'
import { Spin } from 'antd'
export const cusDrawer = css`
  .cusDrawer {
    .ant-drawer-body {
      padding: 20px 16px;
    }
  }
`
export const TitleWrap = styled.div`
  display: flex;
  justify-content: space-between;
  height: 32px;
  align-items: center;
  padding: 0 16px;
`
export const TabsWrap = styled.div`
  background: var(--neutral-n8);
  border-radius: 4px;
  display: flex;
  height: 100%;
  align-items: center;
  .item {
    padding: 2px 50px;
    color: var(--neutral-n2);
    font-size: var(--font14);
    font-family: SiYuanRegular;
    cursor: pointer;
    height: 28px;
    display: flex;
    align-items: center;
    &:hover {
      color: var(--primary-d2);
    }
  }
  .activity {
    background-color: var(--neutral-white-d6);
    border-radius: 4px;
    color: var(--primary-d2);
    font-family: SiYuanMedium;
  }
`
export const AssignTaskWrap = styled.div`
  height: calc(100vh - 168px);
  overflow-y: auto;
`
export const TabsBox = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
  padding: 0px 4px;
  box-sizing: border-box;
`
export const ContentWrap = styled.div`
  margin-top: 8px;
`
export const SpinWrap = styled(Spin)`
  position: absolute;
  top: 145px;
  width: 100%;
`
export const ItemWrap = styled.div`
  display: flex;
  flex-direction: column;
`
export const TimeName = styled.div`
  margin-top: 16px;
  color: var(--neutral-n3);
  font-size: 12px;
  padding-left: 16px;
`
export const TaskItem = styled.div`
  height: 56px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 7px 16px;
  cursor: pointer;
  width: 100%;
  .left {
    display: flex;
    align-items: flex-start;
    width: calc(100% - 52px);
    .icon {
      width: 20px;
      height: 20px;
      margin-right: 8px;
    }
    .info {
      display: flex;
      flex-direction: column;
      width: calc(100% - 40px);
      .name {
        font-size: 14px;
        color: var(--neutral-n1-d1);
        width: 100%;
        display: inline-block;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
      .sub {
        font-size: 12px;
        color: var(--neutral-n3);
        width: 100%;
        display: inline-block;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
    }
  }
  &:hover {
    background: var(--hover-d3);
  }
`
export const CanClick = styled.div`
  height: 24px;
  border-radius: 6px;
  padding: 0 8px;
  cursor: pointer;
  color: var(--neutral-white-d7);
  font-size: 12px;
  background: var(--primary-d2);
  line-height: 24px;
  width: fit-content;
`
export const LoadingMore = styled.div`
  margin-top: 8px;
  text-align: center;
  width: 100%;
  font-size: 12px;
  color: var(--primary-d1);
  cursor: pointer;
`
export const StatusBox = styled.div`
  width: 52px;
  height: 24px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 400;
  text-align: center;
  line-height: 24px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 8px;
`
export const ProjectItem = styled.div<{ local?: string }>`
  height: 56px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 7px 16px;
  cursor: pointer;
  .left {
    display: flex;
    align-items: flex-start;
    width: ${props =>
      props.local === 'zh' ? 'calc(100% - 32px)' : 'calc(100% - 56px)'};
    .icon {
      width: 32px;
      height: 32px;
      border-radius: 4px;
      overflow: hidden;
    }
    .info {
      display: flex;
      flex-direction: column;
      width: calc(100% - 50px);
      margin-left: 12px;
      .name {
        font-size: 14px;
        color: var(--neutral-n1-d1);
        width: 100%;
        display: inline-block;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
      .sub {
        font-size: 12px;
        color: var(--neutral-n3);
        width: 100%;
        display: inline-block;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
    }
  }
  .right {
    /* font-size: 12px;
    color: var(--neutral-n3); */
  }
  &:hover {
    background: var(--hover-d3);
  }
`
export const ProjectTypeBox = styled.div<{ type: number }>`
  height: 16px;
  background: ${props =>
    props.type === 1
      ? 'linear-gradient(225deg, #8dd2f6 0%, #6688ff 100%)'
      : 'linear-gradient(225deg, #FFA29C 0%, #F6856C 100%);'};
  border-radius: 4px 4px 4px 4px;
  font-size: 12px;
  padding: 0px 4px;
  color: var(--neutral-white-d1);
  line-height: 16px;
`
export const ReportItem = styled.div`
  height: 56px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 7px 16px;
  cursor: pointer;
  .left {
    display: flex;
    align-items: center;
    width: calc(100% - 36px);
    .info {
      display: flex;
      flex-direction: column;
      width: calc(100% - 50px);
      margin-left: 12px;
      .name {
        font-size: 14px;
        color: var(--neutral-n1-d1);
        width: 100%;
        display: inline-block;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
      .sub {
        font-size: 12px;
        color: var(--neutral-n3);
        width: 100%;
        display: inline-block;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
    }
  }
  .right {
    font-size: 12px;
    color: var(--neutral-n3);
  }
  &:hover {
    background: var(--hover-d3);
  }
`
export const DrawerFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  color: #6688ff;
  cursor: pointer;
  height: 52px;
  &:hover {
    text-decoration: underline;
  }
`
