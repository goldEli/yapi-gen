import React from 'react'
import { SortableItem } from './SortableItem'
import { Droppable } from 'react-beautiful-dnd'
import styled from '@emotion/styled'
import ResizeTable from './ResizeTable'
import NoData from '@/components/NoData'
import { Collapse } from 'antd'
import IconFont from '@/components/IconFont'
import CommonButton from '@/components/CommonButton'
const { Panel } = Collapse

interface XTableProps {
  data: any
  columns: any
  id: string
}

const XTableWrap = styled.div`
  .dnd {
    .ant-table-tbody td[data-cypress='draggable-handle'] {
      cursor: move;
      height: 52px;
    }
  }

  // 元素拖动样式
  .dragItem {
    position: relative;
    touch-action: none;

    transform: translate3d(var(--translate-x, 0), var(--translate-y, 0), 0)
      scale(var(--scale, 1));
    transition: box-shadow 200ms ease;
  }

  .dragOverlay {
    --scale: 1.02;
    --box-shadow-picked-up: 0 0 0 calc(1px / var(--scale-x, 1))
        rgba(63, 63, 68, 0.05),
      -1px 0 15px 0 rgba(34, 33, 81, 0.01),
      0px 15px 15px 0 rgba(34, 33, 81, 0.25);

    animation: pop 200ms cubic-bezier(0.18, 0.67, 0.6, 1.22);
    box-shadow: var(--box-shadow-picked-up);
    z-index: 1;

    // 禁用单元格元素默认行为
    > td {
      border-color: transparent !important;
      > span {
        pointer-events: none;
      }
    }
  }
  .ant-table-footer {
    background-color: var(--neutral-white-d1);
  }
`
const PanelHeader = styled.div`
  height: 32px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  .title {
    font-size: 14px;
    font-family: SiYuanMedium;
    font-weight: 500;
    color: var(--neutral-n1-d1);
  }
  .date {
    font-size: 12px;
    font-family: MiSans-Regular, MiSans;
    font-weight: 400;
    color: var(--neutral-n3);
    margin-left: 16px;
    margin-right: 16px;
  }
`
const CreateTransactionButton = styled.div`
  font-size: 14px;
  font-family: MiSans-Regular, MiSans;
  font-weight: 400;
  color: var(--auxiliary-text-t2-d2);
  display: flex;
  align-items: center;
  cursor: pointer;
`

const XTable: React.FC<XTableProps> = props => {
  // const { isOver, setNodeRef } = useDroppable({
  //   id: props.id,
  // });
  // const style = {
  //   opacity: isOver ? 1 : 0.5,
  // };
  return (
    <Droppable key={props.id} droppableId={props.id}>
      {(provided, snapshot) => {
        return (
          <XTableWrap ref={provided.innerRef} {...provided.droppableProps}>
            {/* <Table
              rowKey="id"
              className="dnd"
              dataSource={props.data}
              columns={props.columns}
              pagination={{ pageSize: 2 }}
              components={{ body: { row: SortableItem } }}
            /> */}
            <Collapse
              defaultActiveKey={['1']}
              ghost
              expandIcon={({ isActive }: any) => {
                return isActive ? (
                  <IconFont
                    style={{
                      fontSize: 14,
                      color: 'var(--neutral-n3)',
                    }}
                    type="down-icon"
                  />
                ) : (
                  <IconFont
                    style={{
                      fontSize: 14,
                      color: 'var(--neutral-n3)',
                    }}
                    type="right-icon"
                  />
                )
              }}
            >
              <Panel
                header={
                  <PanelHeader
                    onClick={e => {
                      e.stopPropagation()
                    }}
                  >
                    <div>
                      <span className="title">三月第一周的冲刺</span>
                      <span className="date">
                        2022-06-17 ~ 2022-07-30（可见3个，共4个事务）
                      </span>
                      <IconFont
                        style={{
                          fontSize: 16,
                          color: 'var(--neutral-n3)',
                          marginRight: 16,
                        }}
                        type="edit"
                      />
                      <IconFont
                        style={{
                          fontSize: 16,
                          color: 'var(--neutral-n3)',
                        }}
                        type="delete"
                      />
                    </div>
                    <CommonButton type="light">开始冲刺</CommonButton>
                  </PanelHeader>
                }
                key="1"
              >
                <ResizeTable
                  className="dnd"
                  isSpinning={false}
                  dataWrapNormalHeight=""
                  col={props.columns}
                  noData={<NoData />}
                  dataSource={props.data}
                  components={{ body: { row: SortableItem } }}
                  footer={() => (
                    <CreateTransactionButton>
                      <IconFont
                        style={{
                          fontSize: 16,
                          marginRight: 8,
                        }}
                        type="plus"
                      />
                      <span>新事物</span>
                    </CreateTransactionButton>
                  )}
                />
                {provided.placeholder}
              </Panel>
            </Collapse>
          </XTableWrap>
        )
      }}
    </Droppable>
  )
}

export default XTable
