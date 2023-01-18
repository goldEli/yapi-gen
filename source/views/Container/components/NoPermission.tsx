// 暂无权限页面

/* eslint-disable @typescript-eslint/naming-convention */
import IconFont from '@/components/IconFont'

import styled from '@emotion/styled'
import { Button, Popover, Tooltip } from 'antd'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  getCompanyList,
  getTicket,
  loginOut,
  updateCompany,
} from '@/services/user'
import { useSelector } from '@store/index'

const Wrap = styled.div({
  height: '100vh',
  width: '100vw',
  background: '#F5F7FA',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
})

const InfoWrap = styled.div({
  width: 200,
  height: 223,
  borderRadius: 6,
  background: 'white',
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
})

const SetHead = styled.div`
  width: 40px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  border-radius: 50%;
  font-size: 14px;
  background: #a4acf5;
  background-blend-mode: normal;
  border: 1px solid #f0f2fd;
  color: white;
  margin-right: 8px;
  margin-top: 24;
`

const NameWrap = styled.div({
  marginTop: 16,
  fontSize: 14,
  color: '#323233',
})

const PhoneWrap = styled.div({
  marginTop: 4,
  fontSize: 12,
  color: '#646566',
})

const CompanyWrap = styled.div<{ active: boolean }>(
  {
    display: 'flex',
    alignItems: 'center',
    marginTop: 52,
    position: 'relative',
    '.name': {
      fontSize: 12,
      color: '#646566',
      marginRight: 8,
    },
    '.ant-popover-inner-content': {
      width: 'max-content',
    },
    '.icon': {
      svg: {
        color: '#323233',
      },
    },
    '&: hover': {
      '.icon': {
        svg: {
          color: '#2877ff',
        },
      },
    },
  },
  ({ active }) => ({
    '.icon': {
      svg: {
        color: active ? '#2877ff' : '#323233',
      },
    },
  }),
)

const IconFontWrap = styled(IconFont)<{ 'data-active'?: boolean }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  &:hover {
    background: #f0f4fa;
  }
  ${props => ({
    background: props['data-active'] ? '#f0f4fa' : 'white',
  })}
`

const Item = styled.div<{ active: boolean }>(
  {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    minWidth: 120,
    height: 32,
    boxSizing: 'border-box',
    padding: '0 16px',
    cursor: 'pointer',
    '.anticon': {
      marginLeft: 16,
    },
    '&: hover': {
      background: '#f0f4fa',
    },
  },
  ({ active }) => ({
    background: active ? '#f0f4fa' : 'white',
  }),
)

const ToastWrap = styled.div({
  fontSize: 12,
  color: '#000',
  margin: '55px 0 16px 0',
  maxWidth: 280,
  textAlign: 'center',
})

const NoPermission = () => {
  const { userInfo } = useSelector(store => store.user)
  const [companyList, setCompanyList] = useState<any[]>([])
  const [t] = useTranslation()
  const [isVisible, setIsVisible] = useState(false)
  const [activeId, setActiveId] = useState('')

  const init = async () => {
    const res2 = await getCompanyList()
    setActiveId(userInfo?.company_id)
    setCompanyList(res2.data)
  }

  useEffect(() => {
    init()
  }, [userInfo])

  // 无权限页面切换公司
  const onChangeCompany = async (item: any) => {
    setActiveId(item.id)
    if (item.id === userInfo.company_id) {
      return
    }
    const res = await updateCompany({
      companyId: item.id,
      companyUserId: item.companyUserId,
    })

    if (res.data.code === 0) {
      location.reload()
    }
  }

  // 退出登录
  const toLoginOut = async () => {
    try {
      localStorage.removeItem('saveRouter')
      await loginOut()
      setTimeout(() => {
        localStorage.removeItem('agileToken')
        localStorage.removeItem('quickCreateData')
        getTicket()
      }, 100)
    } catch (error) {
      //
    }
  }

  const content = (
    <div>
      {companyList?.map(i => (
        <Item
          key={i.id}
          onClick={() => onChangeCompany(i)}
          active={i.id === activeId}
        >
          <div>{i.name}</div>
          {i.id === activeId && (
            <IconFont type="check" style={{ fontSize: 15, color: '#4186fe' }} />
          )}
        </Item>
      ))}
    </div>
  )

  return (
    <Wrap hidden={!userInfo?.id}>
      <InfoWrap>
        {userInfo?.avatar && (
          <img
            src={userInfo?.avatar}
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              marginTop: 24,
            }}
            alt=""
          />
        )}
        {!userInfo?.avatar && (
          <SetHead>
            {String(userInfo?.name?.trim().slice(0, 1)).toLocaleUpperCase()}
          </SetHead>
        )}
        <NameWrap>{userInfo?.name}</NameWrap>
        <PhoneWrap>{userInfo?.phone}</PhoneWrap>
        <CompanyWrap active={isVisible}>
          <div className="name">{userInfo?.company_name}</div>
          <Popover
            visible={isVisible}
            onVisibleChange={visible => setIsVisible(visible)}
            content={content}
            trigger="click"
            placement="right"
            getPopupContainer={node => node}
          >
            <Tooltip placement="top" title={t('container.changeCompany')}>
              <IconFontWrap
                className="icon"
                type="swap"
                style={{ fontSize: 20 }}
                data-active={isVisible}
              />
            </Tooltip>
          </Popover>
        </CompanyWrap>
      </InfoWrap>
      <ToastWrap>{t('components.noALlPermission')}</ToastWrap>
      <Button type="primary" onClick={toLoginOut}>
        {t('components.toLogin')}
      </Button>
    </Wrap>
  )
}

export default NoPermission
