// 设置-登录日志

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/naming-convention */
import styled from '@emotion/styled'
import { Form, Space } from 'antd'
import moment from 'moment'
import {
  HoverWrap,
  SelectWrap,
  SelectWrapBedeck,
} from '@/components/StyleCommon'
import { useEffect, useState, useLayoutEffect } from 'react'
import Sort from '@/components/Sort'
import { useTranslation } from 'react-i18next'
import NoData from '@/components/NoData'
import RangePicker from '@/components/RangePicker'
import useSetTitle from '@/hooks/useSetTitle'
import { getStaffList } from '@/services/staff'
import { getLoginLogs } from '@/services/setting'
import { useSelector } from '@store/index'
import PermissionWrap from '@/components/PermissionWrap'
import IconFont from '@/components/IconFont'
import PaginationBox from '@/components/TablePagination'
import ResizeTable from '@/components/ResizeTable'
import ScreenMinHover from '@/components/ScreenMinHover'

const Header = styled.div({
  height: 'auto',
  background: 'var(--neutral-white-d1)',
  position: 'sticky',
  top: 0,
  zIndex: 9,
  padding: '24px 24px 20px',
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
    color: 'var(--neutral-n1-d2)',
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
      style={{ height: 44 }}
    >
      {sortProps.children}
    </Sort>
  )
}

const LoginManagement = () => {
  const asyncSetTtile = useSetTitle()
  const [t] = useTranslation()
  asyncSetTtile(t('title.c4'))
  const { userInfo } = useSelector(store => store.user)
  const { menuPermission } = useSelector(store => store.user)
  const [dataList, setDataList] = useState<any>([])
  const [staffList, setStaffList] = useState<any>([])
  const [form] = Form.useForm()
  const [order, setOrder] = useState<any>({ value: '', key: '' })
  const [pageObj, setPageObj] = useState<any>({ page: 1, size: 30 })
  const [isSpinning, setIsSpinning] = useState(false)
  const [boxMaps, setBoxMaps] = useState<any>()
  const getList = async (pageObjVal?: any, orderVal?: any) => {
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
        pageSize: pageObjVal.size,
        page: pageObjVal.page,
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
    getList(pageObj, order)
    getStaff()
  }, [])
  useLayoutEffect(() => {
    const map: any = new Map()
    const box = document.querySelectorAll('.SelectWrapBedeck')
    box.forEach(item => {
      const attr = item.getAttribute('datatype')
      const w = item.getBoundingClientRect().width
      map.set(attr, w)
    })
    setBoxMaps(map)
  }, [])
  const onUpdateOrderKey = (key: any, val: any) => {
    setOrder({ value: val === 2 ? 'desc' : 'asc', key })
    getList(pageObj, { value: val === 2 ? 'desc' : 'asc', key })
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
      width: 200,
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
      width: 200,
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
      width: 200,
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
      width: 200,
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
      width: 200,
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
      render: (text: number) => {
        return (
          <StatusWrap>
            <div
              style={{
                background:
                  text === 1
                    ? 'var(--function-success)'
                    : 'var(--function-error)',
              }}
            />
            <span>
              {text === 1 ? t('setting.success') : t('setting.failed')}
            </span>
          </StatusWrap>
        )
      },
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
      auth="/AdminManagement/LoginManagement"
      permission={menuPermission?.menus
        ?.filter((k: any) => k.url === '/AdminManagement')?.[0]
        ?.children?.map((i: any) => i.url)}
    >
      <Form
        style={{ height: '100%' }}
        form={form}
        onValuesChange={onValuesChange}
      >
        <Header>
          <div className="title-bar">
            <div className="title-text"> {t('setting.loginLog')} </div>
            <ScreenMinHover
              label={t('common.refresh')}
              icon="sync"
              onClick={onValuesChange}
            />
          </div>
          <SearchWrap size={16}>
            <SelectWrapBedeck className="SelectWrapBedeck" datatype="userIds">
              <span style={{ margin: '0 12px', fontSize: '14px' }}>
                {t('setting.loginUser')}
              </span>
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
                  getPopupContainer={(node: any) => node}
                  placement="bottomRight"
                  dropdownMatchSelectWidth={boxMaps?.get('userIds')}
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

export default LoginManagement
