// 设置-操作日志

/* eslint-disable no-undefined */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/naming-convention */
import styled from '@emotion/styled'
import { Select, Form, Space } from 'antd'
import moment from 'moment'
import {
  HoverWrap,
  SelectWrap,
  SelectWrapBedeck,
} from '@/components/StyleCommon'
import { useEffect, useState } from 'react'
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
import ScreenMinHover from '@/components/ScreenMinHover'

const Header = styled.div({
  height: 'auto',
  background: 'var(--neutral-white-d1)',
  position: 'sticky',
  top: 0,
  zIndex: 9,
  padding: '24px 24px 20px',
  '.title': {
    fontSize: 16,
    fontFamily: 'SiYuanMedium',
    color: 'var(--neutral-n1-d1)',
  },
  '.title-bar': {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    '.title-text': {
      fontSize: 16,
      fontFamily: 'SiYuanMedium',
      color: 'var(--neutral-n1-d1)',
    },
  },
})

const SearchWrap = styled(Space)({
  display: 'flex',
  alignItems: 'center',
  minHeight: 64,
  background: 'var(--neutral-white-d1)',
  padding: '20px 0',
  flexWrap: 'wrap',
  borderBottom: '1px solid var(--neutral-n6-d1)',
})

const Content = styled.div({
  padding: '0px 24px 0px',
  height: 'calc(100vh - 254px)',
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
  const { menuPermission } = useSelector(store => store.user)
  const [dataList, setDataList] = useState<any>({
    list: undefined,
  })
  const [staffList, setStaffList] = useState<any>([])
  const [form] = Form.useForm()
  const [order, setOrder] = useState<any>({ value: '', key: '' })
  const [pageObj, setPageObj] = useState<any>({ page: 1, size: 20 })
  const [isSpinning, setIsSpinning] = useState(false)

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
          {t('name')}
        </NewSort>
      ),
      dataIndex: 'name',
      width: 100,
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
      width: 100,
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

  const onValuesChange = () => {
    getList(pageObj, order)
  }

  return (
    <PermissionWrap
      auth="/AdminManagement/OperationManagement"
      permission={menuPermission?.menus
        ?.filter((k: any) => k.url === '/AdminManagement')?.[0]
        ?.children?.map((i: any) => i.url)}
    >
      <Form
        style={{ height: 'calc(100vh -200px)' }}
        form={form}
        onValuesChange={onValuesChange}
      >
        <Header>
          <div className="title-bar">
            <div className="title"> {t('setting.operationLog')}</div>
            <ScreenMinHover
              label={t('common.refresh')}
              icon="sync"
              onClick={onValuesChange}
            />
          </div>

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
              style={{
                color: 'var(--primary-d2)',
                fontSize: 15,
                cursor: 'pointer',
              }}
              onClick={onReset}
            >
              {t('common.clearForm')}
            </div>
          </SearchWrap>
        </Header>
        <Content>
          <ResizeTable
            dataWrapNormalHeight="100%"
            col={columns}
            dataSource={dataList.list}
            noData={<NoData />}
            isSpinning={isSpinning}
          />

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
