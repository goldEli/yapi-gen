/* eslint-disable require-unicode-regexp */
import styled from '@emotion/styled'
import { useDispatch, useSelector } from '@store/index'
import {
  setCreateIterationParams,
  setIsCreateIterationVisible,
} from '@store/iterate'
import { Form, Input, Select, Space } from 'antd'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import CommonModal from '../CommonModal'
import RangePicker from '../RangePicker'
import RichEditor from '../RichEditor'

const ItemWrap = styled(Space)`
  display: flex;
  align-items: center;
  .ant-space-item {
    width: 50%;
  }
`

const CreateIteration = () => {
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const { isCreateIterationVisible, createIterationParams } = useSelector(
    store => store.iterate,
  )
  const inputRef = useRef<HTMLInputElement>(null)
  const [form] = Form.useForm()
  // 迭代时间
  const [times, setTimes] = useState<any>(null)

  //   关闭弹窗
  const onCancel = () => {
    form.resetFields()
    dispatch(setIsCreateIterationVisible(false))
    dispatch(setCreateIterationParams({}))
  }

  const onConfirm = () => {
    //
  }

  const onChangePicker = (values: any) => {
    setTimes(values)
    form.setFieldsValue({
      time: values,
    })
  }

  return (
    <CommonModal
      isVisible={isCreateIterationVisible}
      title={
        createIterationParams?.id
          ? t('project.editIterate')
          : t('common.createIterate')
      }
      onClose={onCancel}
      onConfirm={onConfirm}
      width={784}
    >
      <div
        style={{
          height: '60vh',
          overflow: 'auto',
          padding: '0 16px 0 24px',
        }}
      >
        <Form
          layout="vertical"
          form={form}
          initialValues={createIterationParams}
        >
          <Form.Item
            label={t('common.iterateName')}
            rules={[{ required: true, message: '' }]}
            name="iterationName"
            getValueFromEvent={event => {
              return event.target.value.replace(/(?<start>^\s*)/g, '')
            }}
          >
            <Input
              autoComplete="off"
              maxLength={50}
              ref={inputRef as any}
              autoFocus
              placeholder={t('mark.level')}
            />
          </Form.Item>
          <ItemWrap size={24}>
            <Form.Item
              label="选择项目"
              rules={[{ required: true, message: '' }]}
              name="projectId"
            >
              <Select style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              label={t('project.iterateTime')}
              rules={[{ required: true, message: '' }]}
              name="time"
            >
              <RangePicker
                isShowQuick={false}
                dateValue={times}
                onChange={(values: any) => onChangePicker(values)}
              />
            </Form.Item>
          </ItemWrap>
          <Form.Item label={t('project.iterateTarget')}>
            <RichEditor />
          </Form.Item>
        </Form>
      </div>
    </CommonModal>
  )
}

export default CreateIteration
