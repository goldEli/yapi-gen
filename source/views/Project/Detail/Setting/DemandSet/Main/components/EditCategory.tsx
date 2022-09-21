/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/naming-convention */
import CommonModal from '@/components/CommonModal'
import { Input, Form, message } from 'antd'
import styled from '@emotion/styled'
import { useEffect, useState } from 'react'
import { useModel } from '@/models'
import ChooseColor from '../../components/ChooseColor'
import { useSearchParams } from 'react-router-dom'
import { getParamsData } from '@/tools'

const FormWrap = styled(Form)({
  '.ant-form-item': {
    margin: '24px 0 0 0',
  },
})

const ViewWrap = styled.div<{ color: string; bgColor: string }>(
  {
    height: 22,
    borderRadius: 11,
    padding: '0 8px',
    marginRight: 8,
    lineHeight: '22px',
    fontSize: 12,
    fontWeight: 400,
  },
  ({ color, bgColor }) => ({
    background: bgColor,
    color,
  }),
)

interface EditorProps {
  isVisible: boolean
  item?: any
  onClose(): void
}

const EditorCategory = (props: EditorProps) => {
  const {
    colorList,
    getCategoryList,
    updateStoryConfigCategory,
    addStoryConfigCategory,
  } = useModel('project')
  const [name, setName] = useState<any>('')
  const [normalColor, setNormalColor] = useState<any>('')
  const [form] = Form.useForm()
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)

  useEffect(() => {
    if (props?.item?.id) {
      form.setFieldsValue(props?.item)
      setNormalColor(props?.item?.color)
    }
  }, [props?.item])

  const onReset = () => {
    props?.onClose()
    setTimeout(() => {
      form.resetFields()
      getCategoryList({ projectId: paramsData.id })
    }, 100)
  }

  const onConfirm = async () => {
    await form.validateFields()
    if (!form.getFieldValue('color')) {
      message.warning('请选择需求类别颜色！')
      return
    }
    const params = form.getFieldsValue()
    params.projectId = paramsData.id
    params.id = props?.item?.id
    if (props?.item?.id) {
      try {
        await updateStoryConfigCategory(params)
        message.success('编辑成功')
        onReset()
      } catch (error) {

        //
      }
    } else {
      try {
        await addStoryConfigCategory(params)
        message.success('创建成功')
        onReset()
      } catch (error) {

        //
      }
    }
  }

  const onClose = () => {
    props.onClose()
    setTimeout(() => {
      form.resetFields()
      setName('')
      setNormalColor('')
    }, 100)
  }

  const onChangeValue = (val: string | undefined) => {
    setNormalColor(val)
    form.setFieldsValue({
      color: val,
    })
  }

  return (
    <CommonModal
      isVisible={props.isVisible}
      title={props?.item?.id ? '编辑需求类别' : '创建需求类别'}
      onClose={onClose}
      onConfirm={onConfirm}
      confirmText="创建"
    >
      <FormWrap form={form} layout="vertical">
        <Form.Item
          label="类别名称"
          name="name"
          rules={[{ required: true, message: '' }]}
        >
          <Input
            autoComplete="off"
            maxLength={20}
            placeholder="请输入中英文字符限20个字符"
            allowClear
            onChange={e => setName(e.target.value)}
          />
        </Form.Item>
        <Form.Item label="类别说明" name="remark">
          <Input.TextArea
            placeholder="请输入描述类别说明限200个字符"
            autoSize={{ minRows: 5, maxRows: 5 }}
            maxLength={200}
          />
        </Form.Item>
        <Form.Item label="选择颜色" name="color">
          <ChooseColor
            color={normalColor}
            onChangeValue={val => onChangeValue(val)}
          />
        </Form.Item>
        <Form.Item label="预览效果">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <ViewWrap
              color={normalColor || '#969799'}
              bgColor={
                colorList?.filter(i => i.key === (normalColor || '#969799'))[0]
                  ?.bgColor
              }
            >
              {name || '无'}
            </ViewWrap>
            <span>需求名称XXXX</span>
          </div>
        </Form.Item>
      </FormWrap>
    </CommonModal>
  )
}

export default EditorCategory
