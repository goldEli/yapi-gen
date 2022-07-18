import EditDemand from './components/EditDemand'
import DemandMain from './DemandMain'
import DemandInfo from './DemandInfo'
import ChangeRecord from './ChangeRecord'
import ChildDemand from './ChildDemand'
import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import styled from '@emotion/styled'
import { Space, Button } from 'antd'

const DemandInfoWrap = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: 64,
  background: 'white',
  padding: '0 24px',
  position: 'sticky',
  top: 64,
  zIndex: 2,
})

const NameWrap = styled.div({
  display: 'flex',
  alignItems: 'center',
  span: {
    fontSize: 16,
    fontWeight: 400,
    color: 'black',
    marginRight: 8,
  },
  div: {
    height: 22,
    borderRadius: 6,
    border: '1px solid #2877FF',
    padding: '0 8px',
    color: '#2877FF',
    fontSize: 12,
    fontWeight: 400,
  },
})

const ContentWrap = styled.div({
  padding: 24,
  display: 'flex',
  flexDirection: 'column',
})

const MainWrap = styled(Space)({
  borderRadius: 4,
  paddingLeft: 24,
  background: 'white',
  width: '100%',
})

const Item = styled.div<{ activeIdx: boolean }>(
  {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    span: {
      fontSize: 14,
      fontWeight: 400,
      marginRight: 4,
      color: '#323233',
      display: 'inline-block',
      height: 50,
      lineHeight: '50px',
    },
    div: {
      height: 20,
      padding: '0 6px',
      borderRadius: '50%',
      color: '#969799',
      background: '#F2F2F4',
      '&: hover': {
        color: '#2877FF',
        background: '#F0F4FA',
      },
    },
  },
  ({ activeIdx }) => ({
    span: {
      color: activeIdx ? '#2877FF' : '#323233',
      borderBottom: activeIdx ? '2px solid #2877FF' : '2px solid white',
    },
  }),
)

export default () => {
  const [visible, setVisible] = useState(false)
  const [searchParams] = useSearchParams()
  const type = searchParams.get('type') || 'demandMain'
  const navigate = useNavigate()
  const childContent = () => {
    if (type === 'demandInfo') {
      return <DemandInfo />
    } else if (type === 'demandChild') {
      return <ChildDemand />
    } else {
      return <ChangeRecord />
    }
  }
  const onChangeIdx = (val: string) => {
    navigate(`/Detail?type=${val}`)
  }
  const content = () => {
    if (type === 'demandMain') {
      return <DemandMain onChangeVisible={() => setVisible(!visible)} />
    } else {
      return (
        <>
          <DemandInfoWrap>
            <NameWrap>
              <span>【ID466897】需求名称xxxxxx</span>
              <div>实现中</div>
            </NameWrap>
            <Space size={16}>
              <Button type="primary" onClick={() => setVisible(!visible)}>
                编辑
              </Button>
              <Button>删除</Button>
            </Space>
          </DemandInfoWrap>
          <ContentWrap>
            <MainWrap size={32}>
              <Item
                onClick={() => onChangeIdx('demandInfo')}
                activeIdx={type === 'demandInfo'}
              >
                <span>详细信息</span>
              </Item>
              <Item
                onClick={() => onChangeIdx('demandChild')}
                activeIdx={type === 'demandChild'}
              >
                <span>子需求</span>
                <div>6</div>
              </Item>
              <Item
                onClick={() => onChangeIdx('demandRecord')}
                activeIdx={type === 'demandRecord'}
              >
                <span>变更记录</span>
                <div>12</div>
              </Item>
            </MainWrap>
            {childContent()}
          </ContentWrap>
        </>
      )
    }
  }

  return (
    <div>
      <EditDemand
        visible={visible}
        onChangeVisible={() => setVisible(!visible)}
      />
      {content()}
    </div>
  )
}
