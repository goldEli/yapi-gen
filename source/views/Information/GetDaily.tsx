/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable @typescript-eslint/naming-convention */
import IconFont from '@/components/IconFont'
import {
  MyInput,
  PaginationWrap,
  StaffTableWrap,
} from '@/components/StyleCommon'
import { Checkbox, DatePicker, Pagination, Spin } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import moment from 'moment'
import {
  rangPicker,
  SelectWrap,
  SelectWrapBedeck,
} from '@/components/TableFilter'
import { DataWrap, TableBox, tableWrapP } from '../staff'
import NoData from '@/components/NoData'
import Sort from '@/components/Sort'

const Get = () => {
  const [t, i18n] = useTranslation()
  const [keyword, setKeyword] = useState<string>('')

  // const [listData, setListData] = useState<any>([])
  const [orderKey, setOrderKey] = useState<any>()
  const [order, setOrder] = useState<any>(3)
  const [page, setPage] = useState<number>(1)
  const [pagesize, setPagesize] = useState<number>(10)
  const [total, setTotal] = useState<number>()
  const [isSpinning, setIsSpinning] = useState(false)

  const listData = [
    {
      key: '1',
      name: '胡彦斌',
      gender: 32,
      email: '西湖区湖底公园1号',
      phone: '胡彦斌',
      department_name: 32,
      position_name: '西湖区湖底公园1号',
      role_name: '胡彦斌',
      created_at: 32,
    },
    {
      key: '2',
      name: '胡彦斌',
      gender: 32,
      email: '西湖区湖底公园1号',
      phone: '胡彦斌',
      department_name: 32,
      position_name: '西湖区湖底公园1号',
      role_name: '胡彦斌',
      created_at: 32,
    },
    {
      key: '3',
      name: '胡彦斌',
      gender: 32,
      email: '西湖区湖底公园1号',
      phone: '胡彦斌',
      department_name: 32,
      position_name: '西湖区湖底公园1号',
      role_name: '胡彦斌',
      created_at: 32,
    },
    {
      key: '4',
      name: '胡彦斌',
      gender: 32,
      email: '西湖区湖底公园1号',
      phone: '胡彦斌',
      department_name: 32,
      position_name: '西湖区湖底公园1号',
      role_name: '胡彦斌',
      created_at: 32,
    },
    {
      key: '5',
      name: '胡彦斌',
      gender: 32,
      email: '西湖区湖底公园1号',
      phone: '胡彦斌',
      department_name: 32,
      position_name: '西湖区湖底公园1号',
      role_name: '胡彦斌',
      created_at: 32,
    },
    {
      key: '6',
      name: '胡彦斌',
      gender: 32,
      email: '西湖区湖底公园1号',
      phone: '胡彦斌',
      department_name: 32,
      position_name: '西湖区湖底公园1号',
      role_name: '胡彦斌',
      created_at: 32,
    },
    {
      key: '7',
      name: '胡彦斌',
      gender: 32,
      email: '西湖区湖底公园1号',
      phone: '胡彦斌',
      department_name: 32,
      position_name: '西湖区湖底公园1号',
      role_name: '胡彦斌',
      created_at: 32,
    },
    {
      key: '8',
      name: '胡彦斌',
      gender: 32,
      email: '西湖区湖底公园1号',
      phone: '胡彦斌',
      department_name: 32,
      position_name: '西湖区湖底公园1号',
      role_name: '胡彦斌',
      created_at: 32,
    },
    {
      key: '9',
      name: '胡彦斌',
      gender: 32,
      email: '西湖区湖底公园1号',
      phone: '胡彦斌',
      department_name: 32,
      position_name: '西湖区湖底公园1号',
      role_name: '胡彦斌',
      created_at: 32,
      state: true,
    },
  ]

  const NewSort = (props: any) => {
    return (
      <Sort
        fixedKey={props.fixedKey}
        onChangeKey={updateOrderkey}
        nowKey={orderKey}
        order={order}
      >
        {props.children}
      </Sort>
    )
  }

  const columnsData: any = [
    {
      width: 200,
      title: <NewSort fixedKey="name">标题</NewSort>,
      dataIndex: 'name',
      key: 'name',
      render: (text: string | number) => {
        return <div>{text}</div>
      },
    },
    {
      title: <NewSort fixedKey="gender">内容摘要</NewSort>,
      dataIndex: 'gender',
      key: 'gender',
      width: 200,
    },
    {
      title: <NewSort fixedKey="email">附件</NewSort>,
      dataIndex: 'email',
      key: 'email',
      width: 200,
      render: (text: string) => {
        return <span>{text || '--'}</span>
      },
    },
    {
      title: <NewSort fixedKey="phone">关联需求</NewSort>,
      dataIndex: 'phone',
      key: 'phone',
      width: 150,
      render: (text: string) => {
        return <span>{text || '--'}</span>
      },
    },
    {
      title: <NewSort fixedKey="department_name">创建日期</NewSort>,
      dataIndex: 'department_name',
      key: 'department_name',
      width: 160,
      render: (text: string) => {
        return <span>{text || '--'}</span>
      },
    },

    {
      title: <NewSort fixedKey="role_name">我的阅读状态</NewSort>,
      dataIndex: 'role_name',
      key: 'role_name',
      width: 170,
      render: (text: string, record: any) => {
        return (
          <div>
            <span
              style={{
                width: '8px',
                height: '8px',
                background: record.state ? 'red' : '#43BA9A',
                display: 'inline-block',
                borderRadius: '50%',
                marginRight: '8px',
              }}
            />
            <span>{record.state ? '已阅' : '未读'}</span>
          </div>
        )
      },
    },

    {
      title: <NewSort fixedKey="created_at">操作</NewSort>,
      dataIndex: 'created_at',
      key: 'created_at',
      width: 180,
      fixed: 'right',
      render: (text: string, record: any) => {
        return (
          <div>
            <span
              style={{
                fontSize: '14px',
                fontWeight: ' 400',
                color: '#2877FF',
                marginLeft: '16px',
                cursor: 'pointer',
              }}
            >
              查看
            </span>
          </div>
        )
      },
    },
  ]
  const updateOrderkey = (key: any, orderVal: any) => {
    setOrderKey(key)
    setOrder(orderVal)
  }
  const onPressEnter = (e: any) => {
    setKeyword(e.target.value)
  }

  const onChangePage = (newPage: any) => {
    setPage(newPage)
  }
  const onShowSizeChange = (current: any, size: any) => {
    setPagesize(size)
  }
  const confirm = () => {
    // console.log();
  }
  const onChange = (e: any) => {
    // console.log(`checked = ${e.target.checked}`)
  }
  const onChangeTime = (key: any, dates: any) => {
    if (dates) {
      //   form.setFieldsValue({
      //     [key]: [
      //       moment(dates[0]).unix()
      //         ? moment(dates[0]).format('YYYY-MM-DD')
      //         : '1970-01-01',
      //       moment(dates[1]).unix() === 1893427200
      //         ? '2030-01-01'
      //         : moment(dates[1]).format('YYYY-MM-DD'),
      //     ],
      //   })
    }
    confirm()
  }

  return (
    <div>
      <div
        style={{
          height: '52px',
          background: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          paddingLeft: '24px',
          paddingRight: '40px',
          justifyContent: 'space-between',
        }}
      >
        <SelectWrapBedeck>
          <span style={{ margin: '0 16px', fontSize: '14px' }}>创建时间</span>
          <DatePicker.RangePicker
            allowClear={false}
            className={rangPicker}
            getPopupContainer={node => node}
            format={(times: moment.Moment) => {
              if (times.unix() === 0 || times.unix() === 1893427200) {
                return t('common.null')
              }
              return times.format('YYYY-MM-DD')
            }}
            ranges={
              i18n.language === 'zh'
                ? {
                    最近一周: [
                      moment(new Date()).startOf('days').subtract(6, 'days'),
                      moment(new Date()).endOf('days'),
                    ],
                    最近一月: [
                      moment(new Date())
                        .startOf('months')
                        .subtract(1, 'months'),
                      moment(new Date()).endOf('days'),
                    ],
                    最近三月: [
                      moment(new Date())
                        .startOf('months')
                        .subtract(3, 'months'),
                      moment(new Date()).endOf('days'),
                    ],
                    今天开始: [
                      moment(new Date()).startOf('days'),
                      moment(1893427200 * 1000),
                    ],
                    今天截止: [moment(0), moment(new Date()).endOf('days')],
                    空: [moment(0), moment(0)],
                  }
                : {
                    'Last Week': [
                      moment(new Date()).startOf('days').subtract(6, 'days'),
                      moment(new Date()).endOf('days'),
                    ],
                    'Last Month': [
                      moment(new Date())
                        .startOf('months')
                        .subtract(1, 'months'),
                      moment(new Date()).endOf('days'),
                    ],
                    'Last March': [
                      moment(new Date())
                        .startOf('months')
                        .subtract(3, 'months'),
                      moment(new Date()).endOf('days'),
                    ],
                    'Start today': [
                      moment(new Date()).startOf('days'),
                      moment(1893427200 * 1000),
                    ],
                    'Due today': [moment(0), moment(new Date()).endOf('days')],
                    Empty: [moment(0), moment(0)],
                  }
            }
          />
        </SelectWrapBedeck>

        <SelectWrapBedeck>
          <span style={{ margin: '0 16px', fontSize: '14px' }}>发送人</span>

          <SelectWrap
            showArrow
            mode="multiple"
            style={{ width: '100%' }}
            placeholder={t('common.pleaseSelect')}
            showSearch
            onChange={confirm}
            optionFilterProp="label"
            options={[]}
          />
        </SelectWrapBedeck>
        <Checkbox onChange={onChange}>只看未阅</Checkbox>
        <MyInput
          suffix={
            <IconFont
              type="search"
              style={{ color: '#BBBDBF', fontSize: 20 }}
            />
          }
          onPressEnter={onPressEnter}
          onBlur={onPressEnter}
          placeholder={t('common.pleaseSearchDemand')}
          allowClear
        />
      </div>
      <div className={tableWrapP} style={{ height: `calc(100% - ${180}px)` }}>
        <StaffTableWrap style={{ height: '100%' }}>
          <DataWrap>
            <Spin spinning={isSpinning}>
              {
                !!listData &&
                  (listData?.length > 0 ? (
                    <TableBox
                      rowKey="id"
                      columns={columnsData}
                      dataSource={listData}
                      pagination={false}
                      scroll={{ x: 'max-content' }}
                      sticky
                    />
                  ) : (
                    <NoData />
                  ))

                //   <TableBox
                //     rowKey="id"
                //     columns={columnsData}
                //     dataSource={listData}
                //     pagination={false}
                //     scroll={{ x: 'max-content' }}
                //     sticky
                //   />
              }
            </Spin>
          </DataWrap>
        </StaffTableWrap>

        <PaginationWrap>
          <Pagination
            pageSize={pagesize}
            current={page}
            showSizeChanger
            showQuickJumper
            total={total}
            showTotal={newTotal => t('common.tableTotal', { count: newTotal })}
            pageSizeOptions={['10', '20', '50']}
            onChange={onChangePage}
            onShowSizeChange={onShowSizeChange}
          />
        </PaginationWrap>
      </div>
    </div>
  )
}

export default Get
