/* eslint-disable @typescript-eslint/naming-convention */
import styled from '@emotion/styled'
import { css } from '@emotion/css'
import { Table, Pagination, Input, Slider } from 'antd'

const HiddenText = styled.div<{ width?: number }>(
  {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  ({ width }) => ({
    width,
  }),
)

const StepBoxWrap = styled.div<{ active?: boolean }>(
  {
    display: 'flex',
    alignItems: 'center',
    fontWeight: 500,
    fontSize: 14,
    '.circle': {
      color: 'white',
      width: 27,
      height: 27,
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    span: {
      marginLeft: 5,
    },
  },
  ({ active }) => ({
    '.circle': {
      background: active ? '#2877ff' : '#BBBDBF',
      border: active ? '3px solid #F0F4FA' : '3px solid white',
    },
    span: {
      color: active ? '#2877ff' : '#646566',
    },
  }),
)

const ProgressWrap = styled.div({
  background: 'white',
  padding: '16px 24px',
  borderRadius: 6,
})

const SliderWrap = styled(Slider)({
  margin: '0!important',
  '.ant-slider-track,.ant-slider-step,.ant-slider-rail': {
    height: '8px!important',
  },
  '.ant-slider-rail': {
    backgroundColor: '#F2F2F4!important',
    borderRadius: 10,
  },
  '.ant-slider-track': {
    backgroundColor: '#43BA9A!important',
  },
  '.ant-slider-handle': {
    width: 20,
    height: 20,
    border: '1px solid #EBEDF0!important',
    marginTop: -7,
    '&: hover': {
      border: '1px solid #2877FF!important',
    },
  },
  '.ant-slider-handle:focus': {
    boxShadow: 'none',
  },
})

const NameWrap = styled.div({
  width: 32,
  height: 32,
  borderRadius: 16,
  background: '#A4ACF5',
  color: 'white',
  fontSize: 12,
  fontWeight: 400,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 4,
  overflow: 'hidden',
})

const ViewWrap = styled.div<{ color: string }>(
  {
    height: 22,
    borderRadius: 6,
    padding: '0 8px',
    marginRight: 8,
    lineHeight: '20px',
    fontSize: 12,
    fontWeight: 400,
    width: 'fit-content',
    background: 'white',
  },
  ({ color }) => ({
    color,
    border: `1px solid ${color}`,
  }),
)

const CategoryWrap = styled.div<{ color: string; bgColor: string }>(
  {
    height: 22,
    borderRadius: 11,
    padding: '0 8px',
    marginRight: 8,
    lineHeight: '22px',
    fontSize: 12,
    fontWeight: 400,
    marginLeft: 8,
  },
  ({ color, bgColor }) => ({
    background: bgColor,
    color,
  }),
)

const ClickWrap = styled.div<{ isClose?: boolean; isName?: boolean }>(
  {
    cursor: 'pointer',
    '&: hover': {
      color: '#2877ff',
    },
  },
  ({ isClose, isName }) => ({
    color: isClose ? '#969799' : '',
    textDecoration: isName && isClose ? 'line-through' : '',
  }),
)

const TableWrap = styled(Table)({

  // '.ant-table-thead > tr > th:nth-child(1)': {
  //   paddingLeft: 64,
  // },
  // '.ant-table-tbody > tr > td:nth-child(1)': {
  //   paddingLeft: 64,
  // },
  '.ant-table table': {
    paddingBottom: 10,
  },
})

const StaffHeader = styled.div`
  color: rgba(0, 0, 0, 1);
  font-weight: bold;
  display: flex;
  align-items: center;
  padding-left: 24px;
  font-size: 16px;
  height: 64px;
  background: rgba(255, 255, 255, 1);
`
const Hehavior = styled.div`
  display: flex;
  justify-content: space-between;
  color: rgba(255, 255, 255, 1);
  font-size: 14px;
  height: 52px;
  background: rgba(255, 255, 255, 1);
  align-items: center;
  border-bottom: 1px solid #f8f9fb;
`
const TabsHehavior = styled.div`
  display: flex;
  color: rgba(255, 255, 255, 1);
  font-size: 14px;
  height: 65px;
  background: rgba(255, 255, 255, 1);
  align-items: center;
  box-sizing: border-box;
  padding-left: 24px;
`
const PaginationWrap = styled.div`
  height: 64px;
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  padding-right: 16px;
`
const StaffTableWrap = styled.div`
  overflow-y: scroll;
  box-sizing: border-box;
  padding: 16px 24px;
  background: #f5f7fa;
`
const StaffTableWrap2 = styled(StaffTableWrap)`
  padding-top: 0;
`
const MyInput = styled(Input)`
  font-size: 14px;
  width: 240px;
  height: 32px;
  background: rgba(245, 246, 247, 1);
  background-blend-mode: normal;
  mix-blend-mode: normal;
  display: flex;
  justify-content: flex-start;
  margin-left: 24px;
  padding: 5px 12px 5px 12px;
  border: 1px solid white;
  input {
    background: rgba(245, 246, 247, 1);
    &::placeholder {
      font-size: 14px;
    }
  }
`
const SearchLine = styled.div`
  box-sizing: border-box;
  padding: 16px 0;
  display: flex;
  gap: 16px;
  padding-left: 24px;
  min-height: 64px;
  background: rgba(255, 255, 255, 1);
`
const SetButton = styled.div<{ show?: boolean }>`
  cursor: pointer;
  text-align: center;
  width: 52px;
  height: 20px;
  border-left: 1px solid #d5d6d9;
  color: #bbbdbf;
  color: ${({ show }) => show ? ' rgba(40, 119, 255, 1)' : ''};
  &:hover {
    color: rgba(40, 119, 255, 1);
  }
`
const TabsItem = styled.div<{ isActive: boolean }>(
  {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    cursor: 'pointer',
    div: {
      fontSize: 16,
      fontWeight: 400,
      height: 62,
      lineHeight: '62px',
    },
  },
  ({ isActive }) => ({
    div: {
      color: String(isActive ? '#2877FF' : '#323233'),
      borderBottom: `3px solid ${isActive ? '#2877FF' : 'white'}`,
    },
  }),
)
const LabNumber = styled.div<{ isActive: boolean }>`
  margin-left: 12px;
  height: 20px;
  min-width: 20px;
  padding: 0 6px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;

  color: ${({ isActive }) => isActive ? 'white' : 'rgba(150, 151, 153, 1)'};
  background: ${({ isActive }) => isActive ? '#2877ff' : 'rgba(242, 242, 244, 1)'};
`
const tabCss = css`
  display: flex;
  align-items: center;
  margin-right: 32px;
`
const SwiperWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: start;
  box-sizing: border-box;
  padding: 0 24px;
  height: 144px;
  background-color: #f5f7fa;
  overflow: hidden;
  & .swiper {
    overflow: visible;
    margin: 0;
  }
  & .swiper-wrapper {
    max-width: 1400px;
    width: 100%;
    display: flex;
  }
  & .swiper-slide {
    width: auto !important;
  }
`
const titleCss = css`
  color: rgba(0, 0, 0, 1);
  font-size: 14px;
  font-weight: bold;
`
const title1Css = css`
  color: rgba(40, 119, 255, 1);
  font-size: 24px;
`
const title2Css = css`
  color: rgba(100, 101, 102, 1);
  font-size: 12px;
`
const chartsTitle = css`
  color: rgba(100, 101, 102, 1);
  font-size: 12px;
  margin-bottom: 10px;
`
const ChartsWrap = styled.div`
  background-color: #ffffff;
  box-sizing: border-box;
  padding: 16px 24px;
  border-radius: 6px;
`
const HomeWrap = styled.div`
  height: 104px;
  border: 1px solid rgba(235, 237, 240, 1);
  border-radius: 6px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  flex: 1;
`
const ChartsItem = styled.span`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`
const ShowWrap = styled.div`
  visibility: hidden;
`
const StyledTable = styled(Table)({
  '.ant-table-row:hover': {
    [ShowWrap.toString()]: {
      visibility: 'visible',
    },
  },
  '.ant-table-thead > tr > th:nth-child(1)': {
    paddingLeft: 64,
  },
  '.ant-table table': {
    paddingBottom: 10,
  },
})
const SecondTitle = styled.span`
  padding-left: 8px;
  border-left: 3px solid #2877ff;
  color: rgba(0, 0, 0, 1);
  font-size: 16px;
  font-weight: bold;
  line-height: 20px;
`
const TextWrap = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  margin-top: 16px;
`
const TextBlueWrap = styled.div`
  width: 104px;
  height: 104px;
  background: rgba(205, 221, 253, 0.3);
  background-blend-mode: normal;
  border-radius: 6px;
  display: flex;
  margin-right: 24px;
  justify-content: center;
  align-items: center;
`
const HightChartsWrap = styled.div`
  height: 350px;
`
const StyledShape = styled.div<{ color: any }>`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  padding: 1px 8px 1px 8px;
  width: 60px;
  height: 25px;
  background: rgba(255, 255, 255, 1);
  background-blend-mode: normal;
  border: 1px solid rgba(235, 237, 240, 1);
  border-radius: 6px;
  text-align: center;
  border: 1px solid rgba(40, 119, 255, 1);
  border-color: ${({ color }) => color};
  color: ${({ color }) => color};
  cursor: pointer;
`
const StatusWrap = styled.div<{ isShow?: boolean }>(
  {
    height: 22,
    borderRadius: 6,
    padding: '0 8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid #2877FF',
    color: '#2877FF',
    width: 'fit-content',
  },
  ({ isShow }) => ({
    cursor: isShow ? 'pointer' : 'inherit',
  }),
)

const PriorityWrap = styled.div<{ status?: any }>({
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  height: 26,
  padding: '0 6px',
  width: 'fit-content',
  borderRadius: 6,
  div: {
    color: '#323233',
    fontSize: 14,
    marginLeft: 8,
  },
  '.icon': {
    marginLeft: 8,
    visibility: 'hidden',
    fontSize: 16,
    color: '#2877ff',
  },
  '.priorityIcon': {
    fontSize: 16,
    svg: {
      margin: '0!important',
    },
  },
  '&: hover': {
    background: 'rgba(240, 244, 250, 1)',
    '.icon': {
      visibility: 'visible',
    },
  },
})

export {
  PriorityWrap,
  StatusWrap,
  StaffTableWrap2,
  StyledShape,
  HightChartsWrap,
  TextWrap,
  TextBlueWrap,
  SecondTitle,
  TableWrap,
  StaffHeader,
  Hehavior,
  PaginationWrap,
  StaffTableWrap,
  MyInput,
  SearchLine,
  SetButton,
  TabsHehavior,
  TabsItem,
  LabNumber,
  tabCss,
  SwiperWrap,
  titleCss,
  title1Css,
  title2Css,
  chartsTitle,
  ChartsWrap,
  HomeWrap,
  ChartsItem,
  ShowWrap,
  StyledTable,
  ClickWrap,
  CategoryWrap,
  ViewWrap,
  NameWrap,
  SliderWrap,
  ProgressWrap,
  StepBoxWrap,
  HiddenText,
}
