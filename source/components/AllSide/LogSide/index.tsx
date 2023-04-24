/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import IconFont from '@/components/IconFont'
import { getMessage } from '@/components/Message'
import useSetTitle from '@/hooks/useSetTitle'
import { writeDaily } from '@/services/daily'
import WhiteDay from '@/views/LogManagement/components/WhiteDay'
import styled from '@emotion/styled'
import { useSelector } from '@store/index'
import { Popover } from 'antd'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'

const Menu = styled.div`
  width: 100%;

  .provider {
    height: 1px;
    background: var(--neutral-n6-d1);
    width: calc(100% - 32px);
    margin-left: 16px;
  }
`
export const MySpan = styled.div`
  cursor: pointer;
  width: 24px;
  height: 24px;
  color: var(--neutral-n2);
  border-radius: 6px 6px 6px 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    /* background: var(--hover-d1); */
    color: var(--primary-d2);
  }
`
const MenuItem = styled.div<{ active?: any }>(
  ({ active }) => ({
    background: active ? 'var(--gradient-left)' : '',
    color: active ? 'var(--primary-d2) !important' : '',
  }),
  {
    boxSizing: 'border-box',
    height: 44,
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    paddingLeft: 52,
    '&: hover': {
      color: 'var(--primary-d2)',
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
  const navigate = useNavigate()
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
      getMessage({ msg: t('setting.success'), type: 'success' })
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
      background: 'var(--neutral-n6-d1)';
      color: var(--primary-d1);
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
  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '24px',
          padding: '24px',
          margin: '10px 0',
        }}
      >
        <span
          style={{
            height: '22px',
            fontSize: '14px',
            fontFamily: 'SiYuanMedium',
            color: 'var(--neutral-n1-d1)',
            lineHeight: '22px',
          }}
        >
          {t('log_management')}
        </span>
        <Popover
          placement="bottomRight"
          trigger="hover"
          onVisibleChange={visible => setShowPop(visible)}
          visible={showPop}
          content={content}
          getPopupContainer={node => node}
        >
          <MySpan>
            <IconFont
              style={{
                fontSize: '16px',
              }}
              type="plus"
            />
          </MySpan>
        </Popover>
      </div>

      <Menu>
        {menuList.map((item: any, index: number) => (
          <>
            {index === 4 && <div className="provider" />}
            <MenuItem
              style={{
                fontSize: item.state ? '16px' : '',
                fontFamily: item.state ? 'SiYuanMedium' : '',
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

      <WhiteDay
        visibleEditText={visibleEditText}
        visibleEdit={visibleEdit}
        editClose={editClose}
        editConfirm={editConfirm}
        type={type}
      />
    </div>
  )
}

export default LogSide
