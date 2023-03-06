// 设置-操作日志

/* eslint-disable no-undefined */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/naming-convention */
import styled from '@emotion/styled'
import { Select, Pagination, Form, Spin, Space } from 'antd'
import moment from 'moment'
import { SelectWrapBedeck, TableStyleBox } from '@/components/StyleCommon'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import Sort from '@/components/Sort'
import { useTranslation } from 'react-i18next'
import NoData from '@/components/NoData'
import RangePicker from '@/components/RangePicker'
import useSetTitle from '@/hooks/useSetTitle'
import { getStaffList } from '@/services/staff'
import { getOperateLogs } from '@/services/setting'
import { useSelector } from '@store/index'
import PermissionWrap from '@/components/PermissionWrap'
import PaginationBox from '@/components/TablePagination'
import IconFont from '@/components/IconFont'
import CommonUserAvatar from '@/components/CommonUserAvatar'
import ResizeTable from '@/components/ResizeTable'

const Header = styled.div({
  height: 'auto',
  background: 'var(--neutral-white-d1)',
  position: 'sticky',
  top: 0,
  zIndex: 9,
  padding: '24px 24px 20px',
  '.label': {
    fontSize: 16,
    fontWeight: 400,
    color: 'var(--neutral-n1-d1)',
  },
})

const SearchWrap = styled(Space)({
  display: 'flex',
  alignItems: 'center',
  minHeight: 64,
  background: 'var(--neutral-white-d1)',
  padding: '20px 0',
  flexWrap: 'wrap',
  borderBottom: '1px solid #ecedef',
})

const SelectWrap = styled(Select)`
  .ant-select-selection-placeholder {
    color: rgba(187, 189, 191, 1);
  }
  .ant-select-selector {
    min-width: 124px;
    border: none !important;
    outline: none !important;
  }
`

const Content = styled.div({
  padding: '0px 24px 24px',
  height: 'calc(100% - 128px)',
})

const DataWrap = styled.div({
  height: 'calc(100% - 64px)',
  background: 'white',
  overflowX: 'auto',
  borderRadius: 4,
  '.ant-table-thead > tr > th': {
    border: 'none',
  },
})

const NewSort = (sortProps: any) => {
  return (
    <Sort
      fixedKey={sortProps.fixedKey}
      onChangeKey={sortProps.onUpdateOrderKey}
      nowKey={sortProps.nowKey}
      order={sortProps.order === 'asc' ? 1 : 2}
      style={{ height: 44 }}
    >
      {sortProps.children}
    </Sort>
  )
}

