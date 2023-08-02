/* eslint-disable no-case-declarations */
/**
 * kanban 列title区域
 */
import React, { useState } from 'react'
import styled from '@emotion/styled'
import MoveIcon from '../MoveIcon'
import IconFont from '@/components/IconFont'
import { Draggable } from 'react-beautiful-dnd'
import IssuesGroupList from '../IssuesGroupList'
import useKanBanData from '../hooks/useKanBanData'
import { useDispatch, useSelector } from '@store/index'
import {
  closeEditColumnModel,
  openEditColumnModel,
} from '@store/kanbanConfig/kanbanConfig.thunk'
import { Popover, Space, Tooltip } from 'antd'
import useIsTextOverflowed from '../hooks/useIsTextOverflowed'
import useI18n from '@/hooks/useI18n'
import { ChangeItem, ChangeItems } from '@/views/Container/style'
import CommonIconFont from '@/components/CommonIconFont'
import useDeleteConfirmModal from '@/hooks/useDeleteConfirmModal'
import { deleteColumn, setUnassignStatusList } from '@store/kanbanConfig'

interface ColumnTitleAreaProps {
  index: number
}
const ColumnTitle = styled.div`
  flex-shrink: 0;
  width: 302px;
  height: 48px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  background-color: var(--neutral-n9);
  padding: 0 16px;
  justify-content: space-between;
  overflow: hidden;
`

const ColumnTitleAreaBox = styled.div<{ showBorder: boolean }>`
  display: flex;
  gap: 16px;
  flex-direction: column;
  box-sizing: border-box;
  border: 1px solid
    ${props => (props.showBorder ? 'var(--primary-d1)' : 'transparent')};
  background: ${props => (props.showBorder ? '#fff' : 'transparent')};
`
const TextBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 8px;
  margin-right: 16px;
  overflow: hidden;
`
const Text = styled.span`
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--neutral-n1-d1);
`

const Count = styled.div`
  display: flex;
  font-size: 12px;
  color: var(--neutral-n3);
  flex-shrink: 0;
`
const Left = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
  align-items: center;
  padding-right: 8px;
  box-sizing: border-box;
`
const IconWrap = styled(IconFont)`
  cursor: pointer;
  font-size: 20px;
  color: var(--neutral-n1-d1);
  &:hover svg {
    color: var(--primary-d2);
  }
`

const ColumnTitleArea: React.FC<ColumnTitleAreaProps> = props => {
  const { columnList } = useKanBanData()
  const item = columnList?.[props.index ?? 0]
  const draggableId = item.id + '1'
  const dispatch = useDispatch()
  const { t } = useI18n()
  const [isCreateVisible2, setIsCreateVisible2] = useState(false)
  const { textRef, isTextOverflowed } = useIsTextOverflowed(item.name)
  const { editColumnModelInfo } = useSelector(store => store.KanbanConfig)
  const { DeleteConfirmModal, open } = useDeleteConfirmModal()
  const onClose = () => {}
  const [popoverVisible, setPopoverVisible] = useState(false)
  const createList2 = [
    {
      name: '编辑列',
      key: 'keyboard',
      // icon: 'keyboard',
      isPermission: true,
    },
    {
      name: '删除列',
      key: 'question',
      // icon: 'question',
      isPermission: true,
    },
  ]
  const onCreate = (key: string) => {
    switch (key) {
      case 'keyboard':
        dispatch(openEditColumnModel(item))
        return
      case 'question':
        open({
          title: t('confirm_deletion'),
          text: t(
            'confirm_to_delete_the_column_and_status,_after_deletion,_the_column_and_status_will_not_be_available_in_the_Kanban',
          ),
          onConfirm: () => {
            if (!item.id) {
              return Promise.reject()
            }
            dispatch(deleteColumn(item?.id))
            // dispatch(setUnassignStatusList(status))
            onClose()
            return Promise.resolve()
          },
        })
    }
  }
  const content = (list: any) => {
    return (
      <ChangeItems>
        {list.map((i: any) => (
          <ChangeItem
            key={i.key}
            height={40}
            onClick={(e: any) => {
              setPopoverVisible(false)
              e.stopPropagation()
              onCreate(i.key)
            }}
            hidden={!i.isPermission}
          >
            <Space size={8}>
              <CommonIconFont type={i.icon} color="var(--neutral-n3)" />
              {i.name}
            </Space>
          </ChangeItem>
        ))}
      </ChangeItems>
    )
  }

  return (
    <Draggable draggableId={draggableId} index={props.index}>
      {(provided, snapshot) => {
        return (
          <ColumnTitleAreaBox
            ref={provided.innerRef}
            {...provided.draggableProps}
            showBorder={snapshot.isDragging}
          >
            <ColumnTitle {...provided.dragHandleProps} key={item.id}>
              <Left>
                <MoveIcon active={snapshot.isDragging} />
                <TextBox>
                  <Tooltip title={isTextOverflowed ? item?.name : ''}>
                    <Text ref={textRef}>{item?.name}</Text>
                  </Tooltip>
                </TextBox>
                <Count>{`${t('maximum')}：${item.max_num}`}</Count>
              </Left>
              <Popover
                content={content(createList2)}
                getPopupContainer={node => node}
                placement="bottomRight"
                open={popoverVisible}
                onOpenChange={open => {
                  setPopoverVisible(open)
                }}
              >
                <IconWrap type="more" style={{ color: 'var(--neutral-n2)' }} />
              </Popover>
            </ColumnTitle>

            <IssuesGroupList
              groupId={item.id}
              key={item.id + '_'}
              index={props.index}
            />
            <DeleteConfirmModal key={13} />
          </ColumnTitleAreaBox>
        )
      }}
    </Draggable>
  )
}

export default ColumnTitleArea
