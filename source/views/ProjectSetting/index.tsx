// 项目设置主页

/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable @typescript-eslint/naming-convention */
import styled from '@emotion/styled'
import IconFont from '@/components/IconFont'
import ProjectInfo from './components/ProjectInfo'
import ProjectMember from './components/ProjectMember'
import ProjectSet from './components/ProjectSet'
import DemandSet from './DemandSet'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getParamsData } from '@/tools'
import { useSelector } from '@store/index'

const Wrap = styled.div({
  display: 'flex',
  height: 'calc(100% - 64px)',
})

const Content = styled.div({
  width: '100%',
  height: '100%',
})

const Setting = () => {
  const [t, i18n] = useTranslation()
  const [searchParams] = useSearchParams()
  const { projectInfo } = useSelector(store => store.project)
  const paramsData = getParamsData(searchParams)
  const activeTabs = Number(paramsData.type) || 0

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
      content: <DemandSet />,
      isPermission: projectInfo?.projectPermissions?.filter((i: any) =>
        String(i.identity).includes('b/project/story_config'),
      ).length,
    },
  ]

  return (
    <Wrap>
      <Content>{SideList[activeTabs].content}</Content>
    </Wrap>
  )
}

export default Setting
