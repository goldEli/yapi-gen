import styled from '@emotion/styled'
import OperationGroup from '@/components/OperationGroup'
import TableFilter from '@/components/TableFilter'
import { useState } from 'react'
import { IconFont } from '@staryuntech/ant-pro'
import { Popover, Space } from 'antd'

const OperationWrap = styled.div({
  minHeight: 52,
  lineHeight: '52px',
  background: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
})

const StickyWrap = styled.div({
  padding: '0 24px',
  background: 'white',
  position: 'sticky',
  top: 64,
  zIndex: 2,
})

const IterationInfo = styled.div({
  display: 'flex',
  alignItems: 'center',
})

const StatusTag = styled.div({
  height: 22,
  borderRadius: 6,
  textAlign: 'center',
  lineHeight: '22px',
  padding: '0 8px',
  color: '#43BA9A',
  fontSize: 12,
  background: '#EDF7F4',
  cursor: 'pointer',
})

interface Props {
  isGrid: boolean
  onChangeGrid(val: boolean): void
  onChangeVisible?(): void
  onChangeIsShowLeft?(): void
}

export default (props: Props) => {
  const [filterState, setFilterState] = useState(true)

  const changeStatus = (
    <Space
      size={8}
      style={{ padding: '8px 16px', display: 'flex', flexDirection: 'column' }}
    >
      <StatusTag>开启中</StatusTag>
      <StatusTag style={{ color: '#969799', background: '#F2F2F4' }}>
        已结束
      </StatusTag>
    </Space>
  )

  return (
    <StickyWrap>
      <OperationWrap>
        <IterationInfo>
          <IconFont
            onClick={props.onChangeIsShowLeft}
            type="indent"
            style={{
              fontSize: 16,
              color: 'black',
              cursor: 'pointer',
              marginRight: 8,
            }}
          />
          <span style={{ fontSize: 14, color: 'black', marginRight: 8 }}>
            敏捷版本v1.0
          </span>
          <span style={{ fontSize: 12, color: '#BBBDBF', marginRight: 8 }}>
            2022.06.17-2022.07.30
          </span>
          <Popover placement="bottom" content={changeStatus}>
            <StatusTag>
              开启中
              <IconFont
                type="down-60kl9fcg"
                style={{ fontSize: 12, marginLeft: 4 }}
              />
            </StatusTag>
          </Popover>
          <IconFont
            type="detail"
            style={{
              fontSize: 16,
              color: '#969799',
              cursor: 'pointer',
              marginLeft: 8,
            }}
          />
        </IterationInfo>
        <OperationGroup
          onChangeFilter={() => setFilterState(!filterState)}
          onChangeGrid={props.onChangeGrid}
          isGrid={props.isGrid}
          filterState={filterState}
        />
      </OperationWrap>
      <TableFilter showForm={filterState} />
    </StickyWrap>
  )
}
