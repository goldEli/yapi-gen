// 设置-登录日志

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/naming-convention */
import styled from '@emotion/styled'
import { Select, Pagination, Form, Spin, Space } from 'antd'
import moment from 'moment'
import {
  PaginationWrap,
  SelectWrapBedeck,
  TableStyleBox,
} from '@/components/StyleCommon'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'

import Sort from '@/components/Sort'
import { useTranslation } from 'react-i18next'
import NoData from '@/components/NoData'
import RangePicker from '@/components/RangePicker'
import useSetTitle from '@/hooks/useSetTitle'
import { getStaffList } from '@/services/staff'
import { getLoginLogs } from '@/services/setting'
import { useSelector } from '@store/index'

const Header = styled.div({
  height: 'auto',
  background: 'white',
  lineHeight: '64px',
  position: 'sticky',
  top: 0,
  zIndex: 9,
  '.label': {
    fontSize: 16,
    fontWeight: 400,
    color: 'black',
    paddingLeft: 24,
    height: 64,
  },
})

const SearchWrap = styled(Space)({
  display: 'flex',
  alignItems: 'center',
  minHeight: 64,
  background: 'white',
  padding: '0 24px',
  flexWrap: 'wrap',
})

const SelectWrap = styled(Select)`
  .ant-select-selection-placeholder {
    color: black;
  }
  .ant-select-selector {
    min-width: 200px;
    border: none !important;
    outline: none !important;
  }
`

const Content = styled.div({
  padding: 16,
  background: '#F5F7FA',
  height: 'calc(100% - 128px)',
})

const DataWrap = styled.div({
  height: 'calc(100% - 48px)',
  background: 'white',
  overflowX: 'auto',
  borderRadius: 4,
})

const StatusWrap = styled.div({
  display: 'flex',
  alignItems: 'center',
  div: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    marginRight: 8,
  },
  span: {
    color: '#323233',
    fontSize: 14,
    fontWeight: 400,
  },
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

const LoginLog = () => {
  const asyncSetTtile = useSetTitle()
  const [t] = useTranslation()
  asyncSetTtile(t('title.c4'))
  const { userInfo, loginInfo } = useSelector(
    (store: { user: any }) => store.user,
  )
  const [dataList, setDataList] = useState<any>([])
  const [staffList, setStaffList] = useState<any>([])
  const [form] = Form.useForm()
  const [order, setOrder] = useState<any>({ value: '', key: '' })
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

  const getList = async (orderVal?: any) => {
    setIsSpinning(true)
    const values = await form.getFieldsValue()
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
      const result = await getLoginLogs({
        order: orderVal.value,
        orderKey: orderVal.key,
        userId: userInfo.id,
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
    getList(order)
    getStaff()
  }, [])

  const onUpdateOrderKey = (key: any, val: any) => {
    setOrder({ value: val === 2 ? 'desc' : 'asc', key })
    getList({ value: val === 2 ? 'desc' : 'asc', key })
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
      render: (text: string) => {
        return <span>{text || '--'}</span>
      },
    },
    {
      title: (
        <NewSort
          fixedKey="name"
          nowKey={order.key}
          order={order.value}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          {t('setting.loginUser')}
        </NewSort>
      ),
      dataIndex: 'username',
      width: 160,
      render: (text: string) => {
        return <span>{text || '--'}</span>
      },
    },
    {
      title: (
        <NewSort
          fixedKey="nickname"
          nowKey={order.key}
          order={order.value}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          {t('common.nickname')}
        </NewSort>
      ),
      dataIndex: 'nickname',
      width: 160,
      render: (text: string) => {
        return <span>{text || '--'}</span>
      },
    },
    {
      title: (
        <NewSort
          fixedKey="created_at"
          nowKey={order.key}
          order={order.value}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          {t('setting.loginTime')}
        </NewSort>
      ),
      dataIndex: 'time',
      width: 200,
      render: (text: string) => {
        return <span>{text || '--'}</span>
      },
    },
    {
      title: (
        <NewSort
          fixedKey="ip"
          nowKey={order.key}
          order={order.value}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          {t('setting.loginIp')}
        </NewSort>
      ),
      dataIndex: 'loginIp',
      width: 200,
      render: (text: string) => {
        return <span>{text || '--'}</span>
      },
    },
    {
      title: (
        <NewSort
          fixedKey="client"
          nowKey={order.key}
          order={order.value}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          {t('setting.client')}
        </NewSort>
      ),
      dataIndex: 'client',
      width: 160,
      render: (text: string) => {
        return <span>{text || '--'}</span>
      },
    },
    {
      title: (
        <NewSort
          fixedKey="system"
          nowKey={order.key}
          order={order.value}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          {t('setting.system')}
        </NewSort>
      ),
      dataIndex: 'system',
      width: 160,
      render: (text: string) => {
        return <span>{text || '--'}</span>
      },
    },
    {
      title: (
        <NewSort
          fixedKey="login_status"
          nowKey={order.key}
          order={order.value}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          {t('setting.loginStatus')}
        </NewSort>
      ),
      dataIndex: 'status',
      width: 160,
      render: (text: number) => {
        return (
          <StatusWrap>
            <div style={{ background: text === 1 ? '#43BA9A' : '#FF5C5E' }} />
            <span>
              {text === 1 ? t('setting.success') : t('setting.failed')}
            </span>
          </StatusWrap>
        )
      },
    },
  ]

  const onShowSizeChange = (_current: number, size: number) => {
    form.setFieldsValue({
      pageSize: size,
      page: 1,
    })
  }

  const onValuesChange = (changedValues: any) => {
    if (!Reflect.has(changedValues, 'page')) {
      form.setFieldsValue({ page: 1 })
    }
    getList(order)
  }

  const onChangePicker = (_values: any) => {
    form.setFieldsValue({
      times: _values,
    })
  }

  const onReset = () => {
    form.resetFields()
    getList(order)
  }
  return (
    <Form
      style={{ height: '100%' }}
      form={form}
      onValuesChange={onValuesChange}
      initialValues={{
        pageSize: 20,
        page: 1,
      }}
    >
      <Header>
        <div className="label">{t('setting.loginLog')}</div>
        <SearchWrap size={16}>
          <SelectWrapBedeck>
            <span style={{ margin: '0 16px', fontSize: '14px' }}>
              {t('setting.loginUser')}
            </span>
            <Form.Item name="pageSize" />
            <Form.Item name="userIds" noStyle>
              <SelectWrap
                showArrow
                mode="multiple"
                style={{ width: '100%' }}
                placeholder={t('common.all')}
                showSearch
                allowClear
                options={staffList}
                optionFilterProp="label"
                getPopupContainer={node => node}
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
        <DataWrap ref={dataWrapRef}>
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
        </DataWrap>

        <PaginationWrap>
          <Form.Item noStyle dependencies={['pageSize']}>
            {() => {
              return (
                <Form.Item name="page" valuePropName="current" noStyle>
                  <Pagination
                    defaultCurrent={1}
                    showSizeChanger
                    showQuickJumper
                    total={dataList.total}
                    showTotal={total =>
                      t('common.tableTotal', { count: total })
                    }
                    pageSizeOptions={[10, 20, 50]}
                    pageSize={form.getFieldValue('pageSize') || 20}
                    onShowSizeChange={onShowSizeChange}
                  />
                </Form.Item>
              )
            }}
          </Form.Item>
        </PaginationWrap>
      </Content>
    </Form>
  )
}

export default LoginLog
