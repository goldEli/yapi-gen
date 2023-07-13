import styled from '@emotion/styled'

export const MultipleAvatarBox = styled.div<{ width: number }>`
  width: ${props => props.width}px;
  height: 24px;
  display: flex;
  position: relative;
  cursor: pointer;
`
export const MoreIcon = styled.div<{ left: number; show: boolean }>`
  width: 24px;
  height: 24px;
  background: var(--neutral-n7);
  border-radius: 50px 50px 50px 50px;
  opacity: 1;
  color: var(--neutral-n2);
  border: 1px solid var(--neutral-white-d2);
  font-size: 12px;
  box-sizing: border-box;
  display: ${props => (props.show ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: ${props => props.left + 'px'};
`
export const AvatarBox = styled.div<{ left: number }>`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: ${props => props.left + 'px'};
`

export const ItemRow = styled.div`
  width: 240px;
  display: flex;
  alignitems: center;
  cursor: pointer;
`
export const Text = styled.span`
  margin-left: 2px;
  width: 200px;
  display: inline-block;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`
