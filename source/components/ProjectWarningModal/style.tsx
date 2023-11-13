import styled from '@emotion/styled'
import { css } from '@emotion/css'
export const Footer = styled.div`
  height: 80px;
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const Header = styled.div`
  height: 80px;
  background: linear-gradient(
    0deg,
    rgba(220, 145, 78, 0) 0%,
    rgba(221, 145, 78, 0.2) 100%
  );
  font-size: 18px;
  font-family: SiYuanMedium;
  color: #323233;
  display: flex;
  align-items: center;
  justify-content: center;
`
export const text = css`
  display: inline-block;
  max-width: 580px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`
export const ListBox = styled.div`
  display: flex;
  cursor: pointer;
  flex-direction: column;
  justify-content: center;
  padding: 12px;
  :hover {
    background-color: #f6f7f9;
  }
  :hover .tit {
    /* background-color: #f6f7f9; */
    text-decoration: underline;
    color: #6688ff;
    cursor: pointer;
  }
`
export const SmallTag = styled.span<{ is_end: number; is_start: number }>`
  display: flex;
  white-space: nowrap;
  align-items: center;
  height: 20px;
  line-height: 20px;
  font-size: 12px;
  padding: 2px 8px;
  background-color: ${props =>
    props.is_end === 2 && props.is_start === 2
      ? 'rgba(67,186,154,0.2)'
      : props.is_end === 1 && props.is_start === 2
      ? 'rgba(246,247,249)'
      : 'rgba(102,136,255,0.2)'};
  border: 1px solid
    ${props =>
      props.is_end === 2 && props.is_start === 2
        ? '#43BA9A'
        : props.is_end === 1 && props.is_start === 2
        ? '#969799'
        : '#6688FF'};
  border-radius: 6px 6px 6px 6px;
  margin-right: 8px;
`

export const text2 = css`
  color: #969799;
  :hover {
    color: #6688ff;
    cursor: pointer;
  }
`
