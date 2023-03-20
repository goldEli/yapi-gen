// 项目设置主页

/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable @typescript-eslint/naming-convention */
import styled from '@emotion/styled'
import ProjectInfo from './components/ProjectInfo'
import ProjectMember from './components/ProjectMember'
import ProjectSet from './components/ProjectSet'
import DemandSetting from '../DemandSetting'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getParamsData } from '@/tools'
import { useSelector } from '@store/index'
import MyBreadcrumb from '@/components/MyBreadcrumb'
import PermissionWrap from '@/components/PermissionWrap'

const Wrap = styled.div({
  display: 'flex',
  height: 'calc(100% - 64px)',
})

const Content = styled.div({
  width: '100%',
  height: '100%',
})

const Setting = () => {
  const [t] = useTranslation()
  const [searchParams] = useSearchParams()
  const { projectInfo } = useSelector(store => store.project)
  const paramsData = getParamsData(searchParams)
  const activeTabs = Number(paramsData.type) || 0
  const { currentMenu } = useSelector(store => store.user)
  // 计算当前选中下是否有项目管理权限
  const resultAuth =
    currentMenu?.children?.filter(
      (i: any) => i.url === '/ProjectManagement/Project',
    )?.length > 0

  const SideList = [
    {
      name: t('project.projectInformation'),
      icon: 'file-text',
      content: <ProjectInfo />,
      isPermission: true,
    },
    {
      name: t('project.projectMember'),
      icon: 'team',
      content: <ProjectMember />,
      isPermission: projectInfo?.projectPermissions?.filter((i: any) =>
        String(i.identity).includes('b/project/member'),
      ).length,
    },
    {
      name: t('project.projectPermissionGroup'),
      icon: 'lock',
      content: <ProjectSet />,
      isPermission: projectInfo?.projectPermissions?.filter((i: any) =>
        String(i.identity).includes('b/project/role'),
      ).length,
    },
    {
      name: t('newlyAdd.demandSet'),
      icon: 'settings',
      content: <DemandSetting />,
      isPermission: projectInfo?.projectPermissions?.filter((i: any) =>
        String(i.identity).includes('b/project/story_config'),
      ).length,
    },
  ]

  return (
    <PermissionWrap
      auth="/ProjectManagement/Project"
      permission={currentMenu?.children?.map((i: any) => i.url)}
    >
      <div style={{ padding: '20px 24px 0 24px' }}>
        <MyBreadcrumb setName={SideList[activeTabs].name} />
        <Wrap>
          <Content>{SideList[activeTabs].content}</Content>
        </Wrap>
      </div>
    </PermissionWrap>
  )
}

export default Setting
