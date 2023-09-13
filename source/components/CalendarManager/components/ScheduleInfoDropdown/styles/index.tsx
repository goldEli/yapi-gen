import styled from '@emotion/styled'
import { css } from '@emotion/css'
export const ScheduleInfoHeader = styled.div`
  /* height: 136px; */
  background-color: var(--primary-d1);
  padding: 16px;
  box-sizing: border-box;
  border-radius: 6px 0 0 0;
`
export const ScheduleInfoHeaderBtn = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  cursor: pointer;
  align-items: center;
`
export const ScheduleInfoHeaderContent = styled.div`
  color: var(--neutral-white-d7);
  font-size: var(--font14);
  font-family: PingFang SC-Medium, PingFang SC;
  font-family: SiYuanMedium;
  margin-bottom: 8px;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
`
export const ScheduleInfoHeaderDate = styled.div`
  color: var(--neutral-white-d7);
  font-size: var(--font12);
`
export const statusClass = css`
  width: 40px;
  height: 22px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px 16px 16px 16px;
  opacity: 1;
  text-align: center;
  color: var(--neutral-white-d7);
  font-size: var(--font12);
  line-height: 22px;
`
export const iconBox = css`
  display: flex;
  position: relative;
  span.icon {
    color: var(--neutral-white-d6);
  }
  > span {
    width: 28px;
    height: 28px;
    margin-left: 2px;
    text-align: center;
    line-height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    &:hover {
      background: rgba(255, 255, 255, 0.3);
      border-radius: 6px;
    }
  }
  .moreOperate {
    margin-left: 6px;
    color: var(--neutral-white-d6);
    cursor: pointer;
    label {
      cursor: pointer;
      width: 28px;
      height: 28px;
      display: inline-block;
      line-height: 30px;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      &:hover {
        background: rgba(255, 255, 255, 0.3);
        border-radius: 6px;
      }
    }
  }
`
export const BoxTip = styled.div`
  min-width: 120px;
  background: #ffffff;
  box-shadow: 0px 0px 15px 6px rgba(0, 0, 0, 0.12);
  border-radius: 6px 6px 6px 6px;
  position: absolute;
  top: 24px;
  right: 0px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;

  box-sizing: border-box;
  max-width: 160px;
  z-index: 88;
  padding: 6px 0px;
  span {
    color: var(--neutral-n2);
    font-size: var(--font14);
    height: 32px;
    display: flex;
    align-items: center;
    margin-left: 0px;
    padding-left: 16px;
    box-sizing: border-box;
    &:hover {
      background: var(--hover-d3);
    }
  }
`
export const confirmText = css`
  color: var(--neutral-n2);
  font-size: var(--font14);
  margin-bottom: 8px;
`
export const confirmSure = css`
  color: var(--neutral-n2);
  font-size: var(--font14);
  margin-left: 8px;
`
export const ModalChildren = styled.div`
  box-sizing: border-box;
  padding: 0px 18px;
  height: 100px;
  .ant-radio-group {
    margin-top: 12px;
  }
  .ant-radio-wrapper {
    color: var(--neutral-n1-d1) !important;
    font-size: var(--font14) !important;
  }
`

export const ScheduleInfoContentBox = styled.div<{ showFooter: boolean }>`
  padding: 16px 0px;
  box-sizing: border-box;
  height: ${props =>
    props.showFooter ? 'calc(100% - 160px)' : 'calc(100% - 0px)'};
  overflow-y: scroll;
  overflow-x: hidden;
`
export const ScheduleInfoContentItem = styled.div`
  display: flex;
  align-items: flex-start;
  align-content: center;
  margin-bottom: 14px;
  /* border: 1px solid red; */
  padding: 0px 16px;
  box-sizing: border-box;
`
export const contentTip = css`
  color: var(--neutral-n1-d1);
  font-size: var(--font12);
  margin-left: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  img {
    width: 24px;
    height: 22px;
    margin-right: 4px;
    vertical-align: top;
    position: relative;
    top: -3px;
  }
  span:nth-child(2) {
    cursor: pointer;
    position: relative;
    top: 0px;
    vertical-align: middle;
  }
  .username {
    position: relative;
    top: 3px;
  }
`
export const PersonList = styled.div`
  margin-left: 28px;
  /* padding-bottom: 14px; */
  min-width: 60px;
  overflow-y: scroll;
  margin-bottom: 16px;
`
export const PersonItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  color: var(--neutral-n2);
  font-size: var(--font12);
  img {
    width: 24px;
    height: 24px;
    margin-right: 8px;
    border-radius: 24px;
    vertical-align: bottom;
  }
  span:nth-child(2) {
    color: var(--neutral-n3);
  }
`
export const FileList = styled.div`
  margin-left: 28px;
  > div {
    > div {
      > div {
        margin-left: 0px !important;
        /* min-width: 300px !important */
      }
    }
  }
`
export const FileItem = styled.div`
  background: #ffffff;
  box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.06);
  border-radius: 6px 6px 6px 6px;
  margin-bottom: 8px;
  padding: 12px 16px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  > span:nth-child(1) {
    font-size: 30px;
    margin-right: 8px;
  }
  img {
    width: 32px;
    height: 32px;
    margin-right: 8px;
  }
`
export const FileItemInfo = styled.div`
  display: flex;
  flex-direction: column;
  span:nth-child(1) {
    color: var(--neutral-n1-d1);
    font-size: var(--font14);
  }
  span:nth-child(2) {
    color: var(--neutral-n3);
    font-size: var(--font12);
  }
`
