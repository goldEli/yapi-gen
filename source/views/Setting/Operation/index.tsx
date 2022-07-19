import styled from '@emotion/styled'
import { Table, Select, DatePicker } from 'antd'
import { StylePagination } from '@/components/StyleCommon'
import moment, { Moment } from 'moment'
import { css } from '@emotion/css'
import type { RangePickerProps } from 'antd/es/date-picker'

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

const List = [
  {
    name: '张三',
    time: '2022-01-12',
    type: '新增',
    info: '【新增项目】项目名称【项目XXXXXX】',
  },
  {
    name: '张三',
    time: '2022-01-12',
    type: '新增',
    info: '【新增项目】项目名称【项目XXXXXX】',
  },
  {
    name: '张三',
    time: '2022-01-12',
    type: '新增',
    info: '【新增项目】项目名称【项目XXXXXX】',
  },
  {
    name: '张三',
    time: '2022-01-12',
    type: '新增',
    info: '【新增项目】项目名称【项目XXXXXX】',
  },
]

export default () => {
  const Option = Select.Option
  const columns = [
    {
      title: '操作人',
      dataIndex: 'name',
    },
    {
      title: '操作时间',
      dataIndex: 'time',
    },
    {
      title: '操作类型',
      dataIndex: 'type',
    },
    {
      title: '操作详情',
      dataIndex: 'info',
    },
  ]

  const onChangePage = (page: React.SetStateAction<number>, size: any) => {
    console.log(page, size)
  }

  const onShowSizeChange = (current: number, pageSize: number) => {
    console.log(current, pageSize)
  }
  const onChange: RangePickerProps['onChange'] = (dates, dateStrings) => {
    if (dates) {
      console.log('From: ', dates[0], ', to: ', dates[1])
      console.log('From: ', dateStrings[0], ', to: ', dateStrings[1])
    } else {
      console.log('Clear')
    }
  }
  return (
    <div style={{ height: '100%' }}>
      <Header>
        <div className="label">操作日志</div>
        <SearchWrap>
          <SelectWrapBedeck>
            <span style={{ margin: '0 16px', fontSize: '12px' }}>操作人</span>
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
          </SelectWrapBedeck>
          <SelectWrapBedeck>
            <span style={{ margin: '0 16px', fontSize: '12px' }}>操作类型</span>
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
          </SelectWrapBedeck>
          <SelectWrapBedeck>
            <span style={{ margin: '0 16px', fontSize: '12px' }}>操作时间</span>
            <DatePicker.RangePicker
              className={rangPicker}
              getPopupContainer={node => node}
              onChange={onChange}
              ranges={{
                最近一周: [
                  moment(new Date()).startOf('days').subtract(6, 'days'),
                  moment(new Date()).endOf('days'),
                ],
                最近一月: [
                  moment(new Date()).startOf('months').subtract(1, 'months'),
                  moment(new Date()).endOf('days'),
                ],
                最近三月: [
                  moment(new Date()).startOf('months').subtract(3, 'months'),
                  moment(new Date()).endOf('days'),
                ],
                今天开始: [moment(new Date()).startOf('days'), moment.min()],
                今天截止: [moment.max(), moment(new Date()).endOf('days')],
              }}
            />
          </SelectWrapBedeck>
          <div style={{ color: '#2877FF', fontSize: 12, cursor: 'pointer' }}>
            清除条件
          </div>
        </SearchWrap>
      </Header>
      <Content>
        <Table
          rowKey="key"
          columns={columns}
          dataSource={List}
          pagination={false}
          scroll={{ x: 'max-content' }}
          showSorterTooltip={false}
        />
        <StylePagination
          defaultCurrent={1}
          current={1}
          showSizeChanger
          showQuickJumper
          total={200}
          showTotal={total => `Total ${total} items`}
          pageSizeOptions={['10', '20', '50']}
          onChange={onChangePage}
          onShowSizeChange={onShowSizeChange}
          hideOnSinglePage={true}
        />
      </Content>
    </div>
  )
}
