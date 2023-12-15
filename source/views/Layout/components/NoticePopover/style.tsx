import { css } from '@emotion/css'
import styled from '@emotion/styled'
import { Popover } from 'antd'
export const PopoverWrap = styled(Popover)`
  .ant-popover-title {
    padding: 0;
  }
`
export const overlayClassNameStyle = css`
  top: 59px !important;
  .ant-popover-title {
    padding: 0;
  }
`
export const NoticeTitleWrap = styled.div`
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--neutral-n1-d1);
  font-size: var(--font16);
  font-family: SiYuanMedium;
  padding: 0px 24px;
`
export const NoticePopoverWrap = styled.div`
  height: 80vh;
  width: 480px;
  padding-bottom: 100px;
  overflow-y: scroll;
`
export const ContentList = styled.div`
  padding: 0px 12px;
  /* padding-bottom: 100px; */
  height: 100%;
  overflow-y: scroll;
  margin-top: 12px;
`
export const NoticeItemWrap = styled.div`
  display: flex;
  padding: 12px;
  justify-content: flex-start;
  box-sizing: border-box;
  width: 100%;
  position: relative;
  .type_icon {
    position: relative;
    .icon_wrap {
      width: 24px;
      height: 24px;
      /* border: 1px solid ; */
      border-radius: 50%;
      display: inline-block;
      text-align: center;
      line-height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .dot {
      position: absolute;
      width: 6px;
      height: 6px;
      background-color: var(--function-error);
      border-radius: 50%;
      right: -8px;
      top: 2px;
    }
  }
  &:hover {
    background-color: var(--neutral-n8);
    border-radius: 6px;
    a {
      text-decoration: underline;
    }
    .user_name {
      color: var(--primary-d1);
      cursor: pointer;
    }
  }
  img {
    width: 16px;
    height: 16px;
  }
  .detail {
    margin-left: 12px;
    width: 100%;
  }
  .detail_title {
    display: flex;
    justify-content: space-between;
    width: 100%;
    span:nth-child(1) {
      color: var(--neutral-n1-d1);
      font-size: var(--font14);
      font-family: SiYuanMedium;
    }
    span:nth-child(2) {
      color: var(--neutral-n4);
      font-size: var(--font12);
    }
    span.read {
      color: var(--neutral-n4);
    }
  }
  .detail_content {
    margin-bottom: 8px;
    margin-top: 8px;
    color: var(--neutral-n2);
    font-size: var(--font14);
    display: flex;
    align-items: center;
    img {
      margin-right: 4px;
      width: 16px;
      height: 16px;
    }
    span:nth-child(2) {
      position: relative;
      top: 2px;
    }
  }

  .detail_result {
    color: #323233;
    font-size: var(--font14);
    a {
      margin-left: 4px;
      &:hover {
        text-decoration: underline;
      }
    }
  }
  .read {
    color: var(--neutral-n4);
  }
`
export const FooterBox = styled.div`
  position: absolute;
  left: 0px;
  bottom: 0px;
  width: 100%;
  z-index: 1;
  height: 80px;
  background: #fff;
  padding-right: 16px;
  border-radius: 6px;
  .current-week {
    display: flex;
    align-items: center;
    color: var(--neutral-n3);
    font-size: var(--font12);
    height: 24px;
    position: relative;
    margin-left: 24px;
    padding-bottom: 16px;
    padding-top: 16px;
    &::after {
      position: absolute;
      content: '';
      left: 0px;
      height: 1px;
      background: var(--neutral-n6-d1);
      width: 100%;
      bottom: 0px;
    }
  }
  .more-notice {
    text-align: right;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    color: var(--primary-d2);
    height: 52px;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
`
