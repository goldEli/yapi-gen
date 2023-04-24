// 日志主页面

/* eslint-disable camelcase */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable @typescript-eslint/naming-convention */
import React, { useState } from 'react'
import styled from '@emotion/styled'
import { Outlet, useLocation } from 'react-router-dom'
import { useSelector } from '@store/index'
import { useTranslation } from 'react-i18next'
import { message } from 'antd'
import WhiteDay from './components/WhiteDay'
import { writeDaily } from '@/services/daily'
import useSetTitle from '@/hooks/useSetTitle'
import PermissionWrap from '@/components/PermissionWrap'
import { getMessage } from '@/components/Message'

const Wrap = styled.div`
  height: 100%;
  display: flex;
  position: relative;
`

export const DailyContext: any = React.createContext('')

const Main = styled.div({
  width: '100%',
  overflow: 'auto',
})

const LogManagement = () => {
  const asyncSetTtile = useSetTitle()
  const [t] = useTranslation()
  asyncSetTtile(t('title.c6'))
  const menuList = [
    {
      id: 1,
      name: t('p2.dayList.t1'),
      path: '/LogManagement/Send/1',
      state: 1,
    },
    {
      id: 2,
      name: t('p2.dayList.t2'),
      path: '/LogManagement/Send/2',
    },
    {
      id: 3,
      name: t('p2.dayList.t3'),
      path: '/LogManagement/Send/3',
    },
    {
      id: 4,
      name: t('p2.dayList.t4'),
      path: '/LogManagement/Send/4',
    },
    {
      id: 5,
      name: t('p2.dayList.t5'),
      path: '/LogManagement/Get/5',
      state: 2,
    },
    {
      id: 6,
      name: t('p2.dayList.t6'),
      path: '/LogManagement/Get/6',
      isPermission: false,
    },
    {
      id: 7,
      name: t('p2.dayList.t7'),
      path: '/LogManagement/Get/7',
      isPermission: false,
    },
    {
      id: 8,
      name: t('p2.dayList.t8'),
      path: '/LogManagement/Get/8',
      isPermission: false,
    },
  ]
  const writeDailyInner = [
    {
      id: 1,
      name: t('p2.whiteList.t1'),
    },
    {
      id: 2,
      name: t('p2.whiteList.t2'),
    },
    {
      id: 3,
      name: t('p2.whiteList.t3'),
    },
  ]
  const { pathname } = useLocation()
  const nowPath2 = Number(pathname.split('/')[3]) || ''
  const [visibleEdit, setVisibleEdit] = useState(false)
  const { menuPermission } = useSelector(store => store.user)
  const [visibleEditText, setVisibleEditText] = useState('')
  const [id, setId] = useState(1)
  const [type, setType] = useState('')
  const keyValue = {
    id,
    change: () => {
      const value = id + 1
      setId(value)
    },
  }

  const editClose = () => {
    setVisibleEdit(false)
  }

  const editConfirm = async (params: any) => {
    const obj = {
      finish_content: params.info,
      plan_content: params.info2,
      copysend: params.people,
      files: params.attachments,
      story_ids: params.needs,
      type: writeDailyInner[
        writeDailyInner.findIndex((item: any) => item.name === visibleEditText)
      ].id,
    }

    const res = await writeDaily(obj, 1)
    if (res.code === 0) {
      getMessage({ msg: t('setting.success') as string, type: 'success' })
      editClose()
      keyValue.change()
    }
  }
  const title = menuList[(nowPath2 as number) - 1]?.name
  return (
    <PermissionWrap
      auth="/LogManagement"
      permission={menuPermission?.menus?.map((i: any) => i.url)}
    >
      <Wrap>
        {/* 右边的表格 */}
        <Main>
          <div
            style={{
              height: '64px',
              background: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              paddingLeft: '24px',
              fontSize: '16px',
              fontFamily: 'SiYuanMedium',
            }}
          >
            {title}
          </div>
          <DailyContext.Provider value={keyValue}>
            <Outlet />
          </DailyContext.Provider>
        </Main>
        {/* // 写日志的表单D */}
        <WhiteDay
          visibleEditText={visibleEditText}
          visibleEdit={visibleEdit}
          editClose={editClose}
          editConfirm={editConfirm}
          type={type}
        />
      </Wrap>
    </PermissionWrap>
  )
}

export default LogManagement
