// 他的模块主页

/* eslint-disable @typescript-eslint/naming-convention */
import styled from '@emotion/styled'
import {
  Outlet,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom'
import { getParamsData } from '@/tools'
import { encryptPhp } from '@/tools/cryptoPhp'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from '@store/index'
import PermissionWrap from '@/components/PermissionWrap'
import { getAsyncMember } from '@store/memberInfo'
import MyBreadcrumb from '@/components/MyBreadcrumb'
import { getProjectInfo } from '@/services/project'
import { setProjectInfo } from '@store/project'

const Wrap = styled.div<{ isMember?: any }>(
  {
    display: 'flex',
  },
  ({ isMember }) => ({
    height: isMember ? 'calc(100% - 104px)' : '100%',
  }),
)
const Main = styled.div({
  width: 'calc(100% )',
})

const MemberInfo = () => {
  const dispatch = useDispatch()
  const [t] = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData.id
  const { isMember, userId } = paramsData
  const { mainInfo } = useSelector(store => store.memberInfo)
  const { userInfo } = useSelector(store => store.user)
  const { projectInfo } = useSelector(store => store.project)

  const init = async () => {
    const result = await getProjectInfo({ projectId })
    dispatch(setProjectInfo(result))
  }
  useEffect(() => {
    // 获取当前查看人员信息
    dispatch(getAsyncMember({ userId }))
    if (isMember) {
      init()
    }
  }, [])

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
