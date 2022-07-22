/* eslint-disable no-empty-function */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/naming-convention */
import EditDemand from './components/EditDemand'
import DemandMain from './DemandMain'
import DemandInfo from './DemandInfo'
import ChangeRecord from './ChangeRecord'
import ChildDemand from './ChildDemand'
import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import styled from '@emotion/styled'
import { Space, Button } from 'antd'
import { ShapeContent } from '@/components/Shape'
import PopConfirm from '@/components/Popconfirm'

const DemandInfoWrap = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: 64,
  background: 'white',
  padding: '0 24px',
  position: 'sticky',
  top: 64,
  zIndex: 9,
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

const StatusWrap = styled.div({
  height: 22,
  borderRadius: 6,
  padding: '0 8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px solid #2877FF',
  color: '#2877FF',
  width: 'fit-content',
  cursor: 'pointer',
})

const statusList = [
  { id: 0, name: '规划中', color: '#2877ff' },
  { id: 1, name: '实现中', color: '#2877ff' },
  { id: 2, name: '已实现', color: '#2877ff' },
  { id: 3, name: '已关闭', color: '#2877ff' },
]

const DemandBox = () => {
  const [visible, setVisible] = useState(false)
  const [searchParams] = useSearchParams()
  const type = searchParams.get('type')
  const navigate = useNavigate()
  const childContent = () => {
    if (type === 'info') {
      return <DemandInfo />
    } else if (type === 'child') {
      return <ChildDemand />
    }
    return <ChangeRecord />
  }
  const onChangeIdx = (val: string) => {
    navigate(`/Detail/Demand?type=${val}`)
  }

  const moreClick = (e: any) => {
    e.stopPropagation()
    setVisible(!visible)
  }
  const content = () => {
    if (!type) {
      return <DemandMain onChangeVisible={(e: any) => moreClick(e)} />
    }
    return (
      <>
        <DemandInfoWrap>
          <NameWrap>
            <span>【ID466897】需求名称xxxxxx</span>
            <PopConfirm
              content={({ onHide }: { onHide(): void }) => {
                return (
                  <ShapeContent
                    tap={() => {}}
                    hide={onHide}
                    record={{ level: 0 }}
                  />
                )
              }}
              record={{ level: 0 }}
            >
              <StatusWrap
                style={{
                  color: statusList[0].color,
                  border: `1px solid ${statusList[0].color}`,
                }}
              >
                {statusList[0].name}
              </StatusWrap>
            </PopConfirm>
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
              <span>详细信息</span>
            </Item>
            <Item
              onClick={() => onChangeIdx('child')}
              activeIdx={type === 'child'}
            >
              <span>子需求</span>
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
      <EditDemand
        visible={visible}
        onChangeVisible={() => setVisible(!visible)}
      />
      {content()}
    </div>
  )
}

export default DemandBox
