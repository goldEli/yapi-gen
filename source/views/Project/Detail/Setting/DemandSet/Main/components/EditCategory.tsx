/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/naming-convention */
import CommonModal from '@/components/CommonModal'
import { Input, Form } from 'antd'
import styled from '@emotion/styled'
import { useEffect, useState } from 'react'
import { useModel } from '@/models'
import ChooseColor from '../../components/ChooseColor'

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
  onConfirm(data: any): void
}

const EditorCategory = (props: EditorProps) => {
  const { colorList } = useModel('project')
  const [name, setName] = useState<any>('')
  const [normalColor, setNormalColor] = useState<any>('')
  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue(props?.item)
    setNormalColor(props?.item?.color || '#969799')
  }, [props?.item])

  const onConfirm = () => {
    if (!form.getFieldValue('color')) {
      form.setFieldsValue({
        color: '#969799',
      })
    }
    props.onConfirm(form.getFieldsValue())
  }

  const onClose = () => {
    props.onClose()
    setTimeout(() => {
      form.resetFields()
      setName('')
      setNormalColor('#969799')
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
        <Form.Item label="类别名称" name="name">
          <Input
            autoComplete="off"
            maxLength={20}
            placeholder="请输入中英文字符限20个字符"
            allowClear
            onChange={e => setName(e.target.value)}
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
              color={normalColor}
              bgColor={
                colorList?.filter(i => i.key === normalColor)[0]?.bgColor
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
