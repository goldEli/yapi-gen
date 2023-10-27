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
import { getContactStatistics } from '@/services/SiteNotifications'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

const AllSideFilter = (props: any) => {
  const [t] = useTranslation()
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
      text: t('pm'),
      sendType: 'project',
      read: 0,
    },
    {
      id: '3',
      icon: 'bell',
      icon2: 'bell-sel',
      text: t('systematic_notification'),
      sendType: 'sys',
      read: 0,
    },
    {
      id: '4',
      icon: 'calendar-nor',
      icon2: 'calendar-sel',
      text: t('schedule_management'),
      sendType: 'calendar',
      read: 0,
    },
    {
      id: '5',
      icon: 'log-nor',
      icon2: 'log-sel',
      text: t('work_report'),
      sendType: 'report',
      read: 0,
    },
  ]
  const { id: pid } = useParams()
  const [active, setActive] = useState('')
  const [lists, setLists] = useState<any>([])
  const [checeks, setCheceks] = useState<any>([])
  const { isVisibleFilter, all } = useSelector(store => store.siteNotifications)
  const configuration = useSelector(
    store => store.siteNotifications.configuration,
  )
  const isRefresh = useSelector(store => store.user.isRefresh)
  const dispatch = useDispatch()
  const onClose = () => {
    dispatch(changeVisibleFilter(false))
  }

  const onChange = (checkedValues: any) => {
    setCheceks(checkedValues)
    props.changeMsg(checkedValues.length < 1 ? undefined : checkedValues)
  }
  const choose = (id: any) => {
    if (id === active) {
      setActive('')
      setCheceks([])
      props.changeUser(undefined, undefined)
    } else {
      const checkes = configuration[
        configuration.findIndex((i: any) => i.sendType === id)
      ].children.map((i: any) => i.value)

      setActive(id)
      setCheceks(checkes)
      props.changeUser(id, checkes)
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
    isVisibleFilter ? init() : null
  }, [isVisibleFilter, isRefresh, all])

  useEffect(() => {
    setActive('')
  }, [pid])

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
          <CloseWrap
            onClick={onClose}
            width={32}
            height={32}
            style={{ marginRight: 18 }}
          >
            <IconFont
              style={{ fontSize: 20, color: 'var(--neutral-n2)' }}
              type="close"
            />
          </CloseWrap>
        </MyHead>
        <MyIconModeTextWrap>
          {lists.map((i: any) => (
            <Badge
              key={i.id}
              size="small"
              offset={[-22, 6]}
              style={{ padding: '0 4px' }}
              count={i.read}
            >
              <MyIconModeWrap onClick={() => choose(i.sendType)}>
                <MyIconMode tap={i.read} active={active === i.sendType}>
                  <IconFont
                    style={{ fontSize: 24 }}
                    type={active === i.sendType ? i.icon2 : i.icon}
                  />
                </MyIconMode>
                <MyIconModeText>{i.text}</MyIconModeText>
              </MyIconModeWrap>
            </Badge>
          ))}
        </MyIconModeTextWrap>
        {active ? (
          <MyHead>
            <LeftTitle title={t('Notices')} />
            <ResetB
              style={{
                marginRight: '24px',
              }}
              onClick={() => onChange([])}
            >
              {t('reset_filtering') as string}
            </ResetB>
          </MyHead>
        ) : null}

        <InfoWrap>
          {active ? (
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
          ) : null}
        </InfoWrap>
      </Wrap>
    </Drawer>
  )
}

export default AllSideFilter
