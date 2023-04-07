/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable no-undefined */
import CommonButton from '@/components/CommonButton'
import CommonModal from '@/components/CommonModal'
import CommonUserAvatar from '@/components/CommonUserAvatar'
import InputSearch from '@/components/InputSearch'
import NoData from '@/components/NoData'
import { getSubscribeList } from '@/services/calendar'
import styled from '@emotion/styled'
import { setIsShowSubscribeVisible } from '@store/calendar'
import { useDispatch, useSelector } from '@store/index'
import { Tabs, Tooltip } from 'antd'
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
    background: red;
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
  type: string
  searchValue: string
}

const TabsContent = (props: TabsContentProps) => {
  const [dataList, setDataList] = useState<{
    list?: Model.Calendar.SubscribeInfo[]
  }>()

  const getList = async () => {
    setDataList({})
    const response = await getSubscribeList({ type: props.type })
    setDataList({ list: response.data.list })
  }

  useEffect(() => {
    getList()
  }, [])

  return (
    <TabsContentWrap>
      {props.type !== '0' && (
        <TabsBox>
          {dataList?.list &&
            dataList?.list.length > 0 &&
            dataList?.list
              ?.filter((i: Model.Calendar.SubscribeInfo) =>
                i.name.includes(props.searchValue),
              )
              .map((i: Model.Calendar.SubscribeInfo) => (
                <TabsItem key={i.id}>
                  <TabsItemLeft>
                    <div className="icon" />
                    <div className="content">
                      <div className="title">{i.name}</div>
                      <div className="sub">
                        <span>创建人：{i.creator}</span>
                        <span>订阅量：{i.number}</span>
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
                  {i.is_subscribe === 1 && (
                    <CommonButton type="secondary">
                      <div style={{ minWidth: 58 }}>订阅</div>
                    </CommonButton>
                  )}
                  {!i.is_subscribe && (
                    <CommonButton type="light">
                      <div style={{ minWidth: 58 }}>取消订阅</div>
                    </CommonButton>
                  )}
                </TabsItem>
              ))}
          {(!dataList?.list ||
            dataList?.list.filter((i: Model.Calendar.SubscribeInfo) =>
              i.name.includes(props.searchValue),
            ).length <= 0) && <NoData />}
        </TabsBox>
      )}
      {props.type === '0' && (
        <TabsBox>
          {dataList?.list &&
            dataList?.list.length > 0 &&
            dataList?.list
              .filter((i: Model.Calendar.SubscribeInfo) =>
                i.name.includes(props.searchValue),
              )
              .map((i: Model.Calendar.SubscribeInfo) => (
                <TabsItemLi key={i.id}>
                  <div className="nameBox">
                    <div className="avatar">
                      <CommonUserAvatar size="large" />
                    </div>
                    <div className="name">
                      <span className="label">{i.name}</span>
                      <span className="sub">{i.department}</span>
                    </div>
                  </div>
                  <div className="otherBox">{i.phone}</div>
                  <div className="otherBox">{i.email}</div>
                  <div
                    className="otherBox"
                    style={{ justifyContent: 'flex-end' }}
                  >
                    {i.is_subscribe === 1 && (
                      <CommonButton type="secondary">
                        <div style={{ minWidth: 58 }}>订阅</div>
                      </CommonButton>
                    )}
                    {!i.is_subscribe && (
                      <CommonButton type="light">
                        <div style={{ minWidth: 58 }}>取消订阅</div>
                      </CommonButton>
                    )}
                  </div>
                </TabsItemLi>
              ))}
          {(!dataList?.list ||
            dataList?.list.filter((i: Model.Calendar.SubscribeInfo) =>
              i.name.includes(props.searchValue),
            ).length <= 0) && <NoData />}
        </TabsBox>
      )}
    </TabsContentWrap>
  )
}

const CalendarSubscribe = () => {
  const dispatch = useDispatch()
  const { isShowSubscribeVisible } = useSelector(store => store.calendar)
  const [activeKey, setActiveKey] = useState('0')
  const [searchValue, setSearchValue] = useState('')
  const items = [
    {
      key: '0',
      label: '订阅联系人',
      children: <TabsContent type={activeKey} searchValue={searchValue} />,
    },
    {
      key: '1',
      label: '公开日历',
      children: <TabsContent type={activeKey} searchValue={searchValue} />,
    },
    {
      key: '2',
      label: '节假日',
      children: <TabsContent type={activeKey} searchValue={searchValue} />,
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

  const onChangeTabsActive = (value: string) => {
    setActiveKey(value)
    setSearchValue('')
  }

  const onClose = () => {
    dispatch(setIsShowSubscribeVisible(false))
  }

  return (
    <CommonModal
      isVisible={isShowSubscribeVisible}
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
