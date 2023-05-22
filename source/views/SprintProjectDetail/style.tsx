import styled from '@emotion/styled'
import { Space } from 'antd'

export const Wrap = styled.div`
  height: 100%;
  display: flex;
  padding-top: 20px;
  /* padding: 20px 16px 0 24px; */
  flex-direction: column;
`

export const DetailTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 32px;
  padding: 0 24px;
`

export const ButtonGroup = styled(Space)`
  display: flex;
  align-items: center;
`

export const ChangeIconGroup = styled.div`
  /* border: 1px solid var(--neutral-n6-d1); */
  border-radius: 6px;
  box-sizing: border-box;
  height: 32px;
  display: flex;
`

export const NextWrap = styled.div`
  width: 31px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--neutral-white-d4);
  border: 1px solid var(--neutral-n6-d1);
  border-radius: 6px;
  cursor: pointer;
  svg {
    color: var(--neutral-n2);
  }
  &:hover {
    background: var(--hover-d2);
    border: 1px solid var(--hover-d2);
    svg {
      color: var(--primary-d2);
    }
  }
`

export const UpWrap = styled(NextWrap)<{ isOnly?: boolean }>`
  border-right: ${props =>
    props.isOnly ? '1px solid var(--neutral-n6-d1)' : '1px solid transparent'};
  border-top-right-radius: ${props => (props.isOnly ? '6' : '0')}px;
  border-bottom-right-radius: ${props => (props.isOnly ? '6' : '0')}px;
`

export const DownWrap = styled(NextWrap)<{ isOnly?: boolean }>`
  border-left: ${props =>
    props.isOnly ? '1px solid var(--neutral-n6-d1)' : '1px solid transparent'};
  border-top-left-radius: ${props => (props.isOnly ? '6' : '0')}px;
`

export const DetailTitle = styled.div`
  display: flex;
  border-bottom: 1px solid var(--neutral-n6-d1);
  padding: 20px 0px 20px;
  width: calc(100% - 48px);
  margin-left: 24px;
`

export const Img = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 8px;
`

export const DetailText = styled.div`
  flex-wrap: wrap;
  .name {
    font-size: 16px;
    color: var(--neutral-n1-d1);
    margin-right: 16px;
    font-family: SiYuanMedium;
  }
  .icon {
    margin-right: 16px;
    cursor: pointer;
  }
`

export const DetailMain = styled.div`
  display: flex;
  margin-top: 20px;
  padding-right: 24px;
`

export const DetailInfoWrap = styled.div`
  width: 100%;
  height: 100%;
  overflow: auto;
  /* padding: 0 0px 0px 0; */
`

export const InfoItem = styled.div`
  display: flex;
  margin-top: 20px;
  position: relative;
  flex-direction: column;
  width: max-content;
  padding-left: 24px;
`

export const Label = styled.div`
  color: var(--neutral-n1-d1);
  font-size: 14px;
  min-width: 120px;
  font-family: SiYuanMedium;
  margin-bottom: 8px;
`
export const TextWrap = styled.div`
  color: var(--neutral-n1-d1);
  font-size: 14px;
  display: 'flex';
  flex-direction: column;
  img: {
    max-width: 20%;
  }
`
