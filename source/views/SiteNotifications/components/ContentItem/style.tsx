import styled from '@emotion/styled'

export const Time2 = styled.div`
  height: 20px;
  font-size: 12px;
  font-family: PingFang SC-Regular, PingFang SC;
  font-weight: 400;
  color: var(--neutral-n4);
  line-height: 20px;
  margin-left: auto;
  display: none;
  .ant-checkbox .ant-checkbox-inner {
    border-radius: 50% !important;
  }
  /* .ant-checkbox:hover::after,
  .ant-checkbox-wrapper:hover .ant-checkbox::after {
    visibility: hidden;
  } */
`
export const Time = styled.div`
  height: 20px;
  font-size: 12px;
  font-family: PingFang SC-Regular, PingFang SC;
  font-weight: 400;
  color: var(--neutral-n4);
  line-height: 20px;
  margin-left: auto;
`

export const Wrap = styled.div<{ greps?: boolean; bor?: boolean }>`
  border: ${props =>
    props.bor ? '1px solid var(--neutral-n6-d1)' : '1px solid transparent'};
  cursor: pointer;
  margin: 0 12px;
  padding: 12px;
  display: flex;
  border-radius: 6px 6px 6px 6px;
  transition: all 0.3s;
  /* filter: ${props => (props.greps ? 'grayscale(250%)' : '')}; */
  /* box-shadow: ${props =>
    props.greps ? '0px 0px 10px 1px rgba(0, 0, 0, 0.12)' : ''}; */
  /* filter: drop-shadow(5px 5px 5px black);
  filter: saturate(50%);  */
  :hover {
    .dsds-my {
      text-decoration: underline;
    }
    border: 1px solid transparent;
    background-color: var(--neutral-n8);
    /* box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.12); */
    ${Time2} {
      display: block;
    }
    ${Time} {
      display: none;
    }
  }
`
export const Wrap2 = styled.div`
  padding: 12px;
  display: flex;
  border-radius: 6px 6px 6px 6px;
  transition: all 0.3s;
  filter: grayscale(150%);

  :hover {
    box-shadow: 0px 0px 15px 6px rgba(0, 0, 0, 0.12);
  }
`

export const Name = styled.div`
  height: 22px;
  font-size: 14px;
  font-family: SiYuanMedium;
  font-weight: 400;
  color: var(--neutral-n1-d1) !important;
  line-height: 22px;
  margin-right: 8px;
`

export const Tip = styled.div`
  height: 20px;
  font-size: 12px;
  font-family: PingFang SC-Regular, PingFang SC;
  font-weight: 400;
  color: var(--neutral-n3);
  line-height: 20px;
`

export const About = styled.div`
  height: 20px;
  font-size: 14px;
  font-family: PingFang SC-Regular, PingFang SC;
  font-weight: 400;
  line-height: 20px;

  color: var(--neutral-n3) !important;
`

export const GrepContent = styled.div<{ status?: boolean }>`
  word-break: break-all;
  font-size: 12px;
  font-family: PingFang SC-Regular, PingFang SC;
  font-weight: 400;
  line-height: 20px;
  margin-left: -9px;
  margin-top: -9px;
  /* background-color: var(--neutral-n8); */
  border-radius: 6px 6px 6px 6px;
  color: ${(props: any) =>
    props.status ? 'var(--neutral-n4)' : 'var(--neutral-n1-d1)'};
  a {
    color: var(--auxiliary-text-t1-d2);
  }
`

export const HoverWrap = styled.div`
  flex: 1;
  .msgTitle {
    display: flex;
    align-items: center;
    margin: 5px 0px 0px 0px;
  }
  .read {
    color: var(--neutral-n4) !important;
  }
  .unread {
    color: var(--neutral-n2);
  }
`
