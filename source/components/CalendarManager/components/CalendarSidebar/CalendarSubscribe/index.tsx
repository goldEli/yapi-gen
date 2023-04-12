/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable no-undefined */
import CommonButton from '@/components/CommonButton'
import CommonModal from '@/components/CommonModal'
import CommonUserAvatar from '@/components/CommonUserAvatar'
import InputSearch from '@/components/InputSearch'
import NoData from '@/components/NoData'
import {
  getContactsCalendarList,
  getSubscribeList,
  subscribeCalendar,
  unsubscribeCalendar,
} from '@/services/calendar'
import styled from '@emotion/styled'
import { setSubscribeModal } from '@store/calendar'
import { getCalendarList } from '@store/calendar/calendar.thunk'
import { useDispatch, useSelector } from '@store/index'
import { Tabs, Tooltip, message } from 'antd'
import { createRef, useEffect, useMemo, useRef, useState } from 'react'

const ContentWrap = styled.div`
  padding: 0 24px;
  background: var(--neutral-white-d5);
  border-radius: 6px;
`

const TabsWrap = styled(Tabs)`
  .ant-tabs-nav {
    height: 52px;
    margin: 0;
  }
  .ant-tabs-tab-btn {
    font-size: 14px;
    color: var(--neutral-n2);
  }
  .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
    color: var(--primary-d1);
    text-shadow: none;
    font-family: SiYuanMedium;
  }
`

const TabsContentWrap = styled.div`
  padding: 8px 0;
`

const TabsBox = styled.div`
  height: 60vh;
  overflow: auto;
`

const TabsItem = styled.div`
  min-height: 76px;
  margin-top: 8px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  border-radius: 6px;
  &:hover {
    background: var(--hover-d2);
  }
`

const TabsItemLeft = styled.div`
  display: flex;
  justify-content: flex-start;
  width: 83%;
  position: relative;
  .icon {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    margin-right: 12px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .content {
    display: flex;
    flex-direction: column;
    width: 86%;
    .title {
      font-size: 14px;
      color: var(--neutral-n1-d1);
    }
    .sub {
      display: flex;
      align-items: center;
      font-size: 12px;
      color: var(--neutral-n3);
      span:first-child {
        margin-right: 32px;
      }
    }
    .describe {
      font-size: 12px;
      color: var(--neutral-n3);
      width: 100%;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
  }
`

const TabsItemLi = styled.div`
  display: flex;
  align-items: center;
  height: 56px;
  padding: 0 12px;
  border-radius: 6px;
  margin-top: 8px;
  .nameBox {
    display: flex;
    align-items: center;
    width: 32%;
    .avatar {
      border: 1px solid var(--avatar-border);
      width: 33px;
      height: 33px;
      border-radius: 50%;
    }
    .name {
      display: flex;
      flex-direction: column;
      margin-left: 12px;
      .label {
        font-size: 14px;
        color: var(--neutral-n1-d1);
      }
      .sub {
        font-size: 12px;
        color: var(--neutral-n3);
      }
    }
  }
  .otherBox {
    width: 24%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  &:hover {
    background: var(--hover-d2);
  }
`

interface TabsContentProps {
  dataList?: Model.Calendar.SubscribeInfo[]
  dataUserList?: Model.Calendar.GetContactsCalendarInfo[]
  type: string
}

