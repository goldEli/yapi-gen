import styled from '@emotion/styled'

export const Tips = styled.div`
  font-size: 12px;
  line-height: 20px;
  color: var(--neutral-n3);
  margin-bottom: 24px;
`
export const WarnTips = styled.div`
  width: 100%;
  height: 36px;
  box-sizing: border-box;
  padding-left: 16px;
  background-color: var(--function-tag4);
  display: flex;
  align-items: center;
  color: var(--neutral-n2);
  margin-bottom: 24px;
`

export const CopyButton = styled.div`
  width: 112px;
  height: 32px;
  border-radius: 6px 6px 6px 6px;
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  padding: 0 16px;
  align-items: center;
  color: var(--auxiliary-text-t2-d1);
  position: absolute;
  bottom: 24px;
  left: 0px;
  cursor: pointer;
  z-index: 99;
  &:hover {
    color: var(--primary-d1);
  }
`

export const GetCopyButton = styled.div`
  width: 112px;
  height: 32px;
  border-radius: 6px 6px 6px 6px;
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  padding: 0 16px;
  align-items: center;
  color: var(--auxiliary-text-t2-d1);
  position: absolute;
  bottom: 24px;
  left: 0px;
  cursor: pointer;
  z-index: 99;
  &:hover {
    color: var(--primary-d1);
  }
`
export const LoadingButton = styled.div`
  width: 109px;
  height: 32px;
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  padding: 0 16px;
  align-items: center;
  position: absolute;
  bottom: 24px;
  left: 0px;
  z-index: 99;
  color: var(--primary-d1);
`
export const loadingImage = styled.img`
  width: 16px;
  height: 16px;
`

export const ModalContentBox = styled.div`
  padding: 0 24px;
`
