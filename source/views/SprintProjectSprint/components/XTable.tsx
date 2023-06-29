import React, { useState } from 'react'
import { SortableItem } from './SortableItem'
import { Droppable } from 'react-beautiful-dnd'
import styled from '@emotion/styled'
import ResizeTable from './ResizeTable'
import NoData from '@/components/NoData'
import { Tooltip } from 'antd'
import IconFont from '@/components/IconFont'
import CommonButton from '@/components/CommonButton'
import CreateSprintModal from './CreateSprintModal'
import { useSearchParams } from 'react-router-dom'
import { getIsPermission, getParamsData } from '@/tools'
import { getMessage } from '@/components/Message'
import { useTranslation } from 'react-i18next'
import { delSprintItem } from '@/services/sprint'
import useDeleteConfirmModal from '@/hooks/useDeleteConfirmModal'
import { useDispatch, useSelector } from '@store/index'
import { setAddWorkItemModal } from '@store/project'
import CompleteSprintModal from './CompleteSprintModal'
import { setSprintRefresh } from '@store/sprint'
import CollapseCustom from './CollapseCustom'
import { CloseWrap } from '@/components/StyleCommon'

interface XTableProps {
  data: any
  columns: any
  list: any
}

const XTableWrap = styled.div`
  .dnd {
    .ant-table-tbody td[data-cypress='draggable-handle'] {
      height: 52px;
    }
  }
  .ant-table-body {
    max-height: 520px !important;
  }
  .nodata {
    height: 50px;
    line-height: 50px;
    background: var(--neutral-white-d4);
    border-radius: 6px 6px 6px 6px;
    border: 1px dashed var(--neutral-n6-d1);
    font-size: 12px;
    font-family: MiSans-Regular, MiSans;
    color: var(--neutral-n3);
    text-align: center;
    &:hover {
      border: 1px dashed var(--primary-d1);
    }
    margin-top: 17px;
  }

  // 元素拖动样式
  .dragItem {
    position: relative;
    touch-action: none;
    transform: translate3d(var(--translate-x, 0), var(--translate-y, 0), 0)
      scale(var(--scale, 1));
    transition: box-shadow 200ms ease;
    cursor: pointer;
  }

  .dragOverlay {
    --scale: 1.02;
    --box-shadow-picked-up: 0 0 0 calc(1px / var(--scale-x, 1))
        rgba(63, 63, 68, 0.05),
      -1px 0 15px 0 rgba(34, 33, 81, 0.01),
      0px 15px 15px 0 rgba(34, 33, 81, 0.25);

    /* animation: pop 200ms cubic-bezier(0.18, 0.67, 0.6, 1.22); */
    box-shadow: var(--box-shadow-picked-up);
    cursor: move !important;
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
  .ant-collapse > .ant-collapse-item > .ant-collapse-header {
    padding: 0px 16px !important;
  }
`
const Header = styled.div`
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

const XTable: React.FC<XTableProps> = props => {
  const { data, list } = props
  const [sprintModal, setSprintModal] = useState<{
    visible: boolean
    type: any
  }>({
    visible: false,
    type: 'create',
  })
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData.id
  const [t]: any = useTranslation()
  const { DeleteConfirmModal, open } = useDeleteConfirmModal()
  const dispatch = useDispatch()
  const [completeVisible, setCompleteVisible] = useState(false)
  const { projectInfo } = useSelector(store => store.project)

  const isCanEdit = getIsPermission(
    projectInfo?.projectPermissions,
    'b/transaction/update',
  )

  const isCanEditSprint = getIsPermission(
    projectInfo?.projectPermissions,
    'b/sprint',
  )
  // const handleShortcutEvent = () => {
  //   // console.log('C键被按下')
  //   dispatch(
  //     setAddWorkItemModal({
  //       visible: true,
  //       params: { type: 4, iterateId: data.id },
  //     }),
  //   )
  // }

  // useShortcutC(handleShortcutEvent)
  // 删除冲刺
  const deleteSprint = async (id: number) => {
    try {
      const result: any = await delSprintItem({ id, project_id: projectId })
      if (result && result.code === 0) {
        getMessage({
          msg: '删除成功',
          type: 'success',
        })
        dispatch(setSprintRefresh(1))
      } else {
        getMessage({
          msg: result?.message,
          type: 'error',
        })
      }
    } catch (error) {
      // console.log(error)
    }
  }

  const getSprintButton = (status: number) => {
    switch (status) {
      case 4:
        return (
          <CommonButton
            type="light"
            isDisable={data?.stories?.length === 0}
            onClick={() => {
              setSprintModal({
                visible: true,
                type: 'start',
              })
            }}
          >
            开始冲刺
          </CommonButton>
        )
      case 1:
        return data?.stories?.length === 0 ? (
          <Tooltip
            placement="top"
            title="此冲刺不含任何事务"
            getPopupContainer={node => node}
          >
            <div>
              <CommonButton
                type="light"
                isDisable
                onClick={() => {
                  setCompleteVisible(true)
                }}
              >
                完成冲刺
              </CommonButton>
            </div>
          </Tooltip>
        ) : (
          <CommonButton
            type="light"
            onClick={() => {
              setCompleteVisible(true)
            }}
          >
            完成冲刺
          </CommonButton>
        )
      default:
        return null
    }
  }

  return (
    <>
      <CollapseCustom
        isExpand
        expandIcon={
          <IconFont
            style={{
              fontSize: 14,
              color: 'var(--neutral-n3)',
            }}
            type="down-icon"
          />
        }
        shrinkIcon={
          <IconFont
            style={{
              fontSize: 14,
              color: 'var(--neutral-n3)',
            }}
            type="right-icon"
          />
        }
        header={
          <Header>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span className="title">{data.name}</span>
              <span className="date">
                {`${data?.start_at ? data.start_at : ''}${
                  data?.start_at && data?.end_at ? '~ ' : ''
                }${data?.end_at ? data?.end_at : ''}`}
                {data?.story_visible_count > 0 || data?.story_count > 0
                  ? `（可见${data?.story_visible_count}个，共${data?.story_count}个事务）`
                  : ''}
              </span>

              {data.id === 0
                ? null
                : !isCanEditSprint && (
                    <>
                      <Tooltip title={data.status === 4 ? '编辑' : '更新'}>
                        <CloseWrap
                          width={24}
                          height={24}
                          style={{ marginRight: 12 }}
                        >
                          <IconFont
                            onClick={() => {
                              setSprintModal({
                                visible: true,
                                type: data.status === 4 ? 'edit' : 'update',
                              })
                            }}
                            className="custom"
                            style={{
                              fontSize: 16,
                            }}
                            type="edit"
                          />
                        </CloseWrap>
                      </Tooltip>

                      <Tooltip title="删除">
                        <CloseWrap width={24} height={24}>
                          <IconFont
                            onClick={() => {
                              open({
                                title: '删除冲刺',
                                text: `确认要删除【${data.name}】的冲刺吗？`,
                                onConfirm: () => deleteSprint(data.id),
                              })
                            }}
                            className="custom"
                            style={{
                              fontSize: 16,
                            }}
                            type="delete"
                          />
                        </CloseWrap>
                      </Tooltip>
                    </>
                  )}
            </div>
            {!isCanEditSprint && (
              <div>
                {data.id === 0 ? (
                  <CommonButton
                    type="light"
                    onClick={() => {
                      setSprintModal({
                        visible: true,
                        type: 'create',
                      })
                    }}
                  >
                    新建冲刺
                  </CommonButton>
                ) : (
                  getSprintButton(data.status)
                )}
              </div>
            )}
          </Header>
        }
      >
        {!isCanEdit && (
          <CommonButton
            type="primaryText"
            icon="plus"
            iconPlacement="left"
            onClick={() => {
              dispatch(
                setAddWorkItemModal({
                  visible: true,
                  params: {
                    type: 4,
                    iterateId: data.id === 0 ? 0 : data.id,
                    title: '创建事务',
                  },
                }),
              )
            }}
          >
            <span>新事务</span>
          </CommonButton>
        )}
        <Droppable key={data.id} droppableId={String(data.id)}>
          {provided => (
            <XTableWrap ref={provided.innerRef} {...provided.droppableProps}>
              <ResizeTable
                className="dnd"
                isSpinning={false}
                dataWrapNormalHeight=""
                col={props.columns}
                noData={
                  data.id === 0 ? (
                    <NoData subText="暂无事务" />
                  ) : (
                    <div className="nodata">
                      {data.status === 4
                        ? '从待办事项拖动或新建事务，以规划该冲刺的工作，添加事务并编辑冲刺后，点击开始冲刺'
                        : '可将已有事务拖拽到此处，来确定冲刺计划'}
                    </div>
                  )
                }
                dataSource={list}
                components={{ body: { row: SortableItem } }}
                pagination={{
                  total: list?.length,
                  showTotal(total: any) {
                    return `共 ${total}条`
                  },
                  defaultPageSize: 10,
                  defaultCurrent: 1,
                  pageSizeOptions: ['10', '20', '50'],
                  showSizeChanger: true,
                  showQuickJumper: true,
                }}
              />
              {provided.placeholder}
            </XTableWrap>
          )}
        </Droppable>
      </CollapseCustom>

      <CreateSprintModal
        type={sprintModal.type}
        visible={sprintModal.visible}
        onClose={() => {
          setSprintModal({
            ...sprintModal,
            visible: false,
          })
        }}
        editId={data.id}
        projectId={projectId}
      />
      <CompleteSprintModal
        id={data.id}
        projectId={projectId}
        visible={completeVisible}
        onClose={() => {
          setCompleteVisible(false)
        }}
      />
      <DeleteConfirmModal />
    </>
  )
}

export default XTable
