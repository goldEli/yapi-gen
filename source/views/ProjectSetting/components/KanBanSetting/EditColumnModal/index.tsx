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
  onOkEditColumnModel,
} from '@store/kanbanConfig/kanbanConfig.thunk'
import styled from '@emotion/styled'
import useDeleteConfirmModal from '@/hooks/useDeleteConfirmModal'
import { deleteColumn } from '@store/kanbanConfig'

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
          fontFamily: 'SiYuanMedium',
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
`

interface EditColumnModalProps {}

const EditColumnModal: React.FC<EditColumnModalProps> = props => {
  const [form] = Form.useForm()
  const [t] = useTranslation()
  const { DeleteConfirmModal, open } = useDeleteConfirmModal()
  const { editColumnModelInfo } = useSelector(store => store.KanbanConfig)
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
    const data = await form.validateFields()
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
      title={'编辑列'}
      isVisible={editColumnModelInfo.visible}
      onClose={onClose}
      onConfirm={onsubmit}
      confirmText={'确认'}
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
            label={<LabelTitle title={'名称'} />}
            name="name"
          >
            <Input maxLength={30} placeholder="请输入列名称限30字" autoFocus />
          </Form.Item>
          {/* max_num */}
          <Form.Item
            extra="当列中的卡片数量超过该列最大数会突出显示"
            rules={[{ required: true, message: '' }]}
            label={<LabelTitle title={'最大数量'} />}
            name="max_num"
          >
            <InputNumber min={0} defaultValue={1} />
          </Form.Item>
        </Form>
      </div>
      <DelBtn
        onClick={() => {
          open({
            title: '删除确认',
            text: '确认删除该列与状态，删除后再看板中将无法使用该列与状态',
            onConfirm: () => {
              if (!editColumnModelInfo.columnInfo?.id) {
                return Promise.reject()
              }
              dispatch(deleteColumn(editColumnModelInfo.columnInfo?.id))
              onClose()
              return Promise.resolve()
            },
          })
        }}
      >
        删除列
      </DelBtn>
      <DeleteConfirmModal />
    </CommonModal>
  )
}

export default EditColumnModal
