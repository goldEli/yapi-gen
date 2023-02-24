/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import CommonButton from '@/components/CommonButton'
import IconFont from '@/components/IconFont'
import useSetTitle from '@/hooks/useSetTitle'
import { writeDaily } from '@/services/daily'
import { getIsPermission } from '@/tools'
import styled from '@emotion/styled'
import { useSelector } from '@store/index'
import { message, Popover } from 'antd'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'

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

const LogSide = () => {
  const asyncSetTtile = useSetTitle()
  const [t] = useTranslation()
  asyncSetTtile(t('title.c6'))
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
  const { pathname } = useLocation()
  const nowPath2 = Number(pathname.split('/')[3]) || ''
  const navigate = useNavigate()
  const { userInfo } = useSelector(store => store.user)
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
  const changeActive = (value: any) => {
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

  const WriteDaily = styled.div`
    cursor: pointer;
    display: flex;
    align-items: center;
    padding-left: 16px;
    min-width: 128px;
    padding-right: 20px;
    height: 32px;
    &:hover {
      background: #f0f4fa;
      color: #2877ff;
    }
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
  const title = menuList[(nowPath2 as number) - 1]?.name
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
            <CommonButton type="primary" icon="plus" iconPlacement="right">
              {t('p2.whiteDay')}
            </CommonButton>
          </Popover>
        )}
        <Menu>
          {menuList.map((item: any, index: number) => (
            <>
              {index === 4 && <div className="provider" />}
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
                      left: '24px',
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
                      left: '24px',
                    }}
                  />
                )}
                {item.name}
              </MenuItem>
            </>
          ))}
        </Menu>
      </Side>
    </Wrap>
  )
}

export default LogSide
