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
  max-width: 200px;
  display: inline-block;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`
export const LabelContentWrap = styled.div`
  position: relative;
`
export const DetailWrap = styled.div`
  position: absolute;
  top: 0;
  left: -294px;
  width: 283px;
`
export const HeaderWrap = styled.div`
  height: 70px;
  background: linear-gradient(225deg, #8dd2f6 0%, #6688ff 100%);
  border-radius: 6px 6px 0px 0px;
  padding: 12px;
`
export const Name = styled.div`
  color: var(--neutral-white-d7);
  font-size: 14px;
  display: flex;
  height: 22px;
`
export const BottomWrap = styled.div`
  border-radius: 0px 0px 6px 6px;
  background: var(--neutral-white-d2);
  box-shadow: 0px 0px 15px 6px rgba(0, 0, 0, 0.12);
  padding-bottom: 12px;
`
export const Email = styled.div`
  color: var(--neutral-white-d7);
  align-items: center;
`
export const ItemWrap = styled.div`
  display: flex;
  padding-top: 12px;
  align-items: center;
  font-size: 12px;
  color: var(--neutral-n1-d1);
  padding: 12px 12px 0 12px;
`
