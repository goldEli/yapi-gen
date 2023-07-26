import { css } from '@emotion/css'
import styled from '@emotion/styled'
import IconFont from '../IconFont'

export const Wrap = styled.div`
  width: 410px;
  padding-left: 24px;
  /* max-height: 536px; */
  /* overflow-y: auto; */
  padding-right: 24px;
`

export const CoverAreaWrap = styled.div`
  box-sizing: content-box;
  width: 368px;
  padding-right: 24px;
  /* border-right: 1px solid var(--neutral-n6-d2); */
`

export const CoverArea = styled.div`
  margin-top: 16px;
  margin-bottom: 32px;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
`

export const CoverAreaImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 6px 6px 6px 6px;
  cursor: pointer;
  object-fit: cover;
`

export const coverAreaIcon = css`
  font-size: 24px;
  position: absolute;
  top: 0;
  right: -1px;
`

export const coverAreadelIcon = css`
  font-size: 20px;
`

export const CoverAreaImageShade = styled.div`
  width: 80px;
  height: 80px;
  background: rgba(0, 0, 0, 0.3);
  /* background: red; */
  border-radius: 6px 6px 6px 6px;
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  visibility: hidden;
  z-index: 555;
`

export const CoverAreaImageWrap = styled.div<{ color?: string }>`
  width: 80px;
  height: 80px;
  border-radius: 6px 6px 6px 6px;
  border: 1px solid var(--neutral-n6-d2);
  position: relative;
  :hover ${CoverAreaImageShade} {
    visibility: visible;
  }
  :hover {
    cursor: pointer;
    ::after {
      content: '';
      position: absolute;
      z-index: 1;
      bottom: -2px;
      left: 0;
      width: 80px;
      height: 40px;
      transition: all 0.3s;
      border-bottom: 2px solid
        ${props =>
          props.color === '#009BF2'
            ? '#009BF2'
            : props.color === '#534BFF'
            ? '#534BFF'
            : props.color === '#E86013'
            ? '#E86013'
            : props.color === '#01AF85'
            ? '#01AF85'
            : ''};
      background: ${props =>
        props.color === '#009BF2'
          ? 'var(--blue)'
          : props.color === '#534BFF'
          ? 'var(--purple)'
          : props.color === '#E86013'
          ? 'var(--orange)'
          : props.color === '#01AF85'
          ? 'var(--green)'
          : ''};
      border-radius: 6px 6px 6px 6px;
      opacity: 1;
    }
  }
`

export const CoverAreaAdd = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 6px 6px 6px 6px;
  /* background: var(--neutral-n6-d2); */
  opacity: 1;
  border: 1px solid var(--neutral-n6-d2);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    background: var(--hover-d3);
    border: none;
  }
  &:hover svg {
    color: var(--primary-d2);
  }
`
