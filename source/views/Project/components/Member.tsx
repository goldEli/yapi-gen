import { Drawer, Button, Input } from 'antd'
import styled from '@emotion/styled'
import IconFont from '@/components/IconFont'
import posterImg from '@/assets/poster.png'

interface Props {
  visible: boolean
  onChangeVisible(): void
}

const DrawerWrap = styled(Drawer)({
  '.ant-drawer-header-title': {
    direction: 'rtl',
  },
  '.ant-drawer-title': {
    flex: 'initial',
  },
  '.ant-drawer-close': {
    margin: 0,
  },
})

const ButtonWrap = styled(Button)({ width: '100%', height: 32 })

const ListWrap = styled.div({
  marginTop: 16,
})

const ListItem = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: 56,
  padding: '0 16px',
  '.avatarBox': {
    display: 'flex',
    alignItems: 'center',
    img: {
      width: 32,
      height: 32,
      borderRadius: '50%',
      marginRight: 8,
    },
    div: {
      display: 'flex',
      flexDirection: 'column',
      'span:first-child': {
        color: '#323233',
        fontSize: 14,
      },
      'span:last-child': {
        color: '#BBBDBF',
        fontSize: 12,
      },
    },
  },
  '.job': {
    color: 'black',
    fontSize: 12,
  },
  '&:nth-child(even)': {
    backgroundColor: '#f8f9fa',
  },
})

const personList = [
  { name: '张三', avatar: posterImg, subname: '普通成员', job: '设计' },
  { name: '张三', avatar: posterImg, subname: '普通成员', job: '设计' },
  { name: '张三', avatar: posterImg, subname: '普通成员', job: '设计' },
  { name: '张三', avatar: posterImg, subname: '普通成员', job: '设计' },
]

export default (props: Props) => {
  return (
    <DrawerWrap
      title="项目成员（10）"
      placement="right"
      onClose={props.onChangeVisible}
      visible={props.visible}
      headerStyle={{ padding: 16 }}
      bodyStyle={{ padding: 0 }}
    >
      <div style={{ padding: '0 16px' }}>
        <ButtonWrap
          type="primary"
          icon={
            <IconFont type="plus" style={{ color: 'white', fontSize: 16 }} />
          }
        >
          添加成员
        </ButtonWrap>
        <Input
          style={{ marginTop: 16 }}
          suffix={
            <IconFont
              type="search"
              style={{ color: '#BBBDBF', fontSize: 16 }}
            />
          }
          placeholder="搜索成员"
          allowClear
        />
      </div>
      <ListWrap>
        {personList.map((i, idx) => (
          <ListItem key={`${i.name}_${idx}`}>
            <div className="avatarBox">
              <img src={i.avatar} alt="" />
              <div>
                <span>{i.name}</span>
                <span>{i.subname}</span>
              </div>
            </div>
            <div className="job">{i.job}</div>
          </ListItem>
        ))}
      </ListWrap>
    </DrawerWrap>
  )
}
