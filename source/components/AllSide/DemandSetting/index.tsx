// 项目二级菜单

import CommonIconFont from '@/components/CommonIconFont'
import { getProjectInfo, getProjectInfoValues } from '@/services/project'
import { getParamsData } from '@/tools'
import { encryptPhp } from '@/tools/cryptoPhp'
import { useDispatch, useSelector } from '@store/index'
import { setProjectInfo, setProjectInfoValues } from '@store/project'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import {
  AllWrap,
  MenuBox,
  MenuItem,
  Provider,
  SideFooter,
  SideInfo,
  SideTop,
  WrapSet,
  WrapDetail,
  BackStyle,
  TitleStyle,
  Tabs,
} from './style'

const ProjectDetailSide = (props: { leftWidth: number }) => {
  const [t, i18n] = useTranslation()
  const projectSide: any = useRef<HTMLInputElement>(null)
  const projectSetSide: any = useRef<HTMLInputElement>(null)
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData?.id
  const { projectInfo } = useSelector(store => store.project)
  const navigate = useNavigate()
  const [tabsActive, setTabsActive] = useState(0)
  const [activeIndex, setActiveIndex] = useState(0)
  const tabs = [
    {
      label: '启用',
    },
    {
      label: '未启用',
    },
  ]
  const sideList = [
    {
      name: t('project.projectInformation'),
      icon: 'file-text',
      path: '/ProjectManagement/ProjectSetting?type=0',
      isPermission: true,
    },
    {
      name: t('project.projectMember'),
      icon: 'team',
      path: '/ProjectManagement/ProjectSetting?type=1',
      isPermission: projectInfo?.projectPermissions?.filter((i: any) =>
        String(i.identity).includes('b/project/member'),
      ).length,
    },
    {
      name: t('project.projectPermissionGroup'),
      icon: 'lock',
      path: '/ProjectManagement/ProjectSetting?type=2',
      isPermission: projectInfo?.projectPermissions?.filter((i: any) =>
        String(i.identity).includes('b/project/role'),
      ).length,
    },
    {
      name: t('newlyAdd.demandSet'),
      icon: 'settings',
      path: '/ProjectManagement/ProjectSetting?type=3',
      isPermission: projectInfo?.projectPermissions?.filter((i: any) =>
        String(i.identity).includes('b/project/story_config'),
      ).length,
    },
  ]

  const getProjectInfoValuesData = async () => {
    const result = await getProjectInfoValues({ projectId })
    dispatch(setProjectInfoValues(result))
  }

  // 获取项目信息
  const getInfo = async () => {
    const result = await getProjectInfo({ projectId })
    dispatch(setProjectInfo(result))
  }

  useEffect(() => {
    getInfo()
    getProjectInfoValuesData()
  }, [])

  //   返回上一页
  const onGoBack = () => {
    projectSetSide.current.style.width = '0px'
    projectSide.current.style.width = `${props.leftWidth}px`
    setTimeout(() => {
      projectSetSide.current.style.display = 'none'
    }, 200)
  }

  return (
    <AllWrap>
      <WrapSet>
        <SideTop>
          <img src={projectInfo.cover} alt="" />
          <SideInfo>
            <div>{projectInfo.name}</div>
            <span> 团队项目 </span>
          </SideInfo>
        </SideTop>
        <BackStyle onClick={onGoBack}>
          <CommonIconFont type="left-md" onClick={onGoBack} />
          <span>返回</span>
        </BackStyle>
        <Provider />
        <TitleStyle>
          <span>需求类别</span>{' '}
          <CommonIconFont
            type="plus"
            color="var(--neutral-n2)"
            onClick={() => 123}
          />
        </TitleStyle>
        <Tabs>
          {tabs.map((el, index) => (
            <span
              className={tabsActive == index ? 'tabsActive' : ''}
              onClick={() => {
                setTabsActive(index)
              }}
              key={el.label}
            >
              {el.label}
            </span>
          ))}
        </Tabs>
        <MenuBox>
          {sideList.map((i: any, index: number) => (
            <MenuItem
              key={i.icon}
              isActive={activeIndex === index}
              onClick={
                () => setActiveIndex(index)
                // onToInfo(index)
              }
            >
              <CommonIconFont
                type={i.icon}
                color="var(--neutral-n3)"
                size={18}
              />
              <div>{i.name}</div>
            </MenuItem>
          ))}
        </MenuBox>
      </WrapSet>
    </AllWrap>
  )
}

export default ProjectDetailSide
