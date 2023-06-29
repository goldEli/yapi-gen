import styled from '@emotion/styled'

export const Side = styled.div<{ op: boolean }>`
  white-space: nowrap;
  overflow-y: scroll;
  opacity: ${props => (props.op ? '1' : '0')};
  width: 320px;
  width: ${props => (props.op ? '320px' : '0px')};
  position: relative;
  /* left: ${props => (props.op ? '0px' : '-320px')};
  top: 0; */
  height: 100%;
  background-color: var(--neutral-n8);
  transition: all 0.5s;
  flex-shrink: 0;
  box-sizing: border-box;
  padding: 24px;
  padding-right: 0px;
  .t1 {
    height: 22px;
    font-size: 14px;
    color: var(--neutral-n1-d1);
    line-height: 22px;
  }
  .btn {
    position: absolute;
    bottom: 24px;
    right: 24px;
  }
`
export const Liu = styled.div`
  /* height: 52px; */
  padding: 10px 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 16px;
  .l1 {
    height: 22px;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 6px;
    color: var(--neutral-n1-d1);
    line-height: 22px;
  }
  .l2 {
    height: 22px;
    font-size: 14px;
    white-space: pre-wrap;
    color: var(--auxiliary-text-t2-d1);
    line-height: 22px;
  }
`
export const People = styled.div`
  height: 42px;
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 16px;
  .p2 {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .p11 {
      height: 22px;
      font-size: 14px;

      color: var(--neutral-n1-d1);
      line-height: 22px;
    }
    .p12 {
      height: 20px;
      font-size: 12px;

      color: var(--neutral-n3);
      line-height: 20px;
    }
  }
`
export const ScaleDiv = styled.div<{ hi: boolean }>`
  transition: all 0.8s;
  overflow: hidden;
  opacity: ${props => (props.hi ? '0' : '1')};

  height: ${props => (props.hi ? '0px' : 'auto')};
`
