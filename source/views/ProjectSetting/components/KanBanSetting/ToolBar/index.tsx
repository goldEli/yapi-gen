import React, { useMemo, useState } from 'react'
import styled from '@emotion/styled'
import { useDispatch, useSelector } from '@store/index'

import useDeleteConfirmModal from '@/hooks/useDeleteConfirmModal'
import IconFont from '@/components/IconFont'
import CommonButton from '@/components/CommonButton'
import {
  deleteKanbanConfig,
  onChangeViewList,
  openSaveAsViewModel,
  saveKanbanConfig,
  setDefaultKanbanConfig,
} from '@store/kanbanConfig/kanbanConfig.thunk'
import useProjectId from '../hooks/useProjectId'
import SelectOptions, { ViewItem } from '../SelectOptions'
import useI18n from '@/hooks/useI18n'

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

const ToolBar: React.FC<ToolBarProps> = props => {
  const { viewList } = useSelector(store => store.KanbanConfig)
  const checkedViewListItem = useMemo(() => {
    return viewList?.find(item => item.check)
  }, [viewList])
  const { t } = useI18n()

  const dispatch = useDispatch()
  const handleViewList = useMemo<ViewItem[]>(() => {
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
      title: t('confirm_deletion'),
      text: t(
        'confirm_to_delete_the_column_and_status,_after_deletion,_the_column_and_status_will_not_be_available_in_the_Kanban',
      ),
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
          title={t('columns_and_status')}
          createViewTitle={t('create_columns_and_status')}
          options={handleViewList}
          onChange={key => {
            dispatch(onChangeViewList(Number(key)))
          }}
          operation
          onDefault={key => {
            dispatch(
              setDefaultKanbanConfig({
                id: Number(key),
              }),
            )
          }}
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
                title: t('create_columns_and_status'),
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
          {t('save_as')}
        </Btn>
        <Btn
          onClick={e => {
            e.stopPropagation()
            dispatch(saveKanbanConfig())
          }}
        >
          {t('save_Changes')}
        </Btn>
      </Left>
      <Right>
        <CommonButton
          onClick={() => {
            if (checkedViewListItem?.id) {
              dispatch(
                setDefaultKanbanConfig({
                  id: checkedViewListItem?.id,
                }),
              )
            }
          }}
          type="icon"
          icon="tag-96pg0hf3"
        />
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
            if (checkedViewListItem?.id) {
              onDel(checkedViewListItem?.id)
            }
          }}
          type="icon"
          icon="delete"
        />
      </Right>
    </ToolBarBox>
  )
}

export default ToolBar
