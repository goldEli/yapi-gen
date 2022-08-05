/* eslint-disable complexity */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/naming-convention */
import styled from '@emotion/styled'
import { Table, Select, DatePicker, Pagination, Form, message } from 'antd'
import moment from 'moment'
import { css } from '@emotion/css'
import { PaginationWrap } from '@/components/StyleCommon'
import { useModel } from '@/models'
import { useEffect, useState } from 'react'
import Sort from '@/components/Sort'
import { useTranslation } from 'react-i18next'

const Header = styled.div({
  height: 'auto',
  background: 'white',
  lineHeight: '64px',
  position: 'sticky',
  top: 0,
  zIndex: 2,
  '.label': {
    fontSize: 16,
    fontWeight: 400,
    color: 'black',
    paddingLeft: 24,
    height: 64,
  },
})

const SearchWrap = styled.div({
  display: 'flex',
  alignItems: 'center',
  minHeight: 64,
  background: 'white',
  padding: '0 24px',
  flexWrap: 'wrap',
})

const SelectWrapBedeck = styled.div`
  height: 32px;
  margin-right: 16px;
  position: relative;
  height: 32px;
  border: 1px solid rgba(235, 237, 240, 1);
  display: flex;
  align-items: center;
  border-radius: 6px;
  span {
    white-space: nowrap;
  }
  .ant-form-item {
    margin-bottom: 0;
  }
  .ant-picker {
    border: none;
  }
`

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

const rangPicker = css`
  .ant-picker-panel-container {
    display: flex;
    flex-direction: row-reverse;
  }
  .ant-picker-footer {
    min-width: inherit;
    width: max-content;
  }
  .ant-picker-ranges {
    display: flex;
    flex-direction: column;
  }
  .ant-tag {
    margin-right: 0;
  }
`

const Content = styled.div({
  padding: 16,
  background: '#F5F7FA',
  height: 'calc(100% - 64px)',
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

const Operation = () => {
  const [t] = useTranslation()
  const typeList = [
    { label: '新增', value: 'POST' },
    { label: t('common.edit'), value: 'PUT' },
    { label: t('common.del'), value: 'DELETE' },
  ]
  const { getOperateLogs } = useModel('setting')
  const { userInfo } = useModel('user')
  const { getStaffList } = useModel('staff')
  const [dataList, setDataList] = useState<any>([])
  const [staffList, setStaffList] = useState<any>([])
  const [form] = Form.useForm()
  const [order, setOrder] = useState<any>({ value: '', key: '' })

  const getList = async (orderVal?: any) => {
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
      const result = await getOperateLogs({
        order: orderVal.value,
        orderKey: orderVal.key,
        userId: userInfo.id,
        ...values,
      })
      setDataList(result)
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
          fixedKey="name"
          nowKey={order.key}
          order={order.value}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          {t('setting.operationName')}
        </NewSort>
      ),
      dataIndex: 'name',
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
      render: (text: string) => {
        return <div>{typeList.filter(i => i.value === text)[0].label}</div>
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
      dataIndex: 'info',
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
        pageSize: 10,
        page: 1,
      }}
    >
      <Header>
        <div className="label">{t('setting.operationLog')}</div>
        <SearchWrap>
          <SelectWrapBedeck>
            <span style={{ margin: '0 16px', fontSize: '12px' }}>
              {t('setting.operationName')}
            </span>
            <Form.Item name="pageSize" />
            <Form.Item name="userIds" noStyle>
              <SelectWrap
                mode="multiple"
                style={{ width: '100%' }}
                placeholder={t('common.all')}
                showSearch
                options={staffList}
                optionFilterProp="label"
              />
            </Form.Item>
          </SelectWrapBedeck>
          <SelectWrapBedeck>
            <span style={{ margin: '0 16px', fontSize: '12px' }}>
              {t('setting.operationType')}
            </span>
            <Form.Item name="types" noStyle>
              <SelectWrap
                mode="multiple"
                style={{ width: '100%' }}
                placeholder={t('common.all')}
                showSearch
                options={typeList}
                optionFilterProp="label"
              />
            </Form.Item>
          </SelectWrapBedeck>
          <SelectWrapBedeck>
            <span style={{ margin: '0 16px', fontSize: '12px' }}>
              {t('setting.operationTime')}
            </span>
            <Form.Item name="times" noStyle>
              <DatePicker.RangePicker
                className={rangPicker}
                getPopupContainer={node => node}
                format={(times: moment.Moment) => {
                  if (times.unix() === 0 || times.unix() === 1893427200) {
                    return '空'
                  }
                  return times.format('YYYY-MM-DD')
                }}
                ranges={{
                  最近一周: [
                    moment(new Date()).startOf('days')
                      .subtract(6, 'days'),
                    moment(new Date()).endOf('days'),
                  ],
                  最近一月: [
                    moment(new Date()).startOf('months')
                      .subtract(1, 'months'),
                    moment(new Date()).endOf('days'),
                  ],
                  最近三月: [
                    moment(new Date()).startOf('months')
                      .subtract(3, 'months'),
                    moment(new Date()).endOf('days'),
                  ],
                  今天开始: [
                    moment(new Date()).startOf('days'),
                    moment(1893427200 * 1000),
                  ],
                  今天截止: [moment(0), moment(new Date()).endOf('days')],
                }}
              />
            </Form.Item>
          </SelectWrapBedeck>
          <div
            style={{ color: '#2877FF', fontSize: 12, cursor: 'pointer' }}
            onClick={onReset}
          >
            {t('common.clearForm')}
          </div>
        </SearchWrap>
      </Header>
      <Content>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={dataList.list}
          pagination={false}
          scroll={{ x: 'max-content' }}
          showSorterTooltip={false}
        />
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
                    showTotal={total => t('common.tableTotal', { count: total })
                    }
                    pageSizeOptions={[10, 20, 50]}
                    pageSize={form.getFieldValue('pageSize') || 10}
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

export default Operation
