/* eslint-disable @typescript-eslint/naming-convention */
import EditIteration from './components/EditIteration'
import IterationMain from './IterationMain'
import IterationInfo from './IterationInfo'
import ChangeRecord from './ChangeRecord'
import Demand from './Demand'
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

  // position: 'sticky',
  // top: 64,
  // zIndex: 2,
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

const IterationWrap = () => {
  const [visible, setVisible] = useState(false)
  const [operationDetail, setOperationDetail] = useState({})
  const [searchParams] = useSearchParams()
  const type = searchParams.get('type')
  const projectId = searchParams.get('id')
  const navigate = useNavigate()
  const childContent = () => {
    if (type === 'info') {
      return <IterationInfo />
    } else if (type === 'demand') {
      return <Demand />
    }
    return <ChangeRecord />
  }
  const onChangeIdx = (val: string) => {
    navigate(`/Detail/Iteration?type=${val}&id=${projectId}`)
  }
  const content = () => {
    if (!type) {
      return (
        <IterationMain
          onChangeVisible={() => setVisible(!visible)}
          onChangeOperation={setOperationDetail}
        />
      )
    }
    return (
      <>
        <DemandInfoWrap>
          <NameWrap>
            <span>敏捷系统V2.0</span>
            <div>开启</div>
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
              onClick={() => onChangeIdx('info')}
              activeIdx={type === 'info'}
            >
              <span>迭代概况</span>
            </Item>
            <Item
              onClick={() => onChangeIdx('demand')}
              activeIdx={type === 'demand'}
            >
              <span>需求</span>
              <div>6</div>
            </Item>
            <Item
              onClick={() => onChangeIdx('record')}
              activeIdx={type === 'record'}
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

  return (
    <div>
      <EditIteration
        visible={visible}
        onChangeVisible={() => setVisible(!visible)}
        details={operationDetail}
      />
      {content()}
    </div>
  )
}

export default IterationWrap
