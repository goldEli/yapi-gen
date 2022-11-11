/* eslint-disable camelcase */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable multiline-ternary */
import React, { useContext, useEffect, useMemo, useState } from 'react'
import styled from '@emotion/styled'
import { useNavigate, Outlet, useLocation } from 'react-router-dom'
import IconFont from '@/components/IconFont'
import { getIsPermission } from '@/tools/index'
import { useModel } from '@/models'
import { useTranslation } from 'react-i18next'
import { Form, message, Popover } from 'antd'
import WhiteDay from './components/WhiteDay'
import { RedLogo } from '../Container/components/Side'
import { useSelector } from 'react-redux'
import { writeDaily } from '@/services/daily'

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
const AddButton = styled.div({
  height: 32,
  padding: '0 16px',
  borderRadius: 6,
  background: '#2877FF',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  color: 'white',
})

const Menu = styled.div`
  width: 100%;
  margin-top: 24px;
`

export const DailyContext: any = React.createContext('')

const MenuItem = styled.div<{ active?: boolean }>(
  {
    boxSizing: 'border-box',
    justifyContent: 'center',
    height: 44,
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    '&: hover': {
      color: '#2877ff!important',
    },
  },
  ({ active }) => ({
    borderRight: active ? '3px solid #2877ff' : '3px solid white',
    color: active ? '#2877ff' : '#323233',
    background: active ? '#F0F4FA' : 'white',
  }),
)
const Main = styled.div({
  width: 'calc(100% - 220px)',
  overflow: 'auto',
})

type MenuList = {
  id: number
  name: string
  path: string
}

const Information = () => {
  const [t] = useTranslation()
  const menuList = [
    {
      id: 1,
      name: t('p2.dayList.t1'),
      path: 'send/1',
      state: 1,
    },
    {
      id: 2,
      name: t('p2.dayList.t2'),
      path: 'send/2',
    },
    {
      id: 3,
      name: t('p2.dayList.t3'),
      path: 'send/3',
    },
    {
      id: 4,
      name: t('p2.dayList.t4'),
      path: 'send/4',
    },
    {
      id: 5,
      name: t('p2.dayList.t5'),
      path: 'get/5',
      state: 2,
    },
    {
      id: 6,
      name: t('p2.dayList.t6'),
      path: 'get/6',
      isPermission: false,
    },
    {
      id: 7,
      name: t('p2.dayList.t7'),
      path: 'get/7',
      isPermission: false,
    },
    {
      id: 8,
      name: t('p2.dayList.t8'),
      path: 'get/8',
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
  const count = useSelector((state: any) => state.counter.value)
  const { pathname } = useLocation()
  const nowPath2 = Number(pathname.split('/')[3]) || ''
  const navigate = useNavigate()
  const { userInfo } = useModel('user')
  const [visibleEdit, setVisibleEdit] = useState(false)
  const [visibleEditText, setVisibleEditText] = useState('')
  const [showPop, setShowPop] = useState(false)
  const [id, setId] = useState(1)
  const [type, setType] = useState('')
  const keyValue = {
    id,
    change: () => {
      const value = id + 1
      setId(value)
    },
  }
  const changeActive = (value: MenuList) => {
    navigate(value.path)
  }

  const editClose = () => {
    setVisibleEdit(false)
  }

  const editConfirm = async (params: any) => {
    const obj = {
      finish_content: params.info,
      plan_content: params.info2,
      copysend: params.people,
      files: params.attachments.map((item: any) => item.url),
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

  const WriteDaily = styled.div`
    cursor: pointer;
    display: flex;
    align-items: center;
    padding-left: 16px;
    width: 128px;
    height: 32px;
    &:hover {
      background: #f0f4fa;
      color: #2877ff;
    }
  `
  const RedLogo2 = styled(RedLogo)`
    right: 10px;
    top: 14px;
  `
  const onWriteDaily = (item: any) => {
    setVisibleEdit(true)
    setVisibleEditText(item.name)
    setType(item.id)
  }
  const content = (
    <div
      onClick={() => setShowPop(false)}
      style={{
        padding: '4px 0',
      }}
    >
      {writeDailyInner.map((item: any) => (
        <WriteDaily onClick={() => onWriteDaily(item)} key={item.id}>
          {item.name}
        </WriteDaily>
      ))}
    </div>
  )
  const title = menuList[(nowPath2 as number) - 1].name
  return (
    <Wrap>
      <Side>
        {getIsPermission(
          userInfo?.company_permissions,
          'b/user/fast/create',
        ) ? null : (
          <Popover
            placement="bottomLeft"
            trigger="hover"
            onVisibleChange={visible => setShowPop(visible)}
            visible={showPop}
            content={content}
            getPopupContainer={node => node}
          >
            <AddButton onClick={() => setShowPop(!showPop)}>
              <IconFont
                style={{
                  marginRight: 8,
                  fontSize: 14,
                  fontWeight: 400,
                  color: 'white',
                }}
                type="plus"
              />
              <span>{t('p2.whiteDay')}</span>
            </AddButton>
          </Popover>
        )}
        <Menu>
          {menuList.map(item => (
            <MenuItem
              style={{
                fontSize: item.state ? '16px' : '',
                fontWeight: item.state ? 'bold' : '',
                position: 'relative',
              }}
              active={nowPath2 === item.id}
              onClick={() => changeActive(item)}
              key={item.id}
              hidden={item.isPermission}
            >
              {item.state === 1 && (
                <IconFont
                  type="send"
                  style={{
                    fontSize: 20,
                    marginRight: item.state ? '6px' : '',
                    position: 'absolute',
                    left: '45px',
                  }}
                />
              )}
              {item.state === 2 && (
                <IconFont
                  type="container"
                  style={{
                    fontSize: 20,
                    marginRight: item.state ? '6px' : '',
                    position: 'absolute',
                    left: '45px',
                  }}
                />
              )}
              {item.name}
              {/* {item.state === 2 && <RedLogo2>{count}</RedLogo2>} */}
            </MenuItem>
          ))}
        </Menu>
      </Side>

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

export default Information
