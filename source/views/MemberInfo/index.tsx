/* eslint-disable react/jsx-no-leaked-render */
// 他的模块主页

/* eslint-disable @typescript-eslint/naming-convention */
import styled from '@emotion/styled'
import { Outlet, useSearchParams } from 'react-router-dom'
import { getParamsData } from '@/tools'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from '@store/index'
import PermissionWrap from '@/components/PermissionWrap'
import { getAsyncMember } from '@store/memberInfo'
import MyBreadcrumb from '@/components/MyBreadcrumb'
import { getProjectInfo } from '@/services/project'
import { setProjectInfo } from '@store/project'
import HisSide from './HisSide'

const Main = styled.div({
  width: 'calc(100% - 220px)',
  height: '100%',
})

const MainWrap = styled.div`
  display: flex;
  width: 100%;
  height: calc(100vh - 56px);
`

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
      {isMember && (
        <div>
          <div style={{ padding: '20px 24px' }}>
            <MyBreadcrumb user={{ name: mainInfo?.name }} />
          </div>
          <MainWrap>
            <HisSide />
            <Main>
              <Outlet />
            </Main>
          </MainWrap>
        </div>
      )}
      {!isMember && (
        <MainWrap>
          <HisSide />
          <Main>
            <Outlet />
          </Main>
        </MainWrap>
      )}
    </PermissionWrap>
  )
}

export default MemberInfo
