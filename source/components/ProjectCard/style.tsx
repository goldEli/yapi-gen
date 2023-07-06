import styled from '@emotion/styled'

export const Image = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
`

export const CardRight = styled.div`
  width: 152px;
`

export const CardRightFirst = styled.div`
  width: 128px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  height: 22px;
  font-size: 14px;
  font-family: PingFang SC-Regular, PingFang SC;
  font-weight: 400;
  color: var(--neutral-n1-d1);
  line-height: 22px;
`

export const CardRightSecond = styled.div`
  width: 128px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  height: 20px;
  font-size: 12px;
  font-family: PingFang SC-Regular, PingFang SC;
  font-weight: 400;
  color: var(--neutral-n3);
  line-height: 20px;
`

export const TransformWrap = styled.div`
  margin-top: 5px;
`

export const ProgressWrap = styled.div`
  display: block;
`

export const ShowWrap = styled.div`
  display: none;
  justify-content: space-between;
`

export const Wrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
`

export const HoverIcon = styled.div`
  cursor: pointer;
  position: absolute;
  top: 19px;
  right: 16px;
  visibility: hidden;
  &:hover svg {
    color: var(--primary-d1);
  }
`

export const EndTag = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  width: 30px;
  height: 16px;
  background: var(--neutral-n4);
  border-radius: 6px 0px 6px 0px;
  line-height: 16px;
  text-align: center;
  font-size: 12px;
  color: var(--neutral-white-d1);
`

export const ProjectCard = styled.div`
  position: relative;
  width: 280px;
  box-sizing: border-box;
  padding: 22px 16px;
  height: 124px;
  background: var(--neutral-n10);
  border-radius: 6px 6px 6px 6px;
  opacity: 1;
  display: flex;
  gap: 16px;
  cursor: pointer;
  transition: all 0.3s;
  &:hover {
    background-color: var(--neutral-white-d4);
    transition: all 0.3s;
    transform: translate(0, -10px);
    box-shadow: 0px 4px 8px 0px rgba(102, 136, 255, 0.12),
      0px -2px 2px 0px rgba(102, 136, 255, 0.04);
  }
  &:hover ${ShowWrap} {
    display: flex;
  }

  &:hover ${ProgressWrap} {
    display: none;
  }
  &:hover ${HoverIcon} {
    visibility: visible;
  }
`

export const HoverDiv = styled.div`
  color: var(--neutral-n4);
  &:hover {
    color: var(--neutral-n2) !important;
  }
`
export const Tags = styled.span<{ type: number }>`
  height: 16px;
  background: ${props =>
    props.type === 1
      ? 'linear-gradient(225deg, #8dd2f6 0%, #6688ff 100%)'
      : 'linear-gradient(225deg, #8DB1F6 0%, #7266FF 100%);'};
  border-radius: 4px 4px 4px 4px;
  font-size: 12px;
  padding: 2px 4px;
  margin-right: 8px;
  color: var(--neutral-white-d1);
`
