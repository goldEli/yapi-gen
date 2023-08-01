/* eslint-disable require-unicode-regexp */
import React, { useState } from 'react'
import { SortableItem } from './SortableItem'
import { Droppable } from 'react-beautiful-dnd'
import styled from '@emotion/styled'
import ResizeTable from './ResizeTable'
import NoData from '@/components/NoData'
import { Popover, Tooltip } from 'antd'
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
import { setAddWorkItemModal, setProjectInfoValues } from '@store/project'
import CompleteSprintModal from './CompleteSprintModal'
import { setSprintRefresh } from '@store/sprint'
import CollapseCustom from './CollapseCustom'
import { CloseWrap, PopoverTargetText } from '@/components/StyleCommon'
import { getProjectInfoValues } from '@/services/project'
import { useHotkeys } from 'react-hotkeys-hook'

interface XTableProps {
  data: any
  columns: any
  list: any
  activeKey: number
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
    font-family: SiYuanRegular;
    color: var(--neutral-n3);
    text-align: center;
    /* &:hover {
      border: 1px dashed var(--primary-d1);
    } */
    margin-top: 17px;
  }

  .isDraggingOver {
    border: 1px dashed var(--primary-d1);
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
    /* --box-shadow-picked-up: 0 0 0 calc(1px / var(--scale-x, 1))
        rgba(63, 63, 68, 0.05),
      -1px 0 15px 0 rgba(34, 33, 81, 0.01),
      0px 15px 15px 0 rgba(34, 33, 81, 0.25); */
    box-shadow: 0px 0px 15px 6px rgba(0, 0, 0, 0.12);
    border-radius: 6px;
    /* animation: pop 200ms cubic-bezier(0.18, 0.67, 0.6, 1.22); */
    background-color: var(--neutral-white-d1);
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
  align-items: center;
  margin-bottom: 12px;
  .title {
    font-size: 14px;
    font-family: SiYuanMedium;
    font-weight: 500;
    color: var(--neutral-n1-d1);
  }
  .date {
    font-size: 12px;
    font-family: SiYuanRegular;
    font-weight: 400;
    color: var(--neutral-n3);
    margin-left: 16px;
    margin-right: 16px;
    white-space: nowrap;
  }
`
const DisabledButton = styled.div`
  display: flex;
  align-items: center;
  background: var(--auxiliary-b10) !important;
  color: var(--auxiliary-t4) !important;
  cursor: no-drop !important;
  min-width: 88px;
  height: 32px;
  border-radius: 6px 6px 6px 6px;
  white-space: nowrap;
  padding: 4px 15px;
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

  // 项目是否已经结束
  const isEnd = projectInfo?.status === 2

  const isCanEditSprint = getIsPermission(
    projectInfo?.projectPermissions,
    'b/sprint',
  )

  // 更新事务页面的冲刺数据
  const updateSprintList = async () => {
    const [projectInfoData] = await Promise.all([
      getProjectInfoValues({ projectId }),
    ])

    dispatch(setProjectInfoValues(projectInfoData))
  }

  // 删除冲刺
  const deleteSprint = async (id: number) => {
    try {
      const result: any = await delSprintItem({ id, project_id: projectId })
      if (result && result.code === 0) {
        getMessage({
          msg: t('common.deleteSuccess'),
          type: 'success',
        })
        if (props.activeKey === 0) {
          sessionStorage.removeItem('noRefresh')
        } else {
          sessionStorage.setItem('noRefresh', 'true')
        }
        dispatch(setSprintRefresh(1))
        updateSprintList()
      } else {
        getMessage({
          msg: result?.message,
          type: 'error',
        })
      }
    } catch (error) {
      //
    }
  }

  const getSprintButton = (status: number) => {
    switch (status) {
      case 4:
        return data?.stories?.length === 0 ? (
          <DisabledButton>{t('sprint.startSprint')}</DisabledButton>
        ) : (
          <CommonButton
            type="light"
            onClick={() => {
              setSprintModal({
                visible: true,
                type: 'start',
              })
            }}
          >
            {t('sprint.startSprint')}
          </CommonButton>
        )
      case 1:
        return data?.stories?.length === 0 ? (
          <Tooltip
            title={t('sprint.noBusiness')}
            getPopupContainer={node => node}
          >
            <DisabledButton>{t('sprint.completeSprint')}</DisabledButton>
          </Tooltip>
        ) : (
          <CommonButton
            type="light"
            onClick={() => {
              if (props.activeKey === 0) {
                sessionStorage.removeItem('noRefresh')
              } else {
                sessionStorage.setItem('noRefresh', 'true')
              }
              setCompleteVisible(true)
            }}
          >
            {t('sprint.completeSprint')}
          </CommonButton>
        )
      default:
        return null
    }
  }
  useHotkeys(
    'c',
    () => {
      dispatch(
        setAddWorkItemModal({
          visible: true,
          params: {
            type: 8,
            iterateId: data.id === 0 ? 0 : data.id,
            title: t('sprint.createTransaction'),
          },
        }),
      )
    },
    [],
  )

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
                  ? `（${t('sprint.visible')}${data?.story_visible_count}${t(
                      'sprint.number',
                    )}，${t('sprint.total')}${data?.story_count}${t(
                      'sprint.number',
                    )}${t('affairs')}）`
                  : ''}
              </span>
              {data.id === 0 ? null : (
                <Popover
                  content={
                    <PopoverTargetText>
                      {data.iterate_info || '--'}
                    </PopoverTargetText>
                  }
                  placement="bottom"
                  trigger="click"
                >
                  <Tooltip title={t('sprint.sprintTarget')}>
                    <CloseWrap
                      width={24}
                      height={24}
                      style={{ marginRight: 12 }}
                    >
                      <IconFont
                        className="custom"
                        style={{
                          fontSize: 16,
                        }}
                        type="target"
                      />
                    </CloseWrap>
                  </Tooltip>
                </Popover>
              )}

              {data.id === 0
                ? null
                : !isCanEditSprint &&
                  !isEnd && (
                    <>
                      <Tooltip
                        title={
                          data.status === 4
                            ? t('sprint.edit')
                            : t('sprint.update')
                        }
                      >
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

                      <Tooltip title={t('common.del')}>
                        <CloseWrap width={24} height={24}>
                          <IconFont
                            onClick={() => {
                              open({
                                title: t('sprint.deleteSprint'),
                                text: `${t('sprint.confirmDelete')}【${
                                  data.name
                                }】${t('sprint.ofSprint')}，${t(
                                  'sprint.removeSprintToAgency',
                                )}`,
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
            {!isCanEditSprint && !isEnd && (
              <div>
                {data.id === 0 ? (
                  <CommonButton
                    type="light"
                    onClick={() => {
                      if (props.activeKey === 0) {
                        sessionStorage.removeItem('noRefresh')
                      } else {
                        sessionStorage.setItem('noRefresh', 'true')
                      }
                      setSprintModal({
                        visible: true,
                        type: 'create',
                      })
                    }}
                  >
                    {t('sprint.createSprint')}
                  </CommonButton>
                ) : (
                  getSprintButton(data.status)
                )}
              </div>
            )}
          </Header>
        }
      >
        {!isCanEdit && !isEnd && (
          <CommonButton
            type="primaryText"
            icon="plus"
            iconPlacement="left"
            onClick={() => {
              sessionStorage.setItem('noRefresh', 'true')
              dispatch(
                setAddWorkItemModal({
                  visible: true,
                  params: {
                    type: 8,
                    iterateId: data.id === 0 ? 0 : data.id,
                    title: t('sprint.createTransaction'),
                    projectId,
                  },
                }),
              )
            }}
          >
            <span>{t('sprint.newAffairs')}</span>
          </CommonButton>
        )}
        <Droppable key={data.id} droppableId={String(data.id)}>
          {(provided, snapshot) => {
            return (
              <XTableWrap ref={provided.innerRef} {...provided.droppableProps}>
                <ResizeTable
                  id={data?.id}
                  height={
                    snapshot.isDraggingOver
                      ? data.stories?.length
                        ? data.stories.length <= 9
                          ? (data.stories.length + 1) * 70
                          : (data.stories.length + 1) * 52
                        : // eslint-disable-next-line no-undefined
                          undefined
                      : // eslint-disable-next-line no-undefined
                        undefined
                  }
                  dataWrapNormalHeight=""
                  className="dnd"
                  isSpinning={false}
                  col={props.columns}
                  noData={
                    data.id === 0 ? (
                      <NoData subText={t('sprint.noTransaction')} />
                    ) : (
                      <div
                        className={`nodata ${
                          snapshot.isDraggingOver ? 'isDraggingOver' : ''
                        }`}
                      >
                        {data.status === 4
                          ? t('sprint.desc1')
                          : t('sprint.desc2')}
                      </div>
                    )
                  }
                  dataSource={list}
                  components={{ body: { row: SortableItem } }}
                  pagination={{
                    total: list?.length,
                    showTotal(total: any) {
                      return `${t('sprint.total')} ${total}${t(
                        'sprint.pieces',
                      )}`
                    },
                    defaultPageSize: 30,
                    defaultCurrent: 1,
                    pageSizeOptions: ['10', '20', '30', '50'],
                    showSizeChanger: true,
                    showQuickJumper: true,
                  }}
                />
                {provided.placeholder}
              </XTableWrap>
            )
          }}
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
