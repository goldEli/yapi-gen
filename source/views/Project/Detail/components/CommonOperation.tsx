// 项目-公用操作栏

/* eslint-disable @typescript-eslint/naming-convention */
import IconFont from '@/components/IconFont'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import styled from '@emotion/styled'
import { Space, Dropdown, Menu, Tooltip } from 'antd'
import { useState } from 'react'
import EditProject from '../../components/EditProject'
import ProjectInfoModal from '../../components/ProjectInfo'
import Member from '../../components/Member'
import { useModel } from '@/models'
import { getIsPermission, getParamsData } from '@/tools/index'
import { useTranslation } from 'react-i18next'
import { encryptPhp } from '@/tools/cryptoPhp'
import HaveSearchAndList from '@/components/HaveSearchAndList'
import { getProjectInfo } from '@/services/project'

const OperationTop = styled.div({
  height: 64,
  width: '100%',
  minWidth: '800px',
  background: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  padding: '0 24px',
})

const ProjectInfo = styled.div({
  position: 'absolute',
  left: 24,
  display: 'flex',
  alignItems: 'center',
})

const ImgWrap = styled.img({
  width: 86,
  height: 40,
  borderRadius: 4,
  marginRight: 8,
})

const Tabs = styled(Space)({
  display: 'flex',
  alignItems: 'center',
})

const TopRightItem = styled.div({
  display: 'flex',
  alignItems: 'center',
  color: 'black',
  cursor: 'pointer',
  height: '32px',
  padding: '0 8px',
  borderRadius: 6,
  '.anticon': {
    fontSize: 20,
  },
  div: {
    fontSize: 14,
    fontWeight: 400,
    marginLeft: 8,
  },
  '&: hover': {
    color: '#323233!important',
    background: '#F4F5F5',
  },
})

const TabsItem = styled.div<{ isActive: boolean; isPlan?: boolean }>(
  {
    display: 'flex',
    position: 'relative',
    '.titleBox': {
      fontSize: 18,
      height: 62,
      lineHeight: '62px',
      display: 'flex',
      '&: hover': {
        color: '#2877ff',
        cursor: 'pointer',
      },
    },
    '.text': {
      position: 'absolute',
      zIndex: 2,
      fontSize: 12,
      top: 12,
      right: -50,
      display: 'flex',
      padding: '0 4px 0 2px',
      height: 20,
      lineHeight: '20px',
      whiteSpace: 'nowrap',
      background: '#F4F4F6',
      borderTopRightRadius: 4,
      borderBottomRightRadius: 4,
      div: {
        display: 'inline-block',
        borderTop: '10px solid transparent',
        borderBottom: '10px solid transparent',
        borderRight: '7px solid #F4F4F6',
        width: 0,
        height: 0,
        position: 'absolute',
        left: -7,
        top: 0,
      },
    },
  },
  ({ isActive, isPlan }) => ({
    color: isPlan ? '#969799' : '#323233',
    '.titleBox': {
      color: String(isActive ? '#2877FF' : ''),
      borderBottom: `2px solid ${isActive ? '#2877FF' : 'white'}`,
      fontWeight: isActive ? 500 : 400,
    },
  }),
)

const TopRight = styled(Space)({
  position: 'absolute',
  right: 24,
})

const MenuItems = styled.div({
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  color: '#646566',
  div: {
    fontSize: 14,
    fontWeight: 400,
  },
  '&: hover': {
    color: '#323233',
  },
})

const BackWrap = styled.div({
  height: 24,
  width: 32,
  borderRadius: 4,
  background: '#F0F4FA',
  cursor: 'pointer',
  marginRight: 16,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  svg: {
    color: '#2877ff',
    fontSize: 20,
  },
  '&: hover': {
    background: '#2877ff',
    svg: {
      color: 'white',
    },
  },
})

interface Props {
  onUpdate?(): void
  onChangeIdx(): void
}

