// 他的模块主页

/* eslint-disable @typescript-eslint/naming-convention */
import styled from '@emotion/styled'
import {
  Outlet,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom'
import { NameWrap } from '@/components/StyleCommon'
import { getParamsData } from '@/tools'
import { encryptPhp } from '@/tools/cryptoPhp'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from '@store/index'
import PermissionWrap from '@/components/PermissionWrap'
import { getAsyncMember } from '@store/memberInfo'
import MyBreadcrumb from '@/components/MyBreadcrumb'

const Wrap = styled.div<{ isMember?: any }>(
  {
    display: 'flex',
  },
  ({ isMember }) => ({
    height: isMember ? 'calc(100% - 64px)' : '100%',
  }),
)

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
  border-right: 1px solid #ecedef;
`

const Main = styled.div({
  width: 'calc(100% - 220px)',
  overflow: 'auto',
})

const Menu = styled.div`
  width: 100%;
  margin-top: 24px;
`

const MenuItem = styled.div<{ active?: boolean }>(
  {
    boxSizing: 'border-box',
    justifyContent: 'center',
    height: 44,
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    width: 220,
    '&: hover': {
      backgroundColor: '#F4F5F5',
    },
  },
  ({ active }) => ({
    borderRight: active ? '3px solid #2877ff' : '3px solid transparent',
    color: active ? '#2877ff' : '#323233',
    background: active ? '#F0F4FA !important' : 'transparent',
  }),
)

const InfoWrap = styled.div({
  display: 'flex',
  alignItems: 'center',
})

const InfoItem = styled.div({
  display: 'flex',
  flexDirection: 'column',
  div: {
    color: '#323233',
    fontSize: 16,
    fontWeight: 400,
  },
  span: {
    color: '#969799',
    fontSize: 14,
  },
})

const MemberInfo = () => {
  const dispatch = useDispatch()
  const [t] = useTranslation()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData.id
  const { isMember, userId } = paramsData
  const { mainInfo } = useSelector(store => store.memberInfo)
  const { userInfo } = useSelector(store => store.user)
  const { projectInfo } = useSelector(store => store.project)
  const { menuPermission } = useSelector(store => store.user)

  const menuList = [
    {
      id: 1,
      name: t('newlyAdd.hisSurvey'),
      path: 'Profile',
    },
    {
      id: 2,
      name: t('newlyAdd.hisAbeyance'),
      path: 'Carbon',
    },
    {
      id: 3,
      name: t('newlyAdd.hisCreate'),
      path: 'Create',
    },
    {
      id: 4,
      name: t('newlyAdd.hisFinish'),
      path: 'Finished',
    },
  ]
  useEffect(() => {
    // 获取当前查看人员信息
    dispatch(getAsyncMember({ userId }))
  }, [])

  const changeActive = (value: any) => {
    if (isMember) {
      const params = encryptPhp(
        JSON.stringify({ id: projectId, isMember, userId }),
      )
      navigate(`/ProjectManagement/MemberInfo/${value.path}?data=${params}`)
    } else {
      const params = encryptPhp(
        JSON.stringify({ userId, isMember: false, id: '' }),
      )
      navigate(`/MemberInfo/${value.path}?data=${params}`)
    }
  }

  if (!mainInfo) {
    return null
  }

  return (
    <PermissionWrap
      auth={isMember ? 'b/project/member/info' : 'b/companyuser/info'}
      permission={
        isMember
          ? projectInfo?.projectPermissions?.map((i: any) => i.identity)
          : userInfo?.company_permissions?.map((i: any) => i.identity)
      }
    >
      <Wrap isMember={isMember}>
        <Side>
          <InfoWrap>
            {mainInfo?.avatar ? (
              <img
                src={mainInfo?.avatar}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  marginRight: 8,
                }}
                alt=""
              />
            ) : (
              <NameWrap style={{ margin: '0 8px 0 0 ', width: 32, height: 32 }}>
                {String(mainInfo?.name?.trim().slice(0, 1)).toLocaleUpperCase()}
              </NameWrap>
            )}
            <InfoItem>
              <div>{mainInfo?.name}</div>
              <span>{mainInfo?.phone}</span>
            </InfoItem>
          </InfoWrap>
          <Menu>
            {menuList.map(item => (
              <MenuItem
                active={pathname.includes(item.path)}
                onClick={() => changeActive(item)}
                key={item.id}
              >
                {item.name}
              </MenuItem>
            ))}
          </Menu>
        </Side>
        <Main>
          <div
            style={{
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              margin: '20px',
            }}
          >
            <MyBreadcrumb user={{ name: mainInfo?.name }} />
          </div>
          <Outlet />
        </Main>
      </Wrap>
    </PermissionWrap>
  )
}

export default MemberInfo
