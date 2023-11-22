import CustomSelect from '@/components/CustomSelect'
import styled from '@emotion/styled'

export const EncephalogramBox = styled.div`
  width: calc(100% - 24px);
  height: 100%;
  position: relative;
  cursor: pointer;
  box-sizing: border-box;
  padding: 20px 6px 0px 0px !important;
  margin-left: 24px !important;
  background-color: var(--neutral-white-d1);
  .g6-component-tooltip {
    background-color: rgba(0, 0, 0, 0.7);
    border-radius: 6px;
  }
  .fullscreen-enabled & {
    width: 100%;
    margin: 0;
    padding: 0;
  }
`

export const MapContentBox = styled.div`
  canvas {
    cursor: pointer !important;
  }
  width: 100%;
  height: 100%;
  cursor: pointer;
  background-size: 100%;
  background-repeat: no-repeat;
  background-image: url('https://mj-system-1308485183.cos.ap-chengdu.myqcloud.com/public/mind/dotBg.png');
`
export const TopAreaWrap = styled.div`
  width: 100%;
  box-sizing: border-box;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .ant-breadcrumb {
    width: 20%;
  }
`
export const TopAreaBox = styled.div`
  display: flex;
  flex: 1;
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
  justify-content: space-between;
  .text {
    height: 30px;
    line-height: 30px;
    margin-top: 4px;
    font-size: 14px;
    color: var(--neutral-n1-d1);
  }
  .text:hover {
    cursor: pointer;
    color: var(--auxiliary-text-t2-d2);
  }
`
export const RowTree = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 40px;
  .rowChild {
    width: 70%;
    display: flex;
    align-items: center;
    img {
      width: 32px;
      height: 32px;
      margin-left: 12px;
    }
  }
  .rowChildtext {
    width: 20%;
    font-size: 12px;
    color: var(--neutral-n3);
    text-align: right;
    padding-right: 2px;
  }
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
export const TextTree = styled.div`
  width: 80%;
  font-size: 12px;
  color: var(--neutral-n2);
  margin-left: 12px;
  &:hover {
    cursor: pointer;
  }
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
  max-height:680px;
  overflow-y: scroll;
`
export const HeaderPopover = styled.div`
  display: flex;
  align-items: center;
  height: 56px;
  justify-content: space-between;
`
export const ToolBarBox = styled.div`
  position: absolute;
  bottom: 16px;
  right: 16px;
  display: flex;
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
  .timeRow {
    justify-content: flex-start;
  }
`
export const TextWrap = styled.div`
  font-size: 14px;
  color: var(--neutral-n1-d2);
  padding-bottom: 63px;
`
export const CustomSelectWrap = styled(CustomSelect)`
  min-width: 100px;
`
export const RangePickerWrap = styled.div<{ type: boolean }>(
  {
    height: '32px',
    padding: '0 14px',
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    borderRadius: '6px',
    color: 'var(--auxiliary-text-t2-d1)',
    '.ant-picker': {
      position: 'absolute',
      left: '0px',
      background: 'transparent',
      zIndex: 88,
    },
    '.timeText': {
      position: 'relative',
      right: '-20px',
      background: 'transparent',
      zIndex: 8,
    },
    '&:hover': {
      color: 'var(--auxiliary-text-t2-d2)',
      '.ant-picker-suffix': {
        color: 'var(--auxiliary-text-t2-d2)',
      },
      cursor: 'pointer',
    },
  },
  ({ type }) => ({
    '.timeText': {
      width: type ? '190px' : '52px',
      color: type
        ? 'var(--auxiliary-text-t2-d2)'
        : 'var(--auxiliary-text-t2-d1)',
    },
    '.ant-picker .ant-picker-suffix': {
      color: type
        ? 'var(--auxiliary-text-t2-d2)'
        : 'var(--auxiliary-text-t2-d1)',
    },
    '.ant-picker-clear': {
      background: 'transparent',
    },
    backgroundColor: type ? 'var(--function-tag5)' : 'var(--auxiliary-b4)',
  }),
)
export const PersonMain = styled.div`
  padding-bottom: 12px;
`
export const RightWrap = styled.div<{ type: string }>(
  {
    display: 'flex',
    alignItems: 'center',
    height: '44px',
    background: 'var(--neutral-white-d5)',
    boxShadow: '0px 0px 15px 6px rgba(0, 0, 0, 0.12)',
    borderRadius: '4px',
    '.line': {
      height: '24px',
      borderRight: '1px solid #EBECED',
      marginRight: '20px',
    },
  },
  ({ type }) => ({
    width: type === '1' ? '160px' : '340px',
    padding: type === '2' ? '0 20px' : ' 4px',
    marginRight: type === '1' ? '32px' : '0',
  }),
)
