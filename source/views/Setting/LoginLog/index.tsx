/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/naming-convention */
import styled from '@emotion/styled'
import { Table, Select, DatePicker, Pagination, message, Form } from 'antd'
import moment from 'moment'
import { css } from '@emotion/css'
import type { RangePickerProps } from 'antd/es/date-picker'
import { PaginationWrap } from '@/components/StyleCommon'
import { useEffect, useState } from 'react'
import { useModel } from '@/models'

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
  height: 64,
  background: 'white',
  padding: '0 24px',
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

const LoginLog = () => {
  const { getLoginLogs } = useModel('setting')
  const { userInfo } = useModel('user')
  const [dataList, setDataList] = useState<any>([])
  const [form] = Form.useForm()

  const getList = async () => {
    const values = await form.getFieldsValue()
    const clear = message.loading('加载中')
    if (values.times) {
      values.times = [
        moment(values.times[0]).unix()
          ? values.times[0].format('YYYY-MM-DD')
          : '',
        moment(values.times[0]).unix() === 1893427200
          ? values.times[1].format('YYYY-MM-DD')
          : '',
      ]
    }
    try {
      const result = await getLoginLogs({
        orderKey: 'created_at',
        order: 'desc',
        userId: userInfo.id,
        ...values,
      })
      setDataList(result)
    } finally {
      clear()
    }
  }

  useEffect(() => {
    getList()
  }, [])

  const { Option } = Select
  const columns = [
    {
      title: '序号',
      dataIndex: 'id',
    },
    {
      title: '登录用户',
      dataIndex: 'username',
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
    },
    {
      title: '登录时间',
      dataIndex: 'time',
    },
    {
      title: '登录IP',
      dataIndex: 'loginIp',
    },
    {
      title: '客户端',
      dataIndex: 'client',
    },
    {
      title: '系统',
      dataIndex: 'system',
    },
    {
      title: '登录状态',
      dataIndex: 'status',
      render: (text: number) => {
        return (
          <StatusWrap>
            <div style={{ background: text === 1 ? '#43BA9A' : '#FF5C5E' }} />
            <span>{text === 1 ? '成功' : '失败'}</span>
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
    getList()
  }

  const onReset = () => {
    form.resetFields()
    getList()
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
        <div className="label">登录日志</div>
        <SearchWrap>
          <SelectWrapBedeck>
            <span style={{ margin: '0 16px', fontSize: '12px' }}>登录用户</span>
            <Form.Item name="pageSize" />
            <Form.Item name="userIds" noStyle>
              <SelectWrap
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="所有"
                showSearch
              >
                <Option value="jack">Jack</Option>
                <Option value="lucy">Lucy</Option>
                <Option value="disabled">Disabled</Option>
                <Option value="Yiminghe">yiminghe</Option>
              </SelectWrap>
            </Form.Item>
          </SelectWrapBedeck>
          <SelectWrapBedeck>
            <span style={{ margin: '0 16px', fontSize: '12px' }}>操作时间</span>
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
            清除条件
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
                    showTotal={total => `Total ${total} items`}
                    pageSizeOptions={[10, 20, 50]}
                    pageSize={form.getFieldValue('pageSize') || 10}
                    onShowSizeChange={onShowSizeChange}
                    hideOnSinglePage
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
