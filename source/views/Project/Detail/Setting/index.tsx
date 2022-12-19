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
import { useModel } from '@/models'
import { useTranslation } from 'react-i18next'
import { encryptPhp } from '@/tools/cryptoPhp'
import { getParamsData } from '@/tools'

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
  boxShadow: '0px 4px 6px rgb(0 0 0 / 10%)',
  zIndex: 2,
})

const ImgWrap = styled.div({
  width: 'calc(100% - 32px)',
  height: 88,
  marginBottom: 32,
  borderRadius: 6,
  padding: '0 16px',
  overflow: 'hidden',
  img: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
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

const MenuItem = styled.div<{ isActive: boolean; language?: string }>(
  {
    width: '100%',
    height: 44,
    display: 'flex',
    alignItems: 'center',
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
      background: '#F4F5F5',
    },
  },
  ({ isActive, language }) => ({
    borderRight: isActive ? '3px solid #2877FF' : '3px solid transparent',
    background: isActive ? '#F0F4FA!important' : 'white',
    paddingLeft: language === 'zh' ? 65 : 40,
    div: {
      color: isActive ? '#2877FF' : '#323233',
      fontWeight: isActive ? 'bold' : 400,
    },
    svg: {
      color: isActive ? '#2877FF' : '#323233',
    },
  }),
)

const Setting = () => {
  const [t, i18n] = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { projectInfo } = useModel('project')
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

  const onToInfo = (index: any) => {
    const params = encryptPhp(
      JSON.stringify({
        type: index,
        id: projectInfo.id,
        pageIdx: index === 3 ? 'main' : '',
      }),
    )
    navigate(`/Detail/Set?data=${params}`)
  }

  return (
    <Wrap>
      <Side>
        <ImgWrap>
          <img src={projectInfo.cover} alt="" />
        </ImgWrap>
        <MenuWrap>
          {SideList.map((item, index) => (
            <MenuItem
              onClick={() => onToInfo(index)}
              key={item.name}
              isActive={index === activeTabs}
              hidden={!item.isPermission}
              language={i18n.language}
            >
              <IconFont type={item?.icon} />
              <div>{item.name}</div>
            </MenuItem>
          ))}
        </MenuWrap>
      </Side>
      <Content>{SideList[activeTabs].content}</Content>
    </Wrap>
  )
}

export default Setting
