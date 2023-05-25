import React, { useMemo, useState } from 'react'
import styled from '@emotion/styled'
import { useDispatch, useSelector } from '@store/index'
import { onChangeViewList } from '@store/kanbanConfig'

import useDeleteConfirmModal from '@/hooks/useDeleteConfirmModal'
import IconFont from '@/components/IconFont'
import CommonButton from '@/components/CommonButton'
import {
  deleteKanbanConfig,
  openSaveAsViewModel,
} from '@store/kanbanConfig/kanbanConfig.thunk'
import useProjectId from '../hooks/useProjectId'
import SelectOptions from '../SelectOptions'

interface ToolBarProps {}

const ToolBarBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding-right: 59px;
  box-sizing: border-box;
`
const Btn = styled.div`
  font-size: 14px;
  color: var(--auxiliary-text-t2-d2);
`

const Left = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  cursor: pointer;
`
const Right = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 16px;
`

const IconWrap = styled(IconFont)`
  font-size: 14px;
  color: var(--neutral-n3);
  &:hover {
    color: var(--auxiliary-b1);
  }
`

const ToolBar: React.FC<ToolBarProps> = props => {
  const { viewList } = useSelector(store => store.KanbanConfig)

  const dispatch = useDispatch()
  const handleViewList = useMemo<Model.SprintKanBan.ViewItem[]>(() => {
    const res =
      viewList?.map(item => {
        return {
          key: String(item.id),
          value: item.name,
          check: item.check ?? false,
          isDefault: item.is_default === 1,
          operation: true,
        }
      }) ?? []
    return res
  }, [viewList])

  const { open, DeleteConfirmModal } = useDeleteConfirmModal()
  const { projectId } = useProjectId()
  const onDel = (id: number) => {
    open({
      title: '确认删除',
      text: '确认删除该列与状态，删除后再看板中将无法使用该列与状态',
      onConfirm() {
        dispatch(
          deleteKanbanConfig({
            project_id: projectId,
            id,
          }),
        )
        return Promise.resolve()
      },
    })
  }
  const current = handleViewList.find(item => item.check)
  return (
    <ToolBarBox>
      <Left>
        <DeleteConfirmModal />
        <SelectOptions
          onDel={key => {
            onDel(parseInt(key, 10))
          }}
          title="视图"
          createViewTitle="创建列与状态"
          options={handleViewList}
          onChange={key => {
            dispatch(onChangeViewList(Number(key)))
          }}
          operation
          onDefault={key => {}}
          onEdit={key => {
            dispatch(
              openSaveAsViewModel({
                id: Number(key),
              }),
            )
          }}
          onCreateView={() => {
            dispatch(
              openSaveAsViewModel({
                title: '创建列与状态',
              }),
            )
          }}
        />
        <Btn
          onClick={() => {
            if (current?.key) {
              dispatch(
                openSaveAsViewModel({
                  id: Number(current.key),
                }),
              )
            }
          }}
        >
          另存为
        </Btn>
        <Btn>保存更改</Btn>
      </Left>
      <Right>
        <CommonButton type="icon" icon="tag-96pg0hf3" />
        <CommonButton
          onClick={() => {
            if (current?.key) {
              dispatch(
                openSaveAsViewModel({
                  id: Number(current.key),
                }),
              )
            }
          }}
          type="icon"
          icon="edit"
        />
        <CommonButton
          onClick={() => {
            // onDel()
          }}
          type="icon"
          icon="delete"
        />
      </Right>
    </ToolBarBox>
  )
}

export default ToolBar
