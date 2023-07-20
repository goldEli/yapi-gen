/**
 * 另存为视图  编辑视图弹窗
 */
import React from 'react'
import { Form, Input, InputNumber } from 'antd'
import { useTranslation } from 'react-i18next'
import CommonModal from '@/components/CommonModal'
import { useDispatch, useSelector } from '@store/index'
import {
  closeEditColumnModel,
  getKanbanConfigRemainingStatus,
  onOkEditColumnModel,
} from '@store/kanbanConfig/kanbanConfig.thunk'
import styled from '@emotion/styled'
import useDeleteConfirmModal from '@/hooks/useDeleteConfirmModal'
import { deleteColumn, setUnassignStatusList } from '@store/kanbanConfig'
import useKanBanData from '../hooks/useKanBanData'

const LabelTitle = (props: any) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <span
        style={{
          fontSize: '14px',
        }}
      >
        {props.title}
      </span>
    </div>
  )
}

const DelBtn = styled.div`
  font-size: 14px;
  color: var(--auxiliary-text-t2-d1);
  position: absolute;
  bottom: 29px;
  left: 26px;
  cursor: pointer;
  z-index: 100;
  &:hover {
    color: var(--primary-d2);
  }
`

interface EditColumnModalProps {}

const EditColumnModal: React.FC<EditColumnModalProps> = props => {
  const [form] = Form.useForm()
  const [t] = useTranslation()
  const { DeleteConfirmModal, open } = useDeleteConfirmModal()
  const { editColumnModelInfo } = useSelector(store => store.KanbanConfig)
  const { columnList } = useKanBanData()
  const { unassignStatusList } = useSelector(store => store.KanbanConfig)
  React.useEffect(() => {
    if (editColumnModelInfo.columnInfo) {
      form.setFieldsValue({
        name: editColumnModelInfo.columnInfo.name,
        max_num: editColumnModelInfo.columnInfo.max_num,
      })
      return
    }
  }, [editColumnModelInfo.columnInfo])
  const dispatch = useDispatch()

  const onClose = () => {
    dispatch(closeEditColumnModel())
  }

  const confirm = async () => {
    let data = await form.validateFields()
    data = { ...data, name: data.name.trim() }
    if (!editColumnModelInfo.columnInfo) {
      return
    }
    dispatch(
      onOkEditColumnModel({
        ...editColumnModelInfo.columnInfo,
        ...data,
      }),
    )
  }

  const onsubmit = () => {
    form.submit()
  }

  return (
    <CommonModal
      width={528}
      title={t('edit_column')}
      isVisible={editColumnModelInfo.visible}
      onClose={onClose}
      onConfirm={onsubmit}
      confirmText={t('confirm')}
    >
      <div
        style={{
          padding: '0 24px',
        }}
      >
        <Form
          form={form}
          onFinish={confirm}
          layout="vertical"
          onFinishFailed={() => {}}
        >
          <Form.Item
            rules={[{ required: true, message: '' }]}
            label={<LabelTitle title={t('name1')} />}
            name="name"
          >
            <Input
              maxLength={30}
              placeholder={t(
                'please_enter_a_column_name_with_a_limit_of_30_characters',
              )}
              autoFocus
            />
          </Form.Item>
          {/* max_num */}
          <Form.Item
            extra={
              <div
                style={{
                  marginTop: 8,
                  fontSize: 12,
                  color: 'var(--neutral-n3)',
                }}
              >
                {t(
                  'highlights_when_the_number_of_cards_in_a_column_exceeds_the_maximum_number_for_that_column',
                )}
              </div>
            }
            rules={[{ required: true, message: '' }]}
            label={<LabelTitle title={t('greatest_amount')} />}
            name="max_num"
          >
            {/* <CustomNumberWrap>
              <InputNumber
                min={0}
                defaultValue={1}
                style={{ width: '100%' }}
                max={100}
              />
            </CustomNumberWrap> */}
            <InputNumber
              min={0}
              defaultValue={1}
              style={{ width: '100%' }}
              max={999999}
              precision={0}
            />
          </Form.Item>
        </Form>
      </div>
      <DelBtn
        onClick={() => {
          const status = (editColumnModelInfo?.columnInfo?.categories || [])
            .filter(item => item.status?.length)
            .reduce((pre: any, current: any) => {
              pre.push(...current.status)
              return pre
            }, [])
          open({
            title: t('confirm_deletion'),
            text: t(
              'confirm_to_delete_the_column_and_status,_after_deletion,_the_column_and_status_will_not_be_available_in_the_Kanban',
            ),
            onConfirm: () => {
              if (!editColumnModelInfo.columnInfo?.id) {
                return Promise.reject()
              }
              dispatch(deleteColumn(editColumnModelInfo.columnInfo?.id))
              dispatch(setUnassignStatusList(status))
              onClose()
              return Promise.resolve()
            },
          })
        }}
      >
        {t('delete_column')}
      </DelBtn>
      <DeleteConfirmModal />
    </CommonModal>
  )
}

export default EditColumnModal
