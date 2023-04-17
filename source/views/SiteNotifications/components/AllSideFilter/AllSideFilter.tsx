/* eslint-disable no-undefined */
import IconFont from '@/components/IconFont'
import LeftTitle from '@/components/LeftTitle'
import { useDispatch, useSelector } from '@store/index'
import { changeVisibleFilter } from '@store/SiteNotifications'
import { Badge, Checkbox, Drawer } from 'antd'
import React, { useEffect, useState } from 'react'
import { CloseWrap } from '../SiteDrawer/style'
import {
  InfoWrap,
  InfoWrapItem,
  MyHead,
  MyIconMode,
  MyIconModeText,
  MyIconModeTextWrap,
  MyIconModeWrap,
  ResetB,
  Wrap,
} from './style'
import { t } from 'i18next'
import { getContactStatistics } from '@/services/SiteNotifications'

const AllSideFilter = (props: any) => {
  const items = [
    // {
    //   id: '1',
    //   icon: 'package-nor',
    //   icon2: 'package-sel',
    //   text: '产品管理',
    //   sendType:'product'
    // },
    {
      id: '2',
      icon: 'folder-open-nor',
      icon2: 'folder-open-sel',
      text: '项目管理',
      sendType: 'project',
      read: 0,
    },
    {
      id: '3',
      icon: 'bell',
      icon2: 'bell-sel',
      text: '系统通知',
      sendType: 'sys',
      read: 0,
    },
    {
      id: '4',
      icon: 'calendar-nor',
      icon2: 'calendar-sel',
      text: '日程管理',
      sendType: 'calendar',
      read: 0,
    },
    {
      id: '5',
      icon: 'log-nor',
      icon2: 'log-sel',
      text: '工作汇报',
      sendType: 'report',
      read: 0,
    },
  ]
  const [active, setActive] = useState('')
  const [lists, setLists] = useState<any>([])
  const [checeks, setCheceks] = useState<any>([])
  const isVisibleFilter = useSelector(
    store => store.siteNotifications.isVisibleFilter,
  )
  const configuration = useSelector(
    store => store.siteNotifications.configuration,
  )
  const dispatch = useDispatch()
  const onClose = () => {
    dispatch(changeVisibleFilter(false))
  }

  const onChange = (checkedValues: any) => {
    setCheceks(checkedValues)
    props.changeMsg(checkedValues)
  }
  const choose = (id: any) => {
    if (id === active) {
      setActive('')
      setCheceks([])
      props.changeUser(undefined, [])
    } else {
      setActive(id)
      props.changeUser(id, [])
    }
  }

  const init = async () => {
    const res = await getContactStatistics()

    items.forEach((i: any) => {
      res.list.forEach((j: any) => {
        if (i.sendType === j.send_user) {
          i.read = Number(j.nread)
        }
      })
    })

    setLists(items)
  }

  useEffect(() => {
    init()
  }, [])

  return (
    <Drawer
      bodyStyle={{ padding: 0, paddingBottom: '8px', boxSizing: 'border-box' }}
      width={328}
      zIndex={1}
      closable={false}
      mask={false}
      placement="right"
      onClose={onClose}
      open={isVisibleFilter}
    >
      <Wrap>
        <MyHead>
          <LeftTitle title={t('filtering_notifications')} />
          <CloseWrap onClick={onClose} width={32} height={32}>
            <IconFont
              style={{ fontSize: 20, color: 'var(--neutral-n2)' }}
              type="close"
            />
          </CloseWrap>
        </MyHead>
        <MyIconModeTextWrap>
          {lists.map((i: any) => (
            <Badge key={i.id} size="small" offset={[-22, 6]} count={i.read}>
              <MyIconModeWrap
                onClick={() => (i.read ? choose(i.sendType) : null)}
              >
                <MyIconMode tap={i.read} active={active === i.sendType}>
                  <IconFont
                    style={{ fontSize: 20 }}
                    type={active === i.sendType ? i.icon2 : i.icon}
                  />
                </MyIconMode>
                <MyIconModeText>{i.text}</MyIconModeText>
              </MyIconModeWrap>
            </Badge>
          ))}
        </MyIconModeTextWrap>
        <MyHead>
          <LeftTitle title={t('Notices')} />
          <ResetB onClick={() => onChange([])}>
            {t('reset_filtering') as string}
          </ResetB>
        </MyHead>
        <InfoWrap>
          {active && (
            <Checkbox.Group
              value={checeks}
              style={{ width: '100%' }}
              onChange={onChange}
            >
              {configuration[
                configuration.findIndex((i: any) => i.sendType === active)
              ].children?.map((i: any) => {
                return (
                  <InfoWrapItem key={i.value}>
                    <span>{i.label}</span>
                    <Checkbox value={i.value} />
                  </InfoWrapItem>
                )
              })}
            </Checkbox.Group>
          )}
        </InfoWrap>
      </Wrap>
    </Drawer>
  )
}

export default AllSideFilter
