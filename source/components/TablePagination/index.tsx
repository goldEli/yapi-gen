import styled from '@emotion/styled'
import { Pagination } from 'antd'

interface PropType {
  total: number
  pageSize: number
  onChange(page: number, pageSize: number): void
}
const PaginationWrap = styled(Pagination)`
  width: 100%;
  height: 64px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  .ant-pagination-total-text {
    font-size: 12px;
    font-weight: 400;
    color: var(--neutral-n2);
  }
  .ant-pagination-disabled .ant-pagination-item-link,
  .ant-pagination-disabled:hover .ant-pagination-item-link,
  .ant-pagination-item,
  .ant-pagination-item-link {
    border: none;
    background-color: var(--neutral-white-d1);
    color: var(--neutral-n2);
  }
  .ant-select:not(.ant-select-customize-input) .ant-select-selector,
  input {
    background-color: var(--neutral-white-d1);
    color: var(--neutral-n2);
    border: 1px solid var(--neutral-white-d4);
  }
  .ant-pagination-item,
  .ant-select-selection-item,
  .ant-pagination-options-quick-jumper {
    font-size: 14px;
    font-weight: 400;
    color: var(--neutral-n2);
  }
  .anticon {
    color: var(--neutral-n4);
  }
  .ant-pagination-item-active,
  .ant-pagination-item-active:hover a {
    color: var(--primary-d2);
  }
`
const PaginationBox = (props: PropType) => {
  return (
    <>
      <PaginationWrap
        total={props.total}
        pageSize={props.pageSize}
        showSizeChanger
        showQuickJumper
        onChange={(page: number, pageSize: number) =>
          props.onChange(page, pageSize)
        }
        showTotal={(total: number) => `共 ${total} 条`}
      />
    </>
  )
}
export default PaginationBox
