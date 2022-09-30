/* eslint-disable multiline-ternary */
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
import { useModel } from '@/models'
import { useEffect } from 'react'

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
      color: '#2877ff!important',
    },
  },
  ({ active }) => ({
    borderRight: active ? '3px solid #2877ff' : '3px solid white',
    color: active ? '#2877ff' : '#323233',
    background: active ? '#F0F4FA' : 'white',
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

const menuList = [
  {
    id: 1,
    name: '他的概况',
    path: 'profile',
  },
  {
    id: 2,
    name: '他的待办',
    path: 'carbon',
  },
  {
    id: 3,
    name: '他的创建',
    path: 'create',
  },
  {
    id: 4,
    name: '他的已办',
    path: 'finished',
  },
]

const MemberInfo = () => {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData.id
  const { isMember, userId } = paramsData
  const { getMainInfo, mainInfo } = useModel('member')

  useEffect(() => {
    getMainInfo({ userId })
  }, [])

  const changeActive = (value: any) => {
    if (isMember) {
      const params = encryptPhp(
        JSON.stringify({ id: projectId, isMember, userId }),
      )
      navigate(`/Detail/MemberInfo/${value.path}?data=${params}`)
    } else {
      const params = encryptPhp(
        JSON.stringify({ userId, isMember: false, id: '' }),
      )
      navigate(`/MemberInfo/${value.path}?data=${params}`)
    }
  }

  return (
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
            <NameWrap style={{ margin: '0 8px 0 0 ' }}>
              {String(mainInfo?.name?.trim().slice(0, 1)).toLocaleUpperCase()}
            </NameWrap>
          )}
          <InfoItem>
            <div>{mainInfo?.name}</div>
            <span>1212121212</span>
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
        <Outlet />
      </Main>
    </Wrap>
  )
}

export default MemberInfo
