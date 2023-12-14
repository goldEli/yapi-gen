import styled from '@emotion/styled'
import { Drawer, Tabs } from 'antd'
import { useTranslation } from 'react-i18next'
import Setting from '../../Setting'
import Email from '../../Email'
import { CloseWrap } from '@/components/StyleCommon'
import CommonIconFont from '@/components/CommonIconFont'
import { useEffect, useRef, useState } from 'react'
import useRepeatConfirmModal from '@/hooks/useRepeatConfirmModal'
import { useDispatch, useSelector } from '@store/index'
import { setHasEdit } from '@store/SiteNotifications'

const DrawerWrap = styled(Drawer)({
  '.ant-drawer-title': {
    width: '100%',
  },
  '.ant-drawer-header': {
    padding: '0 24px 0 0',
  },
  '.ant-drawer-close': {
    margin: 0,
  },
  '.ant-drawer-header-title': {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
  },
  '.ant-drawer-mask ': {
    background: 'rgba(0, 0, 0, 0)',
  },
  '.ant-drawer-wrapper-body': {
    paddingTop: 56,
  },
})

const HeaderWrap = styled.div`
  height: 56px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .ant-tabs-nav {
    padding: 0px;
    margin: 0;
    .ant-tabs-tab {
      height: 56px;
      margin-left: 24px !important;
      border: none;
      font-size: 14px;
      color: var(--neutral-n1-d1);
    }
    .ant-tabs-tab-active {
      color: var(--primary-d1);
    }
  }
  .ant-tabs-nav::before {
    border-bottom: none;
  }
  .ant-tabs-content-holder {
    display: none;
  }
`

const TabsWrap = styled(Tabs)``

interface SiteSettingDrawerProps {
  isVisible: boolean
  onClose(): void
}

const SiteSettingDrawer = (props: SiteSettingDrawerProps) => {
  const [t] = useTranslation()
  const { isVisible, onClose } = props
  const [activeKey, setActiveKey] = useState('1')
  const dispatch = useDispatch()
  const hasEdit = useSelector(store => store.siteNotifications.hasEdit)
  const { open, RepeatConfirmModal } = useRepeatConfirmModal()
  // const setRef = useRef<any>()
  // const emailRef = useRef<any>()

  const onCloseDrawer = () => {
    onClose()
    setActiveKey('1')
    // dispatch(setHasEdit(false))
  }

  // useEffect(() => {
  //   if (hasEdit) {
  //     open({
  //       title: '确认取消',
  //       text: '当前编辑内容还未保存是否保存？',
  //       hasIcon: true,
  //       okText: '保存',
  //       cancelText: '放弃保存',
  //       onCancel: () => {
  //         onCloseDrawer()
  //       },
  //       onConfirm: () => {
  //         // props.onDeleteConfirm(item.id)
  //         return Promise.resolve()
  //       },
  //     })
  //   }
  // }, [hasEdit])

  const tabList = [
    {
      key: '1',
      label: t('notificationItemSettings'),
      children: <Setting onClose={onCloseDrawer} />,
    },
    {
      key: '2',
      label: t('settings'),
      children: <Email onClose={onCloseDrawer} />,
    },
  ]

  return (
    <DrawerWrap
      open={isVisible}
      onClose={onCloseDrawer}
      destroyOnClose
      placement="right"
      width={960}
      closable={false}
      // maskClosable={false}
      // keyboard={false}
      zIndex={100}
      title={
        <HeaderWrap>
          <TabsWrap
            items={tabList}
            activeKey={activeKey}
            onChange={setActiveKey}
          />
          <CloseWrap width={32} height={32} onClick={onCloseDrawer}>
            <CommonIconFont size={20} type="close" />
          </CloseWrap>
        </HeaderWrap>
      }
      headerStyle={{ width: '100%' }}
    >
      {tabList?.filter((i: any) => i.key === activeKey)[0]?.children}
      <RepeatConfirmModal />
    </DrawerWrap>
  )
}

export default SiteSettingDrawer