const OperationManagement = () => {
  const asyncSetTtile = useSetTitle()
  const [t] = useTranslation()
  asyncSetTtile(t('title.c3'))
  const typeList = [
    { label: t('common.add'), value: 'POST' },
    { label: t('common.edit'), value: 'PUT' },
    { label: t('common.del'), value: 'DELETE' },
  ]
  const { userInfo } = useSelector(store => store.user)
  const [dataList, setDataList] = useState<any>({
    list: undefined,
  })
  const [staffList, setStaffList] = useState<any>([])
  const [form] = Form.useForm()
  const [order, setOrder] = useState<any>({ value: '', key: '' })
  const [pageObj, setPageObj] = useState<any>({ page: 1, size: 20 })
  const [isSpinning, setIsSpinning] = useState(false)
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

  const getList = async (pageObjVal?: any, orderVal?: any) => {
    setIsSpinning(true)
    const values = form.getFieldsValue()
    if (values.times) {
      values.times = [
        moment(values.times[0]).unix()
          ? values.times[0].format('YYYY-MM-DD')
          : '1970-01-01',
        moment(values.times[0]).unix() === 1893427200
          ? ''
          : values.times[1].format('YYYY-MM-DD'),
      ]
    }
    try {
      const result = await getOperateLogs({
        order: orderVal.value,
        orderKey: orderVal.key,
        userId: userInfo.id,
        pageSize: pageObjVal.size,
        page: pageObjVal.page,
        ...values,
      })
      setDataList(result)
      setIsSpinning(false)
    } finally {
      //
    }
  }

  const getStaff = async () => {
    const result = await getStaffList({ all: 1 })
    setStaffList(result)
  }

  useEffect(() => {
    getList(pageObj, order)
    getStaff()
  }, [])

  const onUpdateOrderKey = (key: any, val: any) => {
    setOrder({ value: val === 2 ? 'desc' : 'asc', key })
    getList(pageObj, { value: val === 2 ? 'desc' : 'asc', key })
  }

  const columns = [
    {
      title: (
        <NewSort
          fixedKey="name"
          nowKey={order.key}
          order={order.value}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          {t('common.nickname')}
        </NewSort>
      ),
      dataIndex: 'name',
      width: 200,
      render: (text: string, record: any) => (
        <CommonUserAvatar avatar={record.avatar} size="small" name={text} />
      ),
    },
    {
      title: (
        <NewSort
          fixedKey="created_at"
          nowKey={order.key}
          order={order.value}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          {t('setting.operationTime')}
        </NewSort>
      ),
      dataIndex: 'time',
      width: 200,
    },
    {
      title: (
        <NewSort
          fixedKey="method"
          nowKey={order.key}
          order={order.value}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          {t('setting.operationType')}
        </NewSort>
      ),
      dataIndex: 'type',
      width: 200,
      render: (text: string) => {
        return <div>{typeList.filter(i => i.value === text)[0]?.label}</div>
      },
    },
    {
      title: (
        <NewSort
          fixedKey="content"
          nowKey={order.key}
          order={order.value}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          {t('setting.operationInfo')}
        </NewSort>
      ),
      // width: 200,
      dataIndex: 'info',
    },
  ]

  const onChangePicker = (_values: any) => {
    form.setFieldsValue({
      times: _values,
    })
  }

  const onReset = () => {
    form.resetFields()
    getList(pageObj, order)
  }

  const onChangePage = (page: any, size: any) => {
    setPageObj({ page, size })
    getList({ page, size }, order)
  }

  return (
    <PermissionWrap
      auth="b/company/operate_logs"
      permission={userInfo?.company_permissions}
    >
      <Form style={{ height: '100%' }} form={form}>
        <Header>
          <div className="label">{t('setting.operationLog')}</div>
          <SearchWrap size={16}>
            <SelectWrapBedeck>
              <span style={{ margin: '0 12px', fontSize: '14px' }}>
                {t('setting.operationName')}
              </span>
              <Form.Item name="userIds" noStyle>
                <SelectWrap
                  showArrow
                  mode="multiple"
                  style={{ width: '100%' }}
                  placeholder={t('common.all')}
                  showSearch
                  options={staffList}
                  optionFilterProp="label"
                  allowClear
                  suffixIcon={
                    <IconFont
                      type="down"
                      style={{ fontSize: 16, color: 'var(--neutral-n4)' }}
                    />
                  }
                />
              </Form.Item>
            </SelectWrapBedeck>
            <SelectWrapBedeck>
              <span style={{ margin: '0 16px', fontSize: '14px' }}>
                {t('setting.operationType')}
              </span>
              <Form.Item name="types" noStyle>
                <SelectWrap
                  showArrow
                  mode="multiple"
                  style={{ width: '100%' }}
                  placeholder={t('common.all')}
                  showSearch
                  options={typeList}
                  optionFilterProp="label"
                  allowClear
                  suffixIcon={
                    <IconFont
                      type="down"
                      style={{ fontSize: 16, color: 'var(--neutral-n4)' }}
                    />
                  }
                />
              </Form.Item>
            </SelectWrapBedeck>
            <SelectWrapBedeck>
              <span style={{ margin: '0 16px', fontSize: '14px' }}>
                {t('setting.operationTime')}
              </span>
              <Form.Item name="times" noStyle>
                <RangePicker
                  isShowQuick
                  dateValue={form.getFieldValue('times')}
                  onChange={(_values: any) => onChangePicker(_values)}
                />
              </Form.Item>
            </SelectWrapBedeck>
            <div
              style={{ color: '#2877FF', fontSize: 15, cursor: 'pointer' }}
              onClick={onReset}
            >
              {t('common.clearForm')}
            </div>
          </SearchWrap>
        </Header>
        <Content>
          <ResizeTable
            dataWrapNormalHeight="calc(100% - 64px)"
            col={columns}
            dataSource={dataList.list}
          />
          {/* <DataWrap ref={dataWrapRef}>
            <Spin spinning={isSpinning}>
              {!!dataList?.list &&
                (dataList?.list?.length > 0 ? (
                  <TableStyleBox
                    rowKey="id"
                    columns={columns}
                    dataSource={dataList.list}
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
          </DataWrap> */}

          <PaginationBox
            total={dataList.total}
            pageSize={dataList.pageSize}
            currentPage={dataList.currentPage}
            onChange={onChangePage}
          />
        </Content>
      </Form>
    </PermissionWrap>
  )
}

export default OperationManagement
