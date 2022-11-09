/* eslint-disable no-undefined */
/* eslint-disable no-else-return */
/* eslint-disable multiline-ternary */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-danger */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-len */
import { Table, Pagination, Modal, Space, Spin } from 'antd'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import styled from '@emotion/styled'
import { HiddenText, PaginationWrap } from '@/components/StyleCommon'
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
  img: {
    maxWidth: '100%',
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
  borderRadius: 6,
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
  const { getDemandChangeLog } = useModel('demand')
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData.id
  const { demandId } = paramsData
  const [dataList, setDataList] = useState<any>({
    list: undefined,
  })
  const [checkDetail, setCheckDetail] = useState<any>({})
  const [isVisible, setIsVisible] = useState(false)
  const [order, setOrder] = useState<any>({ value: '', key: '' })
  const [pageObj, setPageObj] = useState({ page: 1, size: 20 })
  const [isSpinning, setIsSpinning] = useState(false)
  const { isRefresh, setIsRefresh } = useModel('user')
  const [dataWrapHeight, setDataWrapHeight] = useState(0)
  const [tableWrapHeight, setTableWrapHeight] = useState(0)
  const dataWrapRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (dataWrapRef.current) {
      const currentHeight = dataWrapRef.current.clientHeight
      if (currentHeight !== dataWrapHeight) {
        setDataWrapHeight(currentHeight)
      }

      const tableBody = dataWrapRef.current.querySelector('.ant-table-tbody')
      if (tableBody && tableBody.clientHeight !== tableWrapHeight) {
        setTableWrapHeight(tableBody.clientHeight)
      }
    }
  }, [dataList])

  const tableY =
    tableWrapHeight > dataWrapHeight - 52 ? dataWrapHeight - 52 : void 0

  const getList = async (item?: any, orderVal?: any) => {
    setIsSpinning(true)
    const result = await getDemandChangeLog({
      demandId,
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
    getList(pageObj, order)
  }, [])

  useEffect(() => {
    if (isRefresh) {
      getList({ page: 1, size: pageObj.size }, order)
    }
  }, [isRefresh])

  const onClickCheck = (item: any) => {
    setCheckDetail(item)
    setIsVisible(true)
  }

  const fieldContent = (item: any, i: string) => {
    if (i === 'tag') {
      return item[i]?.length
        ? item[i]?.map((k: any) => k?.name).join('、')
        : '--'
    } else if (i === 'users' || i === 'copysend' || i === 'attachment') {
      return item[i]?.length ? item[i].join(',') : '--'
    } else if (i === 'status') {
      return item[i]
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
      width: 160,
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
      width: 200,
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
      width: 160,
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
      width: 160,
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
      width: 160,
      render: (text: []) => {
        return (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '16px 0',
            }}
          >
            {Object.keys(text)?.map((i: any) =>
              i === 'custom_field' ? (
                (text[i] as any).map((k: any) => (
                  <span key={k.field}>{k.name}</span>
                ))
              ) : (
                <span>{text[i]}</span>
              ),
            )}
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
      width: 200,
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
                ) : i === 'custom_field' ? (
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {record.beforeField
                      ? record.fields.custom_field
                          ?.map(
                            (m: any) => record.beforeField[i][m.field]?.value,
                          )
                          ?.map((k: any) => (
                            <span key={k}>
                              {(Array.isArray(k) ? k.join('、') : k) || '--'}
                            </span>
                          ))
                      : record.fields.custom_field?.map((m: any) => (
                          <span key={m}>--</span>
                        ))}
                  </div>
                ) : (
                  <HiddenText>
                    <OmitText
                      width={300}
                      tipProps={{
                        getPopupContainer: node => node,
                      }}
                    >
                      <span>{text ? fieldContent(text, i) : '--'}</span>
                    </OmitText>
                  </HiddenText>
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
      width: 200,
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
                ) : i === 'custom_field' ? (
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {record.afterField
                      ? record.fields.custom_field
                          ?.map(
                            (m: any) => record.afterField[i][m.field]?.value,
                          )
                          ?.map((k: any) => (
                            <span key={k}>
                              {(Array.isArray(k) ? k.join('、') : k) || '--'}
                            </span>
                          ))
                      : record.fields.custom_field?.map((m: any) => (
                          <span key={m}>--</span>
                        ))}
                  </div>
                ) : (
                  <HiddenText>
                    <OmitText
                      width={300}
                      tipProps={{
                        getPopupContainer: node => node,
                      }}
                    >
                      <span>{text ? fieldContent(text, i) : '--'}</span>
                    </OmitText>
                  </HiddenText>
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
    <div style={{ height: 'calc(100% - 54px)', padding: '16px 16px 0 16px' }}>
      <Modal
        visible={isVisible}
        title={t('project.changeInfo')}
        footer={false}
        width={1080}
        onCancel={() => setIsVisible(false)}
        bodyStyle={{
          padding: '8px 24px 24px',
          maxHeight: 640,
          overflow: 'auto',
        }}
        destroyOnClose
        maskClosable={false}
        keyboard={false}
        wrapClassName="vertical-center-modal"
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
      <DataWrap ref={dataWrapRef}>
        <Spin spinning={isSpinning}>
          {!!dataList?.list &&
            (dataList?.list?.length > 0 ? (
              <Table
                rowKey="id"
                columns={columns}
                dataSource={dataList?.list}
                pagination={false}
                scroll={{
                  x: columns.reduce(
                    (totalWidth: number, item: any) => totalWidth + item.width,
                    0,
                  ),
                  y: tableY,
                }}
                showSorterTooltip={false}
                sticky
              />
            ) : (
              <NoData />
            ))}
        </Spin>
      </DataWrap>

      <PaginationWrap>
        <Pagination
          defaultCurrent={1}
          current={dataList?.currentPage}
          pageSize={pageObj?.size}
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
