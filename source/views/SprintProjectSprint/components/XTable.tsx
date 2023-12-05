/* eslint-disable require-unicode-regexp */
import React, { useEffect, useRef, useState } from 'react'
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
import { getProjectInfoValues } from '@/services/project'
import { useHotkeys } from 'react-hotkeys-hook'
import useShowTargetModal from '@/hooks/useShowTargetModal'
import { css } from '@emotion/css'

const hoCss = css`
  :hover {
    background-color: #f6f7f9;
    color: var(--primary-d1);
  }
`

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
  min-height: 32px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
  .titleBox {
    display: flex;
    flex-direction: column;
    width: calc(100% - 280px);
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
      margin-right: 16px;
      white-space: nowrap;
    }
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
  const [isOverflowing, setIsOverflowing] = useState(false)
  const textRef = useRef<HTMLDivElement>(null)
  const textRef2 = useRef<HTMLSpanElement>(null)
  const [t]: any = useTranslation()
  const { openTargetModal, TargetModal } = useShowTargetModal()
  const { DeleteConfirmModal, open } = useDeleteConfirmModal()
  const dispatch = useDispatch()
  const [completeVisible, setCompleteVisible] = useState(false)
  const { projectInfo } = useSelector(store => store.project)
  const [isFilter, setIsFilter] = useState(false)
  const isCanEdit = getIsPermission(
    projectInfo?.projectPermissions,
    'b/transaction/update',
  )
  const onVisibleChange = (visible: any) => {
    setIsFilter(visible)
  }

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
  const filterContent = (
    <div
      style={{
        width: '120px',
        height: '72px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        background: '#FFFFFF',
        boxShadow: '0px 0px 15px 6px rgba(0,0,0,0.12)',
        borderRadius: '6px 6px 6px 6px',
      }}
    >
      <div
        className={hoCss}
        onClick={() => {
          setIsFilter(false)
          setSprintModal({
            visible: true,
            type: data.status === 4 ? 'edit' : 'update',
          })
        }}
        style={{
          width: '100%',
          fontSize: 14,
          height: '32px',
          display: 'flex',
          alignItems: 'center',
          paddingLeft: 16,
          cursor: 'pointer',
        }}
      >
        {data.status === 4 ? t('editSprint') : t('sprint.update')}
      </div>
      <div
        onClick={() => {
          setIsFilter(false)
          open({
            title: t('sprint.deleteSprint'),
            text: `${t('sprint.confirmDelete')}【${data.name}】${t(
              'sprint.ofSprint',
            )}，${t('sprint.removeSprintToAgency')}`,
            onConfirm: () => deleteSprint(data.id),
          })
        }}
        className={hoCss}
        style={{
          width: '100%',
          height: '32px',
          fontSize: 14,
          display: 'flex',
          alignItems: 'center',
          paddingLeft: 16,
          cursor: 'pointer',
        }}
      >
        {t('deleteSprint')}
      </div>
    </div>
  )
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
  // 上面代码17行中的getPadding函数
  const getPadding = (el: HTMLElement) => {
    const style = window.getComputedStyle(el, null)
    const paddingLeft = Number.parseInt(style.paddingLeft, 10) || 0
    const paddingRight = Number.parseInt(style.paddingRight, 10) || 0
    const paddingTop = Number.parseInt(style.paddingTop, 10) || 0
    const paddingBottom = Number.parseInt(style.paddingBottom, 10) || 0
    return {
      left: paddingLeft,
      right: paddingRight,
      top: paddingTop,
      bottom: paddingBottom,
    }
  }

  const handleResize = () => {
    if (textRef.current && textRef2.current) {
      const { left, right } = getPadding(textRef.current)
      const horizontalPadding = left + right
      if (
        textRef.current.clientWidth <=
        textRef2.current.offsetWidth + horizontalPadding
      ) {
        setIsOverflowing(true)
      } else {
        setIsOverflowing(false)
      }
    }
  }
  useEffect(() => {
    handleResize()
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [data.iterate_info])

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
            <div className="titleBox">
              <div className="title">{data.name}</div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
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
                  <CommonButton
                    onClick={() => {
                      openTargetModal({
                        title: t('sprintDetails'),
                        editId: data.id,
                        projectId: projectId,
                        onConfirm: () => {},
                      })
                    }}
                    type="secondaryText"
                  >
                    <IconFont
                      className="custom"
                      style={{
                        fontSize: 16,
                      }}
                      type="target"
                    />
                    {t('viewGoals')}
                  </CommonButton>
                )}
              </div>
            </div>
            {!isCanEditSprint && (
              <div style={{ display: 'flex', gap: '16px' }}>
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
                {data.id === 0
                  ? null
                  : !isCanEditSprint && (
                      <Popover
                        trigger="click"
                        placement="bottomRight"
                        content={filterContent}
                        getPopupContainer={node => node}
                        visible={isFilter}
                        onVisibleChange={onVisibleChange}
                      >
                        <CommonButton type="light">{t('more')}</CommonButton>
                      </Popover>
                    )}
              </div>
            )}
          </Header>
        }
      >
        {data.iterate_info ? (
          <Tooltip
            title={isOverflowing ? data.iterate_info : ''}
            overlayInnerStyle={{
              width: 600,
              maxHeight: 300,
              overflow: 'scroll',
            }}
          >
            <div
              ref={textRef}
              style={{
                height: '28px',
                background: '#F6F7F9',
                borderRadius: '4px 4px 4px 4px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                color: '#969799',
                fontSize: '12px',
                lineHeight: '28px',
                padding: '0 6px',
              }}
            >
              <span ref={textRef2}> {data.iterate_info}</span>
            </div>
          </Tooltip>
        ) : null}

        {!isCanEdit && (
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
      <TargetModal />
    </>
  )
}

export default XTable
