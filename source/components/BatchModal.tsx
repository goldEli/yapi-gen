// 批量操作弹窗 -- 编辑及删除
import { useState } from 'react'
import DeleteConfirm from './DeleteConfirm'
import CommonModal from './CommonModal'
import { Checkbox, Form, message, Select } from 'antd'
import { FormWrapDemand } from './StyleCommon'
import { useTranslation } from 'react-i18next'
import { useModel } from '@/models'
import { useSearchParams } from 'react-router-dom'
import { getParamsData } from '@/tools'

interface Props {
  isVisible: boolean
  onChangeVisible(): void
  type: string
  selectRows: any
  onClose(): void
}

const BatchModal = (props: Props) => {
  const [t] = useTranslation()
  const [haveChildren, setHaveChildren] = useState(false)
  const [form] = Form.useForm()
  const { batchDelete, batchEdit } = useModel('demand')
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData.id

  // 批量删除的取消事件
  const onCloseDelete = () => {
    setHaveChildren(false)
    props.onChangeVisible()
  }

  // 批量删除的确认事件
  const onConfirmDelete = async () => {
    try {
      await batchDelete({
        isDeleteChild: haveChildren ? 1 : 2,
        demandIds: props.selectRows?.map((i: any) => i.id),
        projectId,
      })
      message.success(t('common.deleteSuccess'))
      setHaveChildren(false)
      props.onClose()
    } catch (error) {
      //
    }
  }

  // 批量编辑的确认事件
  const onConfirmEdit = async () => {
    await form.validateFields()
    const values = form.getFieldsValue()
    values.projectId = projectId
    values.demandIds = props.selectRows?.map((i: any) => i.id)
    try {
      await batchEdit(values)
      message.success(t('common.editSuccess'))
      form.resetFields()
      props.onClose()
    } catch (error) {
      //
    }
  }

  return (
    <>
      {props.type === 'delete' && (
        <DeleteConfirm
          isVisible={props.isVisible}
          onChangeVisible={onCloseDelete}
          title={t('version2.deleteTitle', { count: props.selectRows?.length })}
          onConfirm={onConfirmDelete}
        >
          <div style={{ marginBottom: 12 }}>{t('version2.deleteToast')}</div>
          <Checkbox onChange={e => setHaveChildren(e.target.checked)}>
            {t('version2.deleteChildren')}
          </Checkbox>
        </DeleteConfirm>
      )}
      {props.type === 'edit' && (
        <CommonModal
          isVisible={props.isVisible}
          onClose={props.onChangeVisible}
          title={t('version2.editTitle', { count: props.selectRows?.length })}
          onConfirm={onConfirmEdit}
        >
          <FormWrapDemand
            form={form}
            layout="vertical"
            style={{ padding: '0 20px 0 2px' }}
          >
            <Form.Item
              label={t('version2.chooseUpdate')}
              name="type"
              rules={[{ required: true, message: '' }]}
            >
              <Select
                placeholder={t('common.pleaseSelect')}
                showArrow
                showSearch
                getPopupContainer={node => node}
                allowClear
                optionFilterProp="label"
              />
            </Form.Item>
            <Form.Item
              label={t('version2.updateAfter')}
              name="target"
              rules={[{ required: true, message: '' }]}
            >
              <Select
                placeholder={t('common.pleaseSelect')}
                showArrow
                showSearch
                getPopupContainer={node => node}
                allowClear
                optionFilterProp="label"
              />
            </Form.Item>
          </FormWrapDemand>
        </CommonModal>
      )}
    </>
  )
}

export default BatchModal