const CommonOperation = (props: Props) => {
  const [t] = useTranslation()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [isVisible, setIsVisible] = useState(false)
  const [infoVisible, setInfoVisible] = useState(false)
  const [memberVisible, setMemberVisible] = useState(false)
  const [isShowMenu, setIsShowMenu] = useState(false)
  const { projectInfo, setProjectInfo } = useModel('project')
  const { userInfo } = useModel('user')
  const { setFilterHeight } = useModel('demand')
  const { setFilterHeightIterate } = useModel('iterate')
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData.id

  const tabsList = [
    { name: t('common.demand'), type: 'Demand', hasPath: ['Demand'] },
    { name: t('common.iterate'), type: 'Iteration', hasPath: ['Iteration'] },
    {
      name: t('container.setting'),
      type: 'Set',
      hasPath: ['Set', 'MemberInfo'],
    },
  ]

  const onMenuClick = (type?: string) => {
    setIsShowMenu(false)
    if (type === 'info') {
      setInfoVisible(true)
    } else if (type === 'edit') {
      setIsVisible(true)
    } else {
      const params = encryptPhp(JSON.stringify({ id: projectId }))
      navigate(`/Detail/Set?data=${params}`)
    }
  }

  const menu = () => {
    let menuItems = [
      {
        key: 1,
        label: (
          <MenuItems onClick={() => onMenuClick('info')}>
            <div>{t('project.projectInformation')}</div>
          </MenuItems>
        ),
      },
      {
        key: 2,
        label: (
          <MenuItems onClick={() => onMenuClick('edit')}>
            <div>{t('project.editProject')}</div>
          </MenuItems>
        ),
      },
      {
        key: 3,
        label: (
          <MenuItems onClick={() => onMenuClick()}>
            <div>{t('project.projectSet')}</div>
          </MenuItems>
        ),
      },
    ]

    if (getIsPermission(userInfo?.company_permissions, 'b/project/update')) {
      menuItems = menuItems.filter((i: any) => i.key !== 2)
    }

    return <Menu items={menuItems} />
  }

  const onToProject = () => {
    navigate('/Project')
    setTimeout(() => {
      setProjectInfo({})
    }, 100)
  }

  const onClickMenu = (state: boolean) => {
    setIsShowMenu(state)
  }

  const onClickProjectInfo = (state: boolean) => {
    setInfoVisible(state)
  }

  const onClickEdit = (state: boolean) => {
    setIsVisible(state)
  }

  const onToModel = (i: any) => {
    getProjectInfo()
    const params = encryptPhp(JSON.stringify({ id: projectId }))
    navigate(`/Detail/${i.type}?data=${params}`)
    setFilterHeight(52)
    setFilterHeightIterate(60)
    // 点击切换更新项目info接口
    props.onChangeIdx()
  }

  return (
    <div>
      <EditProject
        visible={isVisible}
        onChangeVisible={() => onClickEdit(false)}
        details={projectInfo}
        onUpdate={props.onUpdate}
      />

      <ProjectInfoModal
        visible={infoVisible}
        onChangeVisible={() => onClickProjectInfo(false)}
      />
      <Member
        visible={memberVisible}
        onChangeVisible={() => setMemberVisible(!memberVisible)}
        projectId={projectId}
      />
      <OperationTop>
        <ProjectInfo>
          <Tooltip title={t('newlyAdd.backList')}>
            <BackWrap onClick={onToProject}>
              <IconFont type="return" />
            </BackWrap>
          </Tooltip>
          <ImgWrap src={projectInfo.cover} />
          <HaveSearchAndList
            placeholder={t('version2.searchProject')}
            projectId={projectId}
            isProjectChange
          />
        </ProjectInfo>
        <Tabs size={60}>
          {tabsList.map(i => (
            <TabsItem
              onClick={() => onToModel(i)}
              key={i.type}
              isActive={
                i.hasPath?.filter(k => pathname.includes(k))?.length > 0
              }
            >
              <span className="titleBox">{i.name}</span>
            </TabsItem>
          ))}
        </Tabs>
        <TopRight size={12}>
          <TopRightItem onClick={() => setMemberVisible(true)}>
            <IconFont type="team" />
            <div>{t('project.member')}</div>
          </TopRightItem>

          <Dropdown
            key={isShowMenu.toString()}
            visible={isShowMenu}
            trigger={['click']}
            overlay={menu}
            placement="bottomRight"
            onVisibleChange={state => onClickMenu(state)}
          >
            <TopRightItem onClick={() => onClickMenu(true)}>
              <IconFont type="menu" />
              <div>{t('project.menu')}</div>
            </TopRightItem>
          </Dropdown>
        </TopRight>
      </OperationTop>
    </div>
  )
}

export default CommonOperation
