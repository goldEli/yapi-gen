import styled from '@emotion/styled'
export const Wrap = styled.div`
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
`
export const Header = styled.div`
  height: 64px;
  opacity: 1;
  position: sticky;
  top: 0;
  z-index: 99;
  width: 100%;

  img {
    height: 64px;
  }
  span {
    position: absolute;
    right: 40px;
    top: 24px;
    color: #969799;
    font-size: 14px;
  }
`
export const Content = styled.div<{ windowWidth: number }>`
  margin: ${props =>
    props.windowWidth <= 1440
      ? ' 0px calc(50% - 544px)'
      : '0px calc(50% - 682px)'};
  box-sizing: border-box;
  background: #fff;
`
export const InputBox = styled.div`
  padding-top: 32px;
  box-sizing: border-box;
  position: sticky;
  top: 60px;
  background: #fff;
  padding-bottom: 32px;
  z-index: 9;
  .title-box {
    text-align: center;
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
    .title {
      width: 205px;
      height: 52px;
      font-size: 40px;
      font-family: SiYuanMedium;
      line-height: 52px;
      background: linear-gradient(135deg, #ae62ff 0%, #48fad1 100%);
      background-clip: text;
      text-fill-color: transparent;
      text-align: center;
    }
  }
  .sub-title {
    height: 34px;
    font-size: 26px;
    font-family: SiYuanMedium;
    color: #323233;
    line-height: 30px;
    text-align: center;
    margin-top: 12px;
    margin-left: 12px;
  }
  .input {
    margin: auto;
    background-image: linear-gradient(
      112deg,
      rgba(174, 98, 255, 1),
      rgba(116, 185, 229, 1)
    );
    border-radius: 12px;
    position: relative;
    width: 50vw;
    height: 52px;
    position: sticky;
    top: 100px;
    z-index: 999;
    .ant-input-affix-wrapper {
      border: 0;
      border-radius: 10px;
      margin-left: 2px;
      margin-top: 2px;
      width: calc(100% - 4px);
      height: calc(100% - 4px);
      &:focus {
        box-shadow: none;
      }
      .ant-input-clear-icon {
        font-size: 20px;
      }
    }
    .ant-input {
      border: 0;
      border-radius: 10px;
      margin-left: 2px;
      margin-top: 2px;
      width: calc(100% - 4px);
      height: calc(100% - 4px);
      &:focus {
        box-shadow: none;
      }
    }
  }
`
export const ImageBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
  /* border: 1px solid red; */
  .image-box {
    border-radius: 16px 16px 16px 16px;
    opacity: 1;
    display: flex;
    flex-direction: column;
    margin-bottom: 24px;
    /* border: 1px solid red; */
    /* flex: 1; */
    cursor: pointer;
    img {
      width: 260px;
      height: 174px;
      border-radius: 16px;
    }
    .text {
      font-size: var(--font16);
      font-family: SiYuanMedium;
      height: 42px;
      display: flex;
      align-items: center;
      padding-left: 12px;
    }
    &:hover {
      transform: scale(1.02) translateY(-12px);
      position: relative;
    }
    transition: 0.3s ease;
  }
`

export const DetailWrap = styled.div`
  .content {
    text-align: center;
    margin: auto;
    width: 872px;
    height: 584px;
    border-radius: 16px 16px 16px 16px;
    margin-top: 32px;
    .title {
      color: var(--neutral-n1-d1);
      font-size: 26px;
      font-family: SiYuanMedium;
      margin-bottom: 48px;
    }
  }
`
export const Bread = styled.div`
  margin-top: 20px;
  padding-left: 24px;
  .back {
    color: #6688ff;
  }
  .devide {
    color: #bbbdbf;
    margin: 0px 8px;
  }
  .text {
    color: #969799;
    font-size: 14px;
  }
`
