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
import HasSideCommonLayout from '@/components/HasSideCommonLayout'
import HisSide from './HisSide'

const Wrap = styled.div<{ isMember?: any }>(
  {
    display: 'flex',
  },
  ({ isMember }) => ({
    height: isMember ? 'calc(100vh - 56px)' : '100%',
  }),
)
const Main = styled.div({
  width: '100%',
})

const MemberInfo = () => {
  const dispatch = useDispatch()
  const [t] = useTranslation()
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

  // 判断是否详情回来，并且权限是不是有
  const isLength =
    projectInfo?.id && projectInfo?.projectPermissions?.length <= 0

  return (
    <PermissionWrap
      auth={isMember ? 'b/project/member/info' : 'b/companyuser/info'}
      permission={
        isMember
          ? isLength
            ? ['0']
            : projectInfo?.projectPermissions?.map((i: any) => i.identity)
          : userInfo?.company_permissions?.map((i: any) => i.identity)
      }
    >
      <HasSideCommonLayout side={<HisSide />}>
        <Wrap isMember={isMember}>
          <Main>
            <div
              style={{
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                margin: '20px',
                marginLeft: '24px',
              }}
            >
              <MyBreadcrumb user={{ name: mainInfo?.name }} />
            </div>
            <Outlet />
          </Main>
        </Wrap>
      </HasSideCommonLayout>
    </PermissionWrap>
  )
}

export default MemberInfo
