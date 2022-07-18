import styled from '@emotion/styled'
import { css } from '@emotion/css'
import { Table, Pagination, Input } from 'antd'

const TableWrap = styled(Table)({
  '.ant-table-thead > tr > th:nth-child(1)': {
    paddingLeft: 64,
  },
  '.ant-table table': {
    paddingBottom: 10,
  },
})

const StylePagination = styled(Pagination)`
  margin-top: auto;
  align-self: end;
  padding: 8px 0;
  .ant-pagination-prev button,
  .ant-pagination-next button {
    border: none;
  }
  .ant-pagination-item {
    border-radius: 32px;
    border: none;
  }
  .ant-pagination-item:hover {
    background: #f0f4fa;
    a {
      color: #2877ff !important;
    }
  }
  .ant-pagination-item-active {
    background: #2877ff;
    a {
      color: #ffffff !important;
    }
  }
`
const StaffHeader = styled.div`
  color: rgba(0, 0, 0, 1);
  font-weight: 400;
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
  height: 52px;
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
  padding: 16px;
  background: #f5f7fa;
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
  border: none;
  input {
    background: rgba(245, 246, 247, 1);
    &::placeholder {
      font-size: 14px;
    }
  }
`
const SearchLine = styled.div`
  height: 64px;
  background: rgba(255, 255, 255, 1);
`
const SetButton = styled.div`
  text-align: center;
  width: 52px;
  height: 20px;
  border-left: 1px solid #d5d6d9;
  color: #bbbdbf;
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
      color: `${isActive ? '#2877FF' : '#323233'}`,
      borderBottom: `2px solid ${isActive ? '#2877FF' : 'white'}`,
    },
  }),
)
const LabNumber = styled.div<{ isActive: boolean }>`
  margin-left: 4px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  color: ${({ isActive }) => (isActive ? '#2877ff' : 'rgba(150, 151, 153, 1)')};
  background: ${({ isActive }) =>
    isActive ? '#f0f4fa' : 'rgba(242, 242, 244, 1)'};
`
const tabCss = css`
  display: flex;
  align-items: center;
  margin-right: 32px;
`
const SwiperWrap = styled.div<{ width: number }>`
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding: 0 24px;
  height: 144px;
  background-color: #f5f7fa;
  overflow: hidden;
  & .swiper {
    overflow: visible;
  }
  & .swiper-wrapper {
    max-width: 1400px;
    width: 100%;
  }
  & .swiper-slide {
    width: auto !important;
  }
`
export {
  TableWrap,
  StylePagination,
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
}