const TabsContent = (props: TabsContentProps) => {
  const [dataList, setDataList] = useState<Model.Calendar.SubscribeInfo[]>()
  const [dataUserList, setDataUserList] =
    useState<Model.Calendar.GetContactsCalendarInfo[]>()
  const dispatch = useDispatch()
  // 取消订阅
  const onCancelSubscribe = async (id: number) => {
    await unsubscribeCalendar({ id })
    message.success('取消订阅成功!')
    dispatch(getCalendarList())
    if (props.type === '0') {
      const resultData = dataUserList?.map(
        (i: Model.Calendar.GetContactsCalendarInfo) => ({
          ...i,
          status: i.id === id ? 2 : i.status,
        }),
      )
      setDataUserList(resultData)
    } else {
      const resultData = dataList?.map((i: Model.Calendar.SubscribeInfo) => ({
        ...i,
        status: i.id === id ? 2 : i.status,
      }))
      setDataList(resultData)
    }
  }

  // 订阅
  const onSubscribe = async (id: number) => {
    await subscribeCalendar({ id })
    message.success('订阅成功!')
    dispatch(getCalendarList())
    if (props.type === '0') {
      const newData = dataUserList?.map(
        (i: Model.Calendar.GetContactsCalendarInfo) => ({
          ...i,
          status: i.id === id ? 1 : i.status,
        }),
      )
      setDataUserList(newData)
    } else {
      const newData = dataList?.map((i: Model.Calendar.SubscribeInfo) => ({
        ...i,
        status: i.id === id ? 1 : i.status,
      }))
      setDataList(newData)
    }
  }

  useEffect(() => {
    setDataList(props.dataList)
  }, [props.dataList])

  useEffect(() => {
    setDataUserList(props.dataUserList)
  }, [props.dataUserList])

  return (
    <TabsContentWrap>
      {props.type !== '0' && (
        <TabsBox>
          {dataList &&
            dataList.length > 0 &&
            dataList.map((i: Model.Calendar.SubscribeInfo) => (
              <TabsItem key={i.id}>
                <TabsItemLeft>
                  <div className="icon">
                    <img src={i.icon} alt="" />
                  </div>
                  <div className="content">
                    <div className="title">{i.name}</div>
                    <div className="sub">
                      <span>创建人：{i.user.name}</span>
                      <span>订阅量：{i.subscribe_num}</span>
                    </div>
                    <Tooltip
                      title={i.describe}
                      placement="topLeft"
                      getPopupContainer={n => n}
                    >
                      <div className="describe">{i.describe}</div>
                    </Tooltip>
                  </div>
                </TabsItemLeft>
                {i.status === 1 && (
                  <CommonButton
                    type="light"
                    onClick={() => onCancelSubscribe(i.id)}
                  >
                    <div style={{ minWidth: 58 }}>取消订阅</div>
                  </CommonButton>
                )}
                {i.status === 2 && (
                  <CommonButton type="secondary">
                    <div
                      style={{ minWidth: 58 }}
                      onClick={() => onSubscribe(i.id)}
                    >
                      订阅
                    </div>
                  </CommonButton>
                )}
              </TabsItem>
            ))}
          {dataList && dataList.length <= 0 && <NoData />}
        </TabsBox>
      )}
      {props.type === '0' && (
        <TabsBox>
          {dataUserList &&
            dataUserList.length > 0 &&
            dataUserList.map((i: Model.Calendar.GetContactsCalendarInfo) => (
              <TabsItemLi key={i.id}>
                <div className="nameBox">
                  <div className="avatar">
                    <CommonUserAvatar size="large" />
                  </div>
                  <div className="name">
                    <span className="label">{i.user.name}</span>
                    <span className="sub">
                      {i.user.department_name}-{i.user.job_name}
                    </span>
                  </div>
                </div>
                <div className="otherBox">{i.user.phone}</div>
                <div className="otherBox">{i.user.email}</div>
                <div
                  className="otherBox"
                  style={{ justifyContent: 'flex-end' }}
                >
                  {i.status === 1 && (
                    <CommonButton type="light">
                      <div
                        style={{ minWidth: 58 }}
                        onClick={() => onCancelSubscribe(i.id)}
                      >
                        取消订阅
                      </div>
                    </CommonButton>
                  )}
                  {i.status === 2 && (
                    <CommonButton type="secondary">
                      <div
                        style={{ minWidth: 58 }}
                        onClick={() => onSubscribe(i.id)}
                      >
                        订阅
                      </div>
                    </CommonButton>
                  )}
                </div>
              </TabsItemLi>
            ))}
          {dataUserList && dataUserList.length <= 0 && <NoData />}
        </TabsBox>
      )}
    </TabsContentWrap>
  )
}

const CalendarSubscribe = () => {
  const dispatch = useDispatch()
  const { subscribeModal } = useSelector(store => store.calendar)
  const [activeKey, setActiveKey] = useState('0')
  const [searchValue, setSearchValue] = useState('')
  const [dataList, setDataList] = useState<{
    list?: Model.Calendar.SubscribeInfo[]
  }>()
  const [dataUserList, setDataUserList] = useState<{
    list?: Model.Calendar.GetContactsCalendarInfo[]
  }>()

  const items = [
    {
      key: '0',
      label: '订阅联系人',
      children: (
        <TabsContent type={activeKey} dataUserList={dataUserList?.list} />
      ),
    },
    {
      key: '1',
      label: '公开日历',
      children: <TabsContent type={activeKey} dataList={dataList?.list} />,
    },
    {
      key: '2',
      label: '节假日',
      children: <TabsContent type={activeKey} dataList={dataList?.list} />,
    },
  ]

  const operations = (
    <InputSearch
      placeholder={activeKey === '0' ? '搜索联系人姓名' : '搜索日历名称'}
      leftIcon
      width={184}
      onChangeSearch={setSearchValue}
      defaultValue={searchValue}
    />
  )

  // 获取公开日历及节假日 列表
  const getSubscribeData = async (value: string) => {
    setDataList({})
    const response = await getSubscribeList({
      type: value,
      keywords: searchValue,
    })
    setDataList({ list: response.data.list })
  }

  // 获取订阅联系人列表
  const getContactsCalendarData = async () => {
    setDataUserList({})
    const response = await getContactsCalendarList({
      username: searchValue,
    })
    setDataUserList({ list: response.data.list })
  }

  // 切换tab
  const onChangeTabsActive = (value: string) => {
    setActiveKey(value)
    setSearchValue('')
    if (value === '0') {
      getContactsCalendarData()
    } else {
      getSubscribeData(value)
    }
  }

  // 关闭弹窗
  const onClose = () => {
    dispatch(setSubscribeModal(false))
    setActiveKey('0')
    setSearchValue('')
  }

  useEffect(() => {
    if (subscribeModal) {
      getContactsCalendarData()
    }
  }, [subscribeModal])

  useEffect(() => {
    if (activeKey === '0') {
      getContactsCalendarData()
    } else {
      getSubscribeData(activeKey)
    }
  }, [searchValue])

  return (
    <CommonModal
      isVisible={subscribeModal}
      isShowFooter
      title="订阅日历"
      width={784}
      onClose={onClose}
    >
      <ContentWrap>
        <TabsWrap
          items={items}
          tabBarExtraContent={operations}
          onChange={onChangeTabsActive}
          destroyInactiveTabPane
        />
      </ContentWrap>
    </CommonModal>
  )
}

export default CalendarSubscribe
