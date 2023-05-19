import React, { useMemo, useState } from 'react'
import styled from '@emotion/styled'
import SelectOptions from '@/components/SelectOptions'
import { useDispatch, useSelector } from '@store/index'
import { onChangeViewList } from '@store/kanbanConfig'
import SaveAsViewModal from '@/views/SprintProjectKanBan/KanBanBtnsArea/SaveAsViewModal'
import { openSaveAsViewModel } from '@store/sprintKanBan/sprintKanban.thunk'
import DeleteConfirm from '@/components/DeleteConfirm'
import useDeleteConfirmModal from '@/hooks/useDeleteConfirmModal'
import IconFont from '@/components/IconFont'
import CommonButton from '@/components/CommonButton'

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
        <DeleteConfirmModal />
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
        <Btn
          onClick={() => {
            const current = handleViewList.find(item => item.check)
            if (current?.key) {
              dispatch(openSaveAsViewModel(current.key))
            }
          }}
        >
          另存为
        </Btn>
        <Btn>保存更改</Btn>
        <SaveAsViewModal />
      </Left>
      <Right>
        <CommonButton type="icon" icon="tag-96pg0hf3" />
        <CommonButton type="icon" icon="edit" />
        <CommonButton type="icon" icon="delete" />
      </Right>
    </ToolBarBox>
  )
}

export default ToolBar
