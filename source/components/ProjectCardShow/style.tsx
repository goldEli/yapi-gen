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
  .boxType {
    display: inline-block;
    line-height:16px;
    text-align: center;
    // width: 32px;
    padding:0 4px;
    height: 16px;
    border-radius: 4px;
    font-size: 12px;
    color:var(--neutral-white-d1);
    margin-right:8px;
  }
`

export const CardRightSecond = styled.div`
  font-size: 12px;
  font-family: PingFang SC-Regular, PingFang SC;
  font-weight: 400;
  color: var(--neutral-n3);
  line-height: 20px;
  margin-top:3px;
  margin-bottom:8px;
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
  background: var(--hover-d3);
  border-radius: 6px 6px 6px 6px;
  opacity: 1;
  display: flex;
  gap: 16px;

  &:hover ${ShowWrap} {
    display: flex;
  }

  &:hover ${ProgressWrap} {
    /* display: none; */
  }
  &:hover ${HoverIcon} {
    display: none;
  }
`
