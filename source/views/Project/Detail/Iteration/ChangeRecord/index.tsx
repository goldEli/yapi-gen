/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable multiline-ternary */
/* eslint-disable react/no-danger */
/* eslint-disable @typescript-eslint/naming-convention */
import { Table, Pagination, Modal, Space } from 'antd'
import { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { PaginationWrap } from '@/components/StyleCommon'
import { useModel } from '@/models'
import { useSearchParams } from 'react-router-dom'

const TitleWrap = styled(Space)({
  height: 40,
  background: '#F8F9FA',
  padding: '0 24px',
  borderRadius: 6,
  color: '#323233',
  fontSize: 14,
  marginBottom: 24,
})

const ChangeRecord = () => {
  const { getIterateChangeLog } = useModel('iterate')
  const [visible, setVisible] = useState(false)
  const [searchParams] = useSearchParams()
  const iterateId = searchParams.get('iterateId')
  const projectId = searchParams.get('id')
  const [dataList, setDataList] = useState<any>([])
  const [checkDetail, setCheckDetail] = useState<any>({})

  const getList = async () => {
    const result = await getIterateChangeLog({
      iterateId,
      projectId,
      pageSize: 10,
      page: 1,
      order: 'id',
      orderKey: 'asc',
    })
    setDataList(result)
  }

  useEffect(() => {
    getList()
  }, [])

  const onClickCheck = (item: any) => {
    setCheckDetail(item)
    setVisible(true)
  }

  const columns = [
    {
      title: '序号',
      dataIndex: 'id',
    },
    {
      title: '变更时间',
      dataIndex: 'updateTime',
    },
    {
      title: '变更人',
      dataIndex: 'userName',
    },
    {
      title: '变更类型',
      dataIndex: 'type',
      render: (text: any) => {
        return <div>{text.content}</div>
      },
    },
    {
      title: '变更字段',
      dataIndex: 'fields',
      render: (text: []) => {
        return (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '16px 0',
            }}
          >
            {text.map(i => <span key={i}>{i}</span>)}
          </div>
        )
      },
    },
    {
      title: '变更前',
      dataIndex: 'beforeField',
      render: (text: any, record: any) => {
        return (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '16px 0',
            }}
          >
            {record.fields.map((i: any) => <span key={i}>{text[i]}</span>)}
          </div>
        )
      },
    },
    {
      title: '变更后',
      dataIndex: 'afterField',
      render: (text: any, record: any) => {
        return (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '16px 0',
            }}
          >
            {record.fields.map((i: any) => (
              <span key={i}>
                {i === 'info' ? (
                  <span
                    style={{ cursor: 'pointer', color: '#2877ff' }}
                    onClick={() => onClickCheck(record)}
                  >
                    查看详情
                  </span>
                )
                  : <span>{text[i]}</span>
                }
              </span>
            ))}
          </div>
        )
      },
    },
  ]

  const onChangePage = () => {

    //
  }

  const onShowSizeChange = () => {

    //
  }
  return (
    <div>
      <Modal
        visible={visible}
        title="变更详情"
        footer={false}
        width={1080}
        onCancel={() => setVisible(false)}
        bodyStyle={{ padding: '8px 24px 24px' }}
        destroyOnClose
      >
        <Space size={32} style={{ display: 'flex' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <TitleWrap>变更前</TitleWrap>
            <div
              dangerouslySetInnerHTML={{
                __html: checkDetail?.beforeField?.info,
              }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <TitleWrap>变更后</TitleWrap>
            <div
              dangerouslySetInnerHTML={{
                __html: checkDetail?.afterField?.info,
              }}
            />
          </div>
        </Space>
      </Modal>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={dataList?.list}
        pagination={false}
        scroll={{ x: 'max-content' }}
        showSorterTooltip={false}
      />
      <PaginationWrap>
        <Pagination
          defaultCurrent={1}
          current={dataList?.currentPage}
          showSizeChanger
          showQuickJumper
          total={dataList?.total}
          showTotal={total => `Total ${total} items`}
          pageSizeOptions={['10', '20', '50']}
          onChange={onChangePage}
          onShowSizeChange={onShowSizeChange}
          hideOnSinglePage
        />
      </PaginationWrap>
    </div>
  )
}

export default ChangeRecord
