import { css } from '@emotion/css'
import styled from '@emotion/styled'
import { Form, Modal } from 'antd'
import IconFont from '@/components/IconFont'

export const ModalWrap = styled(Modal)`
  .ant-modal {
    top: 0 !important;
  }
  height: ${window.innerWidth <= 1440 ? '663px' : '708px'};
  overflow: hidden;
  border-radius: 0 0 6px 6px;
  .ant-modal-body: {
    padding: 0;
  }
  .ant-modal-close {
    display: none;
  }
`
export const HeaderWrap = styled.div`
  width: 100%;
  height: 56px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .title {
    font-weight: 500;
    font-size: 16px;
    font-family: SiYuanMedium;
  }
`
export const Title = styled.div`
  height: 28px;
  font-size: 20px;
  color: var(--neutral-n1-d1);
  line-height: 28px;
  font-family: SiYuanMedium;
  margin-bottom: ${window.innerWidth <= 1440 ? '40px' : '24px'};
  margin-top: ${window.innerWidth <= 1440 ? '66px' : '104px'};
  padding: 0 72px;
`
export const ProjectWrap = styled.div`
  height: 100%;
`
export const MainProjectType = styled.div`
  height: calc(708px - 56px);
  overflow: auto;
`
export const Wrap = styled.div<{ type: number; hover: number }>`
  width: 320px;
  height: 262px;
  background: var(--neutral-white-d1);
  border-radius: 12px;
  border: 1px solid
    ${props =>
      props.type === 2 && props.hover === 2
        ? '#FA9746'
        : props.type === 1 && props.hover === 1
        ? '#6688FF'
        : '#ecedef'};
  position: relative;
  transition: all 0.5s;
  :hover {
    border: 1px solid ${props => (props.hover === 2 ? '#FA9746' : '#6688FF')};
    transform: translateY(-10px);
    box-shadow: 0px 0px 15px 6px rgba(0, 0, 0, 0.12);
    cursor: pointer;
  }
  img {
    height: 160px;
    border-radius: 12px 12px 0 0;
    -webkit-user-drag: none;
  }
`
export const Footer = styled.div`
  height: 102px;
  padding: 16px;
  .title {
    font-weight: 500;
    font-size: 18px;
    font-family: SiYuanMedium;
    color: var(--neutral-n1-d1);
    margin-bottom: 8px;
  }
  .msg {
    font-size: 14px;
    font-weight: 400;
    color: var(--neutral-n2);
  }
`
export const FooterBtn = styled.div`
  height: 80px;
  padding: 0 24px;
  display: flex;
  justify-content: end;
  align-items: center;
`
export const IconFontWrap = styled(IconFont)`
  color: var(--neutral-n1-d1);
  font-size: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  :hover {
    background: #f3f3f5;
    cursor: pointer;
  }
`

export const OpacityDiv = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, 0%);
  transition: all 0.8s;
`
export const CoverAreaWrap = styled.div`
  box-sizing: content-box;
  width: 368px;
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
export const UploadFileIconWrap = styled.div`
  padding: 0 24px;
`
export const CreateFormWrap = styled.div`
  height: ${window.innerWidth <= 1440 ? '663px' : '708px'};
`
export const MainWrap = styled.div`
  display: flex;
  height: calc(708px - 56px);
  overflow-x: hidden;
  overflow-y: auto;
`
export const FormWrap = styled(Form)`
  width: 416px;
  padding: 0 24px;
  border-left: 1px solid var(--neutral-n6-d2);
  .ant-form-item {
    margin-bottom: ${window.innerWidth <= 1440 ? '16px' : '24px'};
  }
`
export const RightWrap = styled.div``