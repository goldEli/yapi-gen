/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/naming-convention */
import CommonModal from '@/components/CommonModal'
import { Input, Form, Popover, Space } from 'antd'
import styled from '@emotion/styled'
import IconFont from '@/components/IconFont'
import { useEffect, useState } from 'react'

const FormWrap = styled(Form)({
  '.ant-form-item': {
    margin: '24px 0 0 0',
  },
})

const ChooseColorWrap = styled.div<{ color?: string }>(
  {
    width: 80,
    height: 32,
    borderRadius: 6,
    cursor: 'pointer',
  },
  ({ color }) => ({
    background: color ? color : '#969799',
  }),
)

const ColorWrap = styled.div({
  height: 16,
  width: 16,
  borderRadius: 4,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  svg: {
    color: 'white',
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

const colorList = [
  { key: '#43BA9A', bgColor: '#EDF7F4' },
  { key: '#969799', bgColor: '#EBEDF0' },
  { key: '#FA9746', bgColor: '#FCF3EB' },
]

interface ChooseColorProps {
  color?: any
  onChange?(value?: string): void
  onChangeValue?(value?: string): void
}

const ChooseColor = (props: ChooseColorProps) => {
  const [isChooseColor, setIsChooseColor] = useState(false)
  const onChangeColor = (val: string) => {
    props?.onChangeValue?.(val)
    props?.onChange?.(val)
  }
  const colorStatus = (
    <Space
      style={{ display: 'flex', alignItems: 'center', padding: 16 }}
      size={8}
    >
      {colorList.map(i => (
        <ColorWrap
          key={i.key}
          style={{ background: i.key }}
          onClick={() => onChangeColor(i.key)}
        >
          <IconFont hidden={i.key !== props?.color} type="check" />
        </ColorWrap>
      ))}
    </Space>
  )
  const onVisibleChange = (visible: any) => {
    setIsChooseColor(visible)
  }
  return (
    <Popover
      visible={isChooseColor}
      placement="bottom"
      trigger="click"
      content={colorStatus}
      onVisibleChange={onVisibleChange}
    >
      <ChooseColorWrap
        color={props?.color}
        onClick={() => setIsChooseColor(true)}
      />
    </Popover>
  )
}

interface EditorProps {
  isVisible: boolean
  item?: any
  onClose(): void
  onConfirm(data: any): void
}

const EditorCategory = (props: EditorProps) => {
  const [name, setName] = useState('')
  let normalColor: any = props?.item?.color || '#969799'
  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue(props?.item)
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
      normalColor = '#969799'
    }, 100)
  }

  const onChangeValue = (val: string | undefined) => {
    normalColor = val
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
