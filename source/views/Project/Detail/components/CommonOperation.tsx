/* eslint-disable @typescript-eslint/naming-convention */
import IconFont from '@/components/IconFont'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import styled from '@emotion/styled'
import { OmitText } from '@star-yun/ui'
import { Space, Dropdown, Menu } from 'antd'
import { useState } from 'react'
import EditProject from '../../components/EditProject'
import ProjectInfoModal from '../../components/ProjectInfo'
import Member from '../../components/Member'
import { useModel } from '@/models'
import { getIsPermission } from '@/tools/index'
import { ClickWrap } from '@/components/StyleCommon'
import { useTranslation } from 'react-i18next'

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
  width: 60,
  height: 28,
  borderRadius: 2,
  marginRight: 16,
})

const Tabs = styled(Space)({
  display: 'flex',
  alignItems: 'center',
})

const TabsItem = styled.div<{ isActive: boolean }>(
  {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#323233',
    div: {
      fontSize: 16,
      fontWeight: 400,
      height: 62,
      lineHeight: '62px',
    },
    '&: hover': {
      color: '#2877ff',
    },
  },
  ({ isActive }) => ({
    div: {
      color: String(isActive ? '#2877FF' : ''),
      borderBottom: `2px solid ${isActive ? '#2877FF' : 'white'}`,
    },
  }),
)

const TopRight = styled(Space)({
  position: 'absolute',
  right: 24,
})

const TopRightItem = styled.div<{ isShow?: boolean }>(
  {
    display: 'flex',
    alignItems: 'center',
    color: 'black',
    cursor: 'pointer',
    '.anticon': {
      fontSize: 20,
    },
    div: {
      fontSize: 14,
      fontWeight: 400,
      marginLeft: 8,
    },
    '&: hover': {
      color: '#2877ff!important',
    },
  },
  ({ isShow }) => ({
    '.anticon': {
      color: isShow ? '#2877ff' : '',
    },
    div: {
      color: isShow ? '#2877ff' : '',
    },
  }),
)

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
    color: '#2877ff',
  },
})

const ClickIcon = styled(IconFont)({
  color: '#323233',
  fontSize: 16,
  marginLeft: 8,
  '&: hover': {
    color: '#2877ff',
  },
})

interface Props {
  onUpdate?(): void
}

const CommonOperation = (props: Props) => {
  const [t] = useTranslation()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [isVisible, setIsVisible] = useState(false)
  const [isColor, setIsColor] = useState(false)
  const [infoVisible, setInfoVisible] = useState(false)
  const [memberVisible, setMemberVisible] = useState(false)
  const [isShowMenu, setIsShowMenu] = useState(false)
  const { projectInfo, setProjectInfo } = useModel('project')
  const { userInfo } = useModel('user')
  const [searchParams] = useSearchParams()
  const projectId = searchParams.get('id')

  const tabsList = [
    { name: t('common.demand'), type: 'Demand' },
    { name: t('common.iterate'), type: 'Iteration' },
    { name: t('container.setting'), type: 'Set' },
  ]

  const onMenuClick = (type?: string) => {
    setIsShowMenu(false)
    if (type === 'info') {
      setInfoVisible(true)
    } else if (type === 'edit') {
      setIsVisible(true)
    } else {
      navigate(`/Detail/Set?id=${projectId}`)
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
    setIsColor(state)
  }

  const onClickProjectInfo = (state: boolean) => {
    setInfoVisible(state)
    setIsColor(state)
  }

  const onClickEdit = (state: boolean) => {
    setIsVisible(state)
    setIsColor(state)
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
          <IconFont
            onClick={onToProject}
            style={{ color: '#969799', fontSize: 16, marginRight: 16 }}
            type="left"
          />
          <ImgWrap src={projectInfo.cover} />
          <OmitText width={152}>
            <ClickWrap onClick={() => setIsVisible(true)}>
              {projectInfo.name}
            </ClickWrap>
          </OmitText>
          <ClickIcon
            hidden={getIsPermission(
              userInfo?.company_permissions,
              'b/project/update',
            )}
            type="edit-square"
            onClick={() => setIsVisible(true)}
          />
        </ProjectInfo>
        <Tabs size={60}>
          {tabsList.map(i => (
            <TabsItem
              onClick={() => navigate(`/Detail/${i.type}?id=${projectId}`)}
              key={i.type}
              isActive={pathname.includes(i.type)}
            >
              <div>{i.name}</div>
            </TabsItem>
          ))}
        </Tabs>
        <TopRight size={20}>
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
            <TopRightItem onClick={() => onClickMenu(true)} isShow={isColor}>
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
