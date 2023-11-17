import styled from '@emotion/styled'

export const EncephalogramBox = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  padding: 24px;
`

export const MapContentBox = styled.div`
  width: 100%;
  height: 100%;
  border: 1px solid red;
`
export const TopAreaBox = styled.div`
  width: 100%;
  height: 108px;
  display: flex;
`
export const TypeBox = styled.div`
  min-width: 312px;
  height: 44px;
  padding: 12px 20px;
  background: var(--neutral-white-d1);
  box-shadow: 0px 0px 15px 6px rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  display: flex;
  justify-content: space-between;

`
export const Row = styled.div`
  display: flex;
  align-items: center;
`

export const Bgc = styled.div<{ color: string }>(
  {
    width: '12px',
    height: '12px',
  },
  ({ color }) => ({
    background: color,
  }),
)
export const Text = styled.span`
  font-size: 12px;
  color: var(--neutral-n2);
  margin-left: 4px;
`
export const TypeSelectBox = styled.div`
  background: var(--neutral-white-d1);
  box-shadow: 0px 0px 15px 6px rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  display: flex;
  height: 44px;
  padding: 6px 20px;
  margin-left: 32px;
`
export const PopoverBtn = styled.div`
  background-color: var(--auxiliary-b4);
  color: var(--auxiliary-text-t2-d1);
  padding: 5px 12px;
  border-radius: 6px;
  font-size: 14px;
  &:hover {
    color: var(--auxiliary-text-t2-d2);
    cursor: pointer;
  }
`
export const Content = styled.div`
  padding: 0 24px;
  width: 360px;
`
export const HeaderPopover = styled.div`
  display: flex;
  align-items: center;
  height: 56px;
  justify-content: space-between;
`
export const ToolBarBox = styled.div`
  position: absolute;
  bottom: 20px;
  left: 0px;
`
export const MianHeader = styled.div`
  display: flex;
  height: 48px;
  align-items: center;
  justify-content: space-between;
  .leftWrap {
    display: flex;
    align-items: center;
  }
  img {
    width: 48px;
    height: 48px;
    margin-right: 12px;
  }
`
export const Title = styled.div`
  font-size: 16px;
  font-family: SiYuanRegular;
  color: var(--neutral-n1-d1);
`
export const Msg = styled.div`
  font-size: 14px;
  color: var(--neutral-n2);
`
export const HeaderMsg = styled.div``
export const Type = styled.div<{ color: string; bgc: string }>(
  {
    minWidth: '72px',
    height: '22px',
    borderRadius: '2px',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    color: 'var(--neutral-n1-d1)',
    padding: '0 8px',
  },
  ({ bgc, color }) => ({
    background: bgc,
    '.border': {
      width: '6px',
      height: '6px',
      borderRadius: '50%',
      background: color,
      marginRight: 8,
    },
  }),
)
export const CenterWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  .col {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .col span:nth-child(1) {
    font-size: 20px;
    font-family: SiYuanRegular;
    font-weight: 500;
  }
  .col span:nth-child(2) {
    font-size: 12px;
    color: var(--neutral-n3);
  }
`
export const TimeWrap = styled.div`
  width: 312px;
  min-height: 64px;
  background: #f5f5f7;
  margin-bottom: 24px;
  padding: 8px 12px;
  .timeRow span:nth-child(1) {
    font-size: 14px;
    color: var(--neutral-n3);
  }
  .timeRow span:nth-child(2) {
    font-size: 14px;
    color: var(--neutral-n1-d2);
  }
`
export const TextWrap = styled.div`
  font-size: 14px;
  color: var(--neutral-n1-d2);
  padding-bottom: 63px;
`
