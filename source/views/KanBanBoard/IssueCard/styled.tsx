import IconFont from '@/components/IconFont'
import styled from '@emotion/styled'

export const HoverIcon = styled.div`
  cursor: pointer;
  visibility: hidden;
`
export const IssueCardBox = styled.div`
  width: 270px;
  height: 144px;
  border-radius: 6px 6px 6px 6px;

  &:hover ${HoverIcon} {
    visibility: visible;
  }
`
export const IssueCardBoxContainer = styled.div<{ hidden?: boolean }>`
  padding: 16px;
  box-sizing: border-box;
  background: var(--neutral-white-d2);
  opacity: ${props => (props.hidden ? 0 : 1)};
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
`
export const Top = styled.div`
  width: 100%;
  height: 20px;
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
`

export const TopLeft = styled.div`
  display: flex;
  gap: 8px;
`
export const TopRight = styled.div``
export const TopProjectIcon = styled.img`
  height: 18px;
  width: 18px;
`
export const TopText = styled.div`
  font-size: 12px;
  color: var(--neutral-n3);
`

export const Middle = styled.div`
  flex: 1;
  width: 100%;
  font-size: 14px;
  color: var(--neutral-n1-d2);
  line-height: 22px;
  word-break: break-all;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
`
export const StoryText = styled.span`
  cursor: pointer;
  &:hover {
    color: var(--primary-d2);
  }
`
export const Bottom = styled.div`
  height: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`
export const BottomLeft = styled.div``
export const BottomRight = styled.div`
  font-size: 12px;
  color: var(--neutral-n2);
  display: flex;
  gap: 16px;
`
export const PercentageBox = styled.div`
  width: 31px;
  display: flex;
  align-items: center;
`
export const Sub = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
`
export const WrapIcon = styled(IconFont)`
  font-size: 16px;
  color: var(--neutral-n3);
`
