import styled from '@emotion/styled'
import { Table, Pagination } from 'antd'

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
export { TableWrap, StylePagination }
