import { Pagination } from 'antd'
import { useTranslation } from 'react-i18next'

interface PropType {
  total: number
  pageSize: number
  currentPage?: number
  onChange(page: number, pageSize: number): void
  hasPadding?: boolean
}

const PaginationBox = (props: PropType) => {
  const [t] = useTranslation()
  return (
    <div
      style={{
        paddingRight: props.hasPadding ? 0 : '16px',
      }}
      className="pagination-box"
    >
      <Pagination
        hideOnSinglePage
        current={props.currentPage}
        defaultCurrent={1}
        total={props.total}
        pageSizeOptions={['10', '20', '50']}
        pageSize={props.pageSize || 20}
        showSizeChanger
        showQuickJumper
        onChange={(page: number, pageSize: number) =>
          props.onChange(page, pageSize)
        }
        showTotal={total => t('common.tableTotal', { count: total })}
      />
    </div>
  )
}

export default PaginationBox
