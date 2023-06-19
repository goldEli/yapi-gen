import styled from '@emotion/styled'
import { css } from '@emotion/css'
import { Select } from 'antd'
export const Wrap = styled.div`
  width: 320px;
  height: 468px;
  background: #ffffff;
  box-shadow: 0px 0px 15px 6px rgba(0, 0, 0, 0.12);
  border-radius: 6px 6px 6px 6px;
  opacity: 1;
  padding: 16px 16px 6px 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: absolute;
  z-index: 999;
  left: 0px;
  top: 20px;
`
export const SearchBox = styled.div`
  /* border: 1px solid red; */
`

export const ContentBox = styled.div`
  flex: 1;
  padding-top: 14px;
  box-sizing: border-box;
  overflow-y: auto;
  /* padding: 0px; */
  .title {
    color: var(--neutral-n3);
    font-size: var(--font12);
  }
`
export const ContentItem = styled.div`
  height: 40px;
  display: flex;
  align-items: center;
  display: flex;
  cursor: pointer;

  &:hover {
    background: var(--hover-d1);
  }
  img {
    width: 20px;
  }
  span:nth-of-type(1) {
    color: var(--neutral-n1-d1);
    font-size: var(--font14);
    display: inline-block;
    margin: 0px 10px;
    overflow: hidden; //超出的文本隐藏
    text-overflow: ellipsis; //溢出用省略号显示
    white-space: nowrap; //溢出不换行
  }
  span:nth-of-type(2) {
    color: var(--neutral-n1-d1);
    font-size: var(--font12);
    overflow: hidden; //超出的文本隐藏
    text-overflow: ellipsis; //溢出用省略号显示
    white-space: nowrap; //溢出不换行
    width: 160px;
  }
`
export const activity = css`
  span {
    color: var(--primary-d1) !important;
  }
`
export const LoadMore = styled.div`
  color: var(--primary-d2);
  font-size: var(--font12);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`
export const CancelParentBox = styled.div`
  color: var(--neutral-n2);
  font-size: var(--font14);
  font-family: MiSans-Regular, MiSans;
  margin-bottom: 10px;
  margin-top: 10px;
  cursor: pointer;
`
export const FooterBox = styled.div`
  height: 32px;
  color: var(--neutral-n3);
  font-size: var(--font12);
  display: flex;
  align-items: center;
  border-top: 1px solid var(--neutral-n6-d1);
`
