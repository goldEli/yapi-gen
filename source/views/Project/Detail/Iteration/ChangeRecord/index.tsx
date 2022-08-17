/* eslint-disable no-undefined */
/* eslint-disable no-else-return */
/* eslint-disable complexity */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable multiline-ternary */
/* eslint-disable react/no-danger */
/* eslint-disable @typescript-eslint/naming-convention */
import { Table, Pagination, Modal, Space, Spin } from 'antd'
import { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { PaginationWrap } from '@/components/StyleCommon'
import { useModel } from '@/models'
import { useSearchParams } from 'react-router-dom'
import Sort from '@/components/Sort'
import { OmitText } from '@star-yun/ui'
import { useTranslation } from 'react-i18next'
import NoData from '@/components/NoData'
import { getParamsData } from '@/tools'

const SpaceWrap = styled(Space)({
  '.ant-space-item': {
    width: '48.5%',
  },
})

const TitleWrap = styled(Space)({
  height: 40,
  background: '#F8F9FA',
  padding: '0 24px',
  borderRadius: 6,
  color: '#323233',
  fontSize: 14,
  marginBottom: 24,
})

const DataWrap = styled.div({
  height: 'calc(100% - 40px)',
  background: 'white',
  overflowX: 'auto',
})

const NewSort = (sortProps: any) => {
  return (
    <Sort
      fixedKey={sortProps.fixedKey}
      onChangeKey={sortProps.onUpdateOrderKey}
      nowKey={sortProps.nowKey}
      order={sortProps.order === 'asc' ? 1 : 2}
    >
      {sortProps.children}
    </Sort>
  )
}

const ChangeRecord = () => {
  const [t] = useTranslation()
  const { getIterateChangeLog, iterateInfo } = useModel('iterate')
  const [isVisible, setIsVisible] = useState(false)
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData.id
  const { iterateId } = paramsData
  const [dataList, setDataList] = useState<any>({
    list: undefined,
  })
  const [checkDetail, setCheckDetail] = useState<any>({})
  const [order, setOrder] = useState<any>({ value: '', key: '' })
  const [pageObj, setPageObj] = useState({ page: 1, size: 10 })
  const [isSpinning, setIsSpinning] = useState(false)
  const { isRefresh, setIsRefresh } = useModel('user')

  const getList = async (item?: any, orderVal?: any) => {
    setIsSpinning(true)
    const result = await getIterateChangeLog({
      iterateId,
      projectId,
      page: item ? item.page : 1,
      pageSize: item ? item.size : 10,
      order: orderVal.value,
      orderKey: orderVal.key,
    })
    setDataList(result)
    setIsSpinning(false)
    setIsRefresh(false)
  }

  useEffect(() => {
    if (isRefresh) {
      getList({ page: 1, size: pageObj.size }, order)
    }
  }, [isRefresh])

  useEffect(() => {
    getList(pageObj, order)
  }, [])

  // useEffect(() => {
  //   if (iterateInfo?.changeCount !== dataList?.total) {
  //     // getList({ page: 1, size: pageObj.size }, order)
  //   }
  // }, [iterateInfo, dataList])

  const onClickCheck = (item: any) => {
    setCheckDetail(item)
    setIsVisible(true)
  }

  const fieldContent = (item: any, i: string) => {
    if (i === 'tag') {
      return item[i]?.length
        ? item[i]?.map((k: any) => k?.name).join('、')
        : '--'
    } else if (i === 'attachment' || i === 'copysend') {
      return item[i]?.length ? item[i].map((k: any) => k) : '--'
    } else {
      return item[i] || '--'
    }
  }

  const onUpdateOrderKey = (key: any, val: any) => {
    setOrder({ value: val === 2 ? 'desc' : 'asc', key })
    getList(
      { page: 1, size: pageObj.size },
      { value: val === 2 ? 'desc' : 'asc', key },
    )
  }

  const columns = [
    {
      title: (
        <NewSort
          fixedKey="id"
          nowKey={order.key}
          order={order.value}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          {t('common.serialNumber')}
        </NewSort>
      ),
      dataIndex: 'id',
    },
    {
      title: (
        <NewSort
          fixedKey="created_at"
          nowKey={order.key}
          order={order.value}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          {t('project.changeTime')}
        </NewSort>
      ),
      dataIndex: 'updateTime',
    },
    {
      title: (
        <NewSort
          fixedKey="user_name"
          nowKey={order.key}
          order={order.value}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          {t('project.changeName')}
        </NewSort>
      ),
      dataIndex: 'userName',
    },
    {
      title: (
        <NewSort
          fixedKey="change_log_type"
          nowKey={order.key}
          order={order.value}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          {t('project.changeType')}
        </NewSort>
      ),
      dataIndex: 'type',
      render: (text: any) => {
        return <div>{text.content_txt}</div>
      },
    },
    {
      title: (
        <NewSort
          fixedKey="fields"
          nowKey={order.key}
          order={order.value}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          {t('project.changeFields')}
        </NewSort>
      ),
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
            {Object.values(text).map(i => <span key={i}>{i}</span>)}
          </div>
        )
      },
    },
    {
      title: (
        <NewSort
          fixedKey="before"
          nowKey={order.key}
          order={order.value}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          {t('project.changeBefore')}
        </NewSort>
      ),
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
            {Object.keys(record?.fields)?.map((i: any) => (
              <span key={i}>
                {i === 'info' ? (
                  <span
                    style={{ cursor: 'pointer', color: '#2877ff' }}
                    onClick={() => onClickCheck(record)}
                  >
                    {text
                      ? text[i]?.length
                        ? t('project.checkInfo')
                        : '--'
                      : '--'}
                  </span>
                ) : (
                  <OmitText width={300}>
                    <span>{text ? fieldContent(text, i) : '--'}</span>
                  </OmitText>
                )}
              </span>
            ))}
          </div>
        )
      },
    },
    {
      title: (
        <NewSort
          fixedKey="after"
          nowKey={order.key}
          order={order.value}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          {t('project.changeAfter')}
        </NewSort>
      ),
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
            {Object.keys(record?.fields).map((i: any) => (
              <span key={i}>
                {i === 'info' ? (
                  <span
                    style={{ cursor: 'pointer', color: '#2877ff' }}
                    onClick={() => onClickCheck(record)}
                  >
                    {text
                      ? text[i]?.length
                        ? t('project.checkInfo')
                        : '--'
                      : '--'}
                  </span>
                ) : (
                  <OmitText width={300}>
                    <span>{text ? fieldContent(text, i) : '--'}</span>
                  </OmitText>
                )}
              </span>
            ))}
          </div>
        )
      },
    },
  ]

  const onChangePage = (page: number, size: number) => {
    setPageObj({ page, size })
    getList({ page, size }, order)
  }

  const onShowSizeChange = (page: number, size: number) => {
    setPageObj({ page, size })
    getList({ page, size }, order)
  }

  return (
    <div style={{ height: 'calc(100% - 50px)' }}>
      <Modal
        visible={isVisible}
        title={t('project.changeInfo')}
        footer={false}
        width={1080}
        onCancel={() => setIsVisible(false)}
        bodyStyle={{ padding: '8px 24px 24px' }}
        destroyOnClose
        maskClosable={false}
        keyboard={false}
      >
        <SpaceWrap
          size={32}
          style={{ display: 'flex', width: '100%', alignItems: 'flex-start' }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <TitleWrap>{t('project.changeBefore')}</TitleWrap>
            <div
              style={{ display: 'flex', flexDirection: 'column' }}
              dangerouslySetInnerHTML={{
                __html: checkDetail?.beforeField?.info,
              }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <TitleWrap>{t('project.changeAfter')}</TitleWrap>
            <div
              style={{ display: 'flex', flexDirection: 'column' }}
              dangerouslySetInnerHTML={{
                __html: checkDetail?.afterField?.info,
              }}
            />
          </div>
        </SpaceWrap>
      </Modal>
      <DataWrap>
        <Spin spinning={isSpinning}>
          {!!dataList?.list
            && (dataList?.list?.length > 0 ? (
              <Table
                rowKey="id"
                columns={columns}
                dataSource={dataList?.list}
                pagination={false}
                scroll={{ x: 'max-content' }}
                showSorterTooltip={false}
              />
            )
              : <NoData />
            )}
        </Spin>
      </DataWrap>

      <PaginationWrap>
        <Pagination
          defaultCurrent={1}
          current={dataList?.currentPage}
          showSizeChanger
          showQuickJumper
          total={dataList?.total}
          showTotal={total => t('common.tableTotal', { count: total })}
          pageSizeOptions={['10', '20', '50']}
          onChange={onChangePage}
          onShowSizeChange={onShowSizeChange}
        />
      </PaginationWrap>
    </div>
  )
}

export default ChangeRecord
