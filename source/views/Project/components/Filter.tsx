import styled from '@emotion/styled'
import { Space, Checkbox, Divider, Dropdown, Menu } from 'antd'
import IconFont from '@/components/IconFont'

const Wrap = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: 52,
  background: 'white',
  padding: '0 24px',
})

const WrapLeft = styled(Space)({
  display: 'flex',
  alignItems: 'center',
})

const WrapRight = styled.div({
  display: 'flex',
  alignItems: 'center',
  '.ant-space-item': {
    display: 'flex',
    alignItems: 'center',
  },
})

const TitleBox = styled.div<{ idx: boolean }>(
  {
    height: 50,
    lineHeight: '50px',
    color: '#323233',
    fontWeight: 400,
    fontSize: 14,
    cursor: 'pointer',
  },
  ({ idx }) => ({
    borderBottom: idx ? '2px solid #2877FF' : '2px solid white',
    color: idx ? '#2877FF' : '#323233',
  }),
)

const IconfontWrap = styled(IconFont)<{ active?: boolean }>(
  {
    color: '#969799',
    fontSize: 20,
    cursor: 'pointer',
  },
  ({ active }) => ({
    color: active ? '#2877FF' : '#969799',
  }),
)

const MainTitle = styled.div({
  fontSize: 14,
  color: '#323233',
  fontWeight: 400,
})

const TotalText = styled.div({
  fontSize: 12,
  color: '#969799',
  fontWeight: 400,
})

interface Props {
  total: number
  sort: string
  isGrid: boolean
  activeType: number
  onChangeSort(val: string): void
  onChangeFormat(): void
  onChangeHidden(val: boolean): void
  onChangeType(val: number): void
  show: boolean
}

export default (props: Props) => {
  const menu = (
    <Menu
      items={[
        {
          key: 'name',
          label: <div onClick={() => props.onChangeSort('name')}>项目名称</div>,
        },
        {
          key: 'time',
          label: <div onClick={() => props.onChangeSort('time')}>创建时间</div>,
        },
      ]}
    />
  )
  return (
    <Wrap>
      {props.show && (
        <WrapLeft size={48}>
          <TitleBox
            onClick={() => props.onChangeType(0)}
            idx={!props.activeType}
          >
            我参与的项目
          </TitleBox>
          <TitleBox
            onClick={() => props.onChangeType(1)}
            idx={props.activeType === 1}
          >
            企业全部
          </TitleBox>
        </WrapLeft>
      )}

      <WrapRight>
        <Space size={12}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Checkbox onChange={e => props.onChangeHidden(e.target.value)} />
            <MainTitle style={{ marginLeft: 8 }}>隐藏结束项目</MainTitle>
          </div>
          <MainTitle>
            {props.sort === 'name' ? '项目名称' : '创建时间'}
          </MainTitle>
          <Dropdown overlay={menu}>
            <IconfontWrap type="sort" />
          </Dropdown>
        </Space>
        <Divider style={{ height: 20 }} type="vertical" />
        <TotalText>共{props.total}个项目</TotalText>
        <Divider style={{ height: 20 }} type="vertical" />
        <Space size={12}>
          <IconfontWrap
            onClick={props.onChangeFormat}
            active={props.isGrid}
            type="app-store"
          />
          <IconfontWrap
            onClick={props.onChangeFormat}
            active={!props.isGrid}
            type="unorderedlist"
          />
        </Space>
      </WrapRight>
    </Wrap>
  )
}
