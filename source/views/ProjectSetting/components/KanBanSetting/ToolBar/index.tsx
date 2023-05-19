import React, { useMemo, useState } from 'react'
import styled from '@emotion/styled'
import SelectOptions from '@/components/SelectOptions'
import { useDispatch, useSelector } from '@store/index'
import { onChangeViewList } from '@store/kanbanConfig'
import SaveAsViewModal from '@/views/SprintProjectKanBan/KanBanBtnsArea/SaveAsViewModal'
import { openSaveAsViewModel } from '@store/sprintKanBan/sprintKanban.thunk'
import DeleteConfirm from '@/components/DeleteConfirm'
import useDeleteConfirmModal from '@/hooks/useDeleteConfirmModal'

interface ToolBarProps {}

const ToolBarBox = styled.div`
  width: 100%;
`
const Left = styled.div`
  display: flex;
`
const Right = styled.div``

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
          isDefault: !!item.is_default,
          operation: true,
        }
      }) ?? []
    return res
  }, [viewList])

  const { open, DeleteConfirmModal } = useDeleteConfirmModal()
  return (
    <ToolBarBox>
      <Left>
        <DeleteConfirmModal>123</DeleteConfirmModal>
        <SelectOptions
          onDel={key => {
            open({
              title: '确认删除',
              text: '确认删除该列与状态，删除后再看板中将无法使用该列与状态',
              onConfirm() {
                return Promise.resolve()
              },
            })
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
            dispatch(openSaveAsViewModel(key))
          }}
          onCreateView={() => {
            dispatch(openSaveAsViewModel())
          }}
        />
        <SaveAsViewModal />
      </Left>
      <Right></Right>
    </ToolBarBox>
  )
}

export default ToolBar
