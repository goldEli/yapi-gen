// 日志主页面

/* eslint-disable camelcase */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable @typescript-eslint/naming-convention */
import React, { useState } from 'react'
import styled from '@emotion/styled'
import { useNavigate, Outlet, useLocation } from 'react-router-dom'
import IconFont from '@/components/IconFont'
import { getIsPermission } from '@/tools/index'
import { useSelector } from '@store/index'
import { useTranslation } from 'react-i18next'
import { message, Popover } from 'antd'
import WhiteDay from './components/WhiteDay'
import { writeDaily } from '@/services/daily'
import useSetTitle from '@/hooks/useSetTitle'
import { BooleanString } from 'cos-js-sdk-v5'

const Wrap = styled.div`
  height: 100%;
  display: flex;
`
const Side = styled.div`
  align-self: stretch;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  padding-top: 24px;
  width: 220px;
  background: rgba(255, 255, 255, 1);
  flex-shrink: 0;
`
const AddButton = styled.button({
  height: 32,
  padding: '0 16px',
  borderRadius: 6,
  background: '#2877FF',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  color: 'white',
  border: 'none',
  ':hover': {
    background: '#669FFF',
    color: 'white',
  },
})

const Menu = styled.div`
  width: 100%;
  margin-top: 24px;
  .provider {
    height: 1px;
    background: #ecedef;
    width: calc(100% - 32px);
    margin-left: 16px;
  }
`

export const DailyContext: any = React.createContext('')

const MenuItem = styled.div<{ active?: any }>(
  ({ active }) => ({
    borderRight: active ? '3px solid #2877ff' : '3px solid transparent',
    color: active ? '#2877ff' : '#323233',
    background: active ? '#F0F4FA !important' : 'white',
  }),
  {
    boxSizing: 'border-box',
    height: 44,
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    paddingLeft: 52,
    '&: hover': {
      backgroundColor: '#F4F5F5',
    },
  },
)
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
      message.success(t('setting.success'))
      editClose()
      keyValue.change()
    }
  }
  const title = menuList[(nowPath2 as number) - 1]?.name
  return (
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
            fontWeight: 'bold',
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
  )
}

export default LogManagement
