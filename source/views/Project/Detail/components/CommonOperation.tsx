import IconFont from '@/components/IconFont'
import { useNavigate } from 'react-router-dom'
import styled from '@emotion/styled'
import { OmitText } from '@star-yun/ui'
import posterImg from '@/assets/poster.png'
import { Space } from 'antd'
import { AsyncButton as Button } from '@staryuntech/ant-pro'
import OperationComponent from '@/components/OperationComponent'

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

// const DemandInfo = styled.div({
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'space-between',
//   height: 64,
//   background: 'white',
// })

// const NameWrap = styled.div({
//   display: 'flex',
//   alignItems: 'center',
//   span: {
//     fontSize: 16,
//     fontWeight: 400,
//     color: 'black',
//     marginRight: 8,
//   },
//   div: {
//     height: 22,
//     borderRadius: 6,
//     border: '1px solid #2877FF',
//     padding: '0 8px',
//     color: '#2877FF',
//     fontSize: 12,
//     fontWeight: 400,
//   },
// })

interface Props {
  active: string
  onChangeActive(state: string): void
}

export default (props: Props) => {
  const navigate = useNavigate()
  const tabsList = [
    { name: '需求', type: 'demand' },
    { name: '迭代', type: 'iteration' },
    { name: '设置', type: 'set' },
  ]
  return (
    <div>
      <OperationTop>
        <ProjectInfo>
          <IconFont
            onClick={() => navigate(-1)}
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
          />
        </ProjectInfo>
        <Tabs size={60}>
          {tabsList.map(i => (
            <TabsItem
              onClick={() => props.onChangeActive(i.type)}
              key={i.type}
              isActive={props.active === i.type}
            >
              <div>{i.name}</div>
            </TabsItem>
          ))}
        </Tabs>
      </OperationTop>
      {/* <DemandInfo>
        <NameWrap>
          <span>【ID466897】需求名称xxxxxx</span>
          <div>实现中</div>
        </NameWrap>
        <Space size={16}>
          <Button type="primary">编辑</Button>
          <Button>删除</Button>
        </Space>
      </DemandInfo> */}
      <div style={{ height: 52, lineHeight: '52px' }}>
        <OperationComponent text="创建需求" />
      </div>
    </div>
  )
}
