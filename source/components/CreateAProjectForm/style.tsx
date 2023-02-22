import { css } from '@emotion/css'
import styled from '@emotion/styled'

export const Wrap = styled.div`
  width: 388px;
  padding-left: 24px;
`
export const CoverAreaWrap = styled.div`
  box-sizing: content-box;
  width: 368px;
  padding-right: 24px;
  border-right: 1px solid var(--neutral-n6-d1);
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
  border-radius: 6px 6px 6px 6px;
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  visibility: hidden;
`

export const CoverAreaImageWrap = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 6px 6px 6px 6px;
  border: 1px solid var(--neutral-n6-d2);
  position: relative;
  :hover ${CoverAreaImageShade} {
    visibility: visible;
  }
  :hover {
    ::after {
      content: '';
      position: absolute;
      z-index: 1;
      bottom: -2px;
      left: 0;
      width: 80px;
      height: 40px;
      background: var(--green);
      border-radius: 6px 6px 6px 6px;
      opacity: 1;
    }
  }
`

export const CoverAreaAdd = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 6px 6px 6px 6px;
  opacity: 1;
  border: 1px solid var(--neutral-n6-d2);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`
