// 迭代详情-迭代变更记录

/* eslint-disable no-undefined */
/* eslint-disable no-else-return */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-danger */
/* eslint-disable @typescript-eslint/naming-convention */
import { Pagination, Space, Spin } from 'antd'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import styled from '@emotion/styled'
import { HiddenText, TableStyleBox } from '@/components/StyleCommon'
import { useSearchParams } from 'react-router-dom'
import Sort from '@/components/Sort'
import { OmitText } from '@star-yun/ui'
import { useTranslation } from 'react-i18next'
import NoData from '@/components/NoData'
import { getParamsData } from '@/tools'
import CommonModal from '@/components/CommonModal'
import { useDispatch, useSelector } from '@store/index'
import { setIsRefresh } from '@store/user'
import { getIterateChangeLog } from '@/services/iterate'
import PaginationBox from '@/components/TablePagination'

const ContentWrap = styled.div({
  display: 'flex',
  flexDirection: 'column',
  height: '60vh',
  overflow: 'auto',
  padding: '0 24px 16px',
})

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
  height: 'calc(100% - 64px)',
  background: 'white',
  overflowX: 'auto',
  borderRadius: 4,
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

const ChangeRecord = (props?: any) => {
  const [t] = useTranslation()
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
  const [pageObj, setPageObj] = useState({ page: 1, size: 20 })
  const [isSpinning, setIsSpinning] = useState(false)
  const dispatch = useDispatch()
  const { isRefresh } = useSelector(store => store.user)
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
    dispatch(setIsRefresh(false))
    props.onChangeUpdate()
  }

  useEffect(() => {
    if (isRefresh || props?.isUpdate) {
      getList({ page: 1, size: pageObj.size }, order)
    }
  }, [isRefresh, props?.isUpdate])

  useEffect(() => {
    getList({ page: 1, size: pageObj.size }, order)
  }, [])

  const onClickCheck = (item: any, key: any) => {
    item.key = key
    setCheckDetail(item)
    setIsVisible(true)
  }

  const fieldContent = (item: any, i: string) => {
    if (i === 'tag') {
      return item[i]?.length
        ? item[i]?.map((k: any) => k?.name).join(';')
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
            {Object.values(text).map(i => (
              <span key={i}>{i}</span>
            ))}
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
                {i === 'info' || i === 'achieve_desc' ? (
                  <span
                    style={{ cursor: 'pointer', color: '#2877ff' }}
                    onClick={() => onClickCheck(record, i)}
                  >
                    {text
                      ? text[i]?.length
                        ? t('project.checkInfo')
                        : '--'
                      : '--'}
                  </span>
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
                {i === 'info' || i === 'achieve_desc' ? (
                  <span
                    style={{ cursor: 'pointer', color: '#2877ff' }}
                    onClick={() => onClickCheck(record, i)}
                  >
                    {text
                      ? text[i]?.length
                        ? t('project.checkInfo')
                        : '--'
                      : '--'}
                  </span>
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

  return (
    <div style={{ height: 'calc(100% - 50px)', padding: '16px 16px 0' }}>
      <CommonModal
        isVisible={isVisible}
        title={t('project.changeInfo')}
        width={1080}
        onClose={() => setIsVisible(false)}
        isShowFooter
      >
        <SpaceWrap
          size={32}
          style={{
            display: 'flex',
            width: '100%',
            alignItems: 'flex-start',
            paddingRight: 16,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <TitleWrap>{t('project.changeBefore')}</TitleWrap>
            <ContentWrap>
              <div
                dangerouslySetInnerHTML={{
                  __html:
                    checkDetail.key === 'info'
                      ? checkDetail?.beforeField?.info
                      : checkDetail?.beforeField?.achieve_desc,
                }}
              />
            </ContentWrap>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <TitleWrap>{t('project.changeAfter')}</TitleWrap>
            <ContentWrap>
              <div
                dangerouslySetInnerHTML={{
                  __html:
                    checkDetail.key === 'info'
                      ? checkDetail?.afterField?.info
                      : checkDetail?.afterField?.achieve_desc,
                }}
              />
            </ContentWrap>
          </div>
        </SpaceWrap>
      </CommonModal>
      <DataWrap ref={dataWrapRef}>
        <Spin spinning={isSpinning}>
          {!!dataList?.list &&
            (dataList?.list?.length > 0 ? (
              <TableStyleBox
                rowKey="id"
                columns={columns}
                dataSource={dataList?.list}
                pagination={false}
                scroll={{
                  x: 'max-content',
                  y: tableY,
                }}
                tableLayout="auto"
                showSorterTooltip={false}
              />
            ) : (
              <NoData />
            ))}
        </Spin>
      </DataWrap>

      <PaginationBox
        currentPage={dataList?.currentPage}
        pageSize={pageObj?.size}
        total={dataList?.total}
        onChange={onChangePage}
      />
    </div>
  )
}

export default ChangeRecord