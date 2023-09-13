/* eslint-disable react/jsx-handler-names */
import ResizeTable from '@/components/ResizeTable'
import PaginationBox from '@/components/TablePagination'
import { ReactElement } from 'react'

interface Props {
  columns: Array<{
    title: string | ReactElement
    dataIndex: string
  }>
  dataSource: Array<{
    // user: string
    // id?: number
  }>
  isSpinning: boolean
  data: {
    currentPage: number
    total: number
    pageSize: number
  }
  paginationShow: boolean
  onChangePage(pageNum: number, pageSize: number): void
}
const Table = (props: Props) => {
  return (
    <>
      <ResizeTable
        isSpinning={false}
        dataWrapNormalHeight="100%"
        col={props.columns}
        dataSource={props.dataSource}
      />
      {props.paginationShow && props?.dataSource?.length ? (
        <PaginationBox
          currentPage={props.data?.currentPage}
          pageSize={props.data?.pageSize}
          total={props.data?.total}
          onChange={(pageNum: number, pageSize: number) =>
            props.onChangePage(pageNum, pageSize)
          }
        />
      ) : null}
    </>
  )
}
export default Table
