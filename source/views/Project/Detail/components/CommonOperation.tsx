import IconFont from '@/components/IconFont'
import { useNavigate } from 'react-router-dom'
import styled from '@emotion/styled'
import { OmitText } from '@star-yun/ui'
import posterImg from '@/assets/poster.png'
import { Space, Dropdown, Menu } from 'antd'
import { useState } from 'react'
import EditProject from '../../components/EditProject'
import ProjectInfoModal from '../../components/ProjectInfo'
import Member from '../../components/Member'

const OperationTop = styled.div({
  height: 64,
  width: '100%',
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
    div: {
      fontSize: 16,
      fontWeight: 400,
      height: 62,
      lineHeight: '62px',
    },
  },
  ({ isActive }) => ({
    div: {
      color: `${isActive ? '#2877FF' : '#323233'}`,
      borderBottom: `2px solid ${isActive ? '#2877FF' : 'white'}`,
    },
  }),
)

const TopRight = styled(Space)({
  position: 'absolute',
  right: 24,
})

const TopRightItem = styled.div({
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
})

interface Props {
  activeType: string
}

export default (props: Props) => {
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)
  const [infoVisible, setInfoVisible] = useState(false)
  const [memberVisible, setMemberVisible] = useState(false)

  const tabsList = [
    { name: '需求', type: 'demandMain', activeType: 'demand' },
    { name: '迭代', type: 'iterationMain', activeType: 'iteration' },
    { name: '设置', type: 'set', activeType: 'set' },
  ]

  const menu = (
    <Menu
      items={[
        {
          key: 1,
          label: (
            <MenuItems onClick={() => setInfoVisible(true)}>
              <div>项目信息</div>
            </MenuItems>
          ),
        },
        {
          key: 2,
          label: (
            <MenuItems onClick={() => setVisible(true)}>
              <div>编辑项目</div>
            </MenuItems>
          ),
        },
        {
          key: 3,
          label: (
            <MenuItems onClick={() => navigate('/Detail?type=set')}>
              <div>项目设置</div>
            </MenuItems>
          ),
        },
      ]}
    />
  )

  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 2 }}>
      <EditProject
        visible={visible}
        onChangeVisible={() => setVisible(!visible)}
      />
      <ProjectInfoModal
        visible={infoVisible}
        onChangeVisible={() => setInfoVisible(!infoVisible)}
      />
      <Member
        visible={memberVisible}
        onChangeVisible={() => setMemberVisible(!memberVisible)}
      />
      <OperationTop>
        <ProjectInfo>
          <IconFont
            onClick={() => navigate('/Project')}
            style={{ color: '#969799', fontSize: 16, marginRight: 16 }}
            type="left"
          />
          <ImgWrap src={posterImg} />
          <OmitText width={152}>
            项目名称最长尺寸名称项目名称最长尺寸名称...项目名称最长尺寸名称...
          </OmitText>
          <IconFont
            style={{ color: '#323233', fontSize: 16, marginLeft: 8 }}
            type="edit-square"
            onClick={() => setVisible(true)}
          />
        </ProjectInfo>
        <Tabs size={60}>
          {tabsList.map(i => (
            <TabsItem
              onClick={() => navigate(`/Detail?type=${i.type}`)}
              key={i.type}
              isActive={props.activeType.includes(i.activeType)}
            >
              <div>{i.name}</div>
            </TabsItem>
          ))}
        </Tabs>
        <TopRight size={20}>
          <TopRightItem onClick={() => setMemberVisible(true)}>
            <IconFont type="team" />
            <div>成员</div>
          </TopRightItem>
          <Dropdown overlay={menu} placement="bottomRight">
            <TopRightItem>
              <IconFont type="menu" />
              <div>菜单</div>
            </TopRightItem>
          </Dropdown>
        </TopRight>
      </OperationTop>
    </div>
  )
}
