/* eslint-disable @typescript-eslint/naming-convention */
import styled from '@emotion/styled'
import IconFont from '@/components/IconFont'
import ProjectInfo from './components/ProjectInfo'
import ProjectMember from './components/ProjectMember'
import ProjectSet from './components/ProjectSet'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useModel } from '@/models'
import PermissionWrap from '@/components/PermissionWrap'

const Wrap = styled.div({
  display: 'flex',
  height: 'calc(100% - 64px)',
})

const Side = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '16px 0',
  width: 220,
  background: 'white',
  height: '100%',
  img: {
    width: '100%',
    height: 88,
    marginBottom: 32,
    borderRadius: 6,
    padding: '0 16px',
  },
})

const Content = styled.div({
  width: 'calc(100% - 220px)',
  height: '100%',
})

const MenuWrap = styled.div({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
})

const MenuItem = styled.div<{ isActive: boolean }>(
  {
    width: '100%',
    height: 44,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxSizing: 'border-box',
    div: {
      fontSize: 14,
      fontWeight: 400,
      color: '#323233',
      marginLeft: 8,
    },
    svg: {
      fontSize: 16,
      color: '#323233',
    },
    '&:hover': {
      div: {
        color: '#2877FF',
      },
      svg: {
        color: '#2877FF',
      },
    },
  },
  ({ isActive }) => ({
    borderRight: isActive ? '3px solid #2877FF' : '3px solid white',
    background: isActive ? '#F0F4FA' : 'white',
    div: {
      color: isActive ? '#2877FF' : '#323233',
    },
    svg: {
      color: isActive ? '#2877FF' : '#323233',
    },
  }),
)

const Setting = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { projectInfo } = useModel('project')
  const activeTabs = Number(searchParams.get('type')) || 0

  const SideList = [
    {
      name: '项目信息',
      icon: 'file-text',
      content: <ProjectInfo />,
      isPermission: true,
    },
    {
      name: '项目成员',
      icon: 'team',
      content: <ProjectMember />,
      isPermission: projectInfo?.projectPermissions?.filter((i: any) => String(i.identity).includes('b/project/member')).length,
    },
    {
      name: '项目权限组',
      icon: 'lock',
      content: <ProjectSet />,
      isPermission: projectInfo?.projectPermissions?.filter((i: any) => String(i.identity).includes('b/project/role')).length,
    },
  ]

  return (
    <PermissionWrap
      auth="项目设置"
      hasWidth
      permission={projectInfo.projectPermissions}
      isType={1}
    >
      <Wrap>
        <Side>
          <img src={projectInfo.cover} alt="" />
          <MenuWrap>
            {SideList.map((item, index) => (
              <MenuItem
                onClick={() => navigate(`/Detail/Setting?type=${index}&id=${projectInfo.id}`)
                }
                key={item.name}
                isActive={index === activeTabs}
                hidden={!item.isPermission}
              >
                <IconFont type={item.icon} />
                <div>{item.name}</div>
              </MenuItem>
            ))}
          </MenuWrap>
        </Side>
        <Content>{SideList[activeTabs].content}</Content>
      </Wrap>
    </PermissionWrap>
  )
}

export default Setting
