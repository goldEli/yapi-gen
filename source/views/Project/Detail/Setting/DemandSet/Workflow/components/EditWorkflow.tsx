/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/naming-convention */
import CommonModal from '@/components/CommonModal'
import { Input, Form, Switch, Space } from 'antd'
import styled from '@emotion/styled'
import { useEffect, useState } from 'react'
import ChooseColor from '../../components/ChooseColor'
import { useModel } from '@/models'
import { ViewWrap } from '@/components/StyleCommon'

const FormWrap = styled(Form)({
  '.ant-form-item': {
    margin: '24px 0 0 0',
  },
})

const CategoryWrap = styled.div<{ color: string; bgColor: string }>(
  {
    height: 22,
    borderRadius: 11,
    padding: '0 8px',
    marginRight: 8,
    lineHeight: '22px',
    fontSize: 12,
    fontWeight: 400,
    marginLeft: 8,
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
  category?: any[]
}

const EditWorkflow = (props: EditorProps) => {
  const [form] = Form.useForm()
  const [name, setName] = useState('')
  const [normalColor, setNormalColor] = useState<any>('')
  const { colorList } = useModel('project')

  useEffect(() => {
    setNormalColor(props?.item?.color)
    setName(props?.item?.name)
    form.setFieldsValue(props?.item)
  }, [props?.item])

  const onConfirm = () => {

    // console.log(form.getFieldsValue(), 'form.getFieldsValue()')
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
      title="编辑状态"
      onClose={onClose}
      onConfirm={onConfirm}
      confirmText="创建"
    >
      <div style={{ color: '#323233', fontSize: 14 }}>
        该状态已存在于需求类别中
      </div>
      <Space
        size={8}
        style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}
      >
        {props?.category?.map(i => (
          <CategoryWrap
            style={{ margin: 0, marginTop: 8 }}
            color={i.color}
            bgColor={colorList?.filter(k => k.key === i.color)[0]?.bgColor}
            key={i.id}
          >
            {i.name}
          </CategoryWrap>
        ))}
      </Space>
      <FormWrap form={form} layout="vertical">
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Form.Item label="状态名称" name="name">
            <Input
              autoComplete="off"
              maxLength={20}
              placeholder="请输入状态名称"
              allowClear
              onChange={e => setName(e.target.value)}
            />
          </Form.Item>
          <span style={{ marginTop: 4, fontSize: 12, color: '#969799' }}>
            状态名称是显示在页面上的名字，最多输入28个字符。
          </span>
        </div>
        <Form.Item label="状态说明" name="remark">
          <Input.TextArea
            autoSize={{ minRows: 5, maxRows: 5 }}
            placeholder="请输入状态说明"
            maxLength={200}
          />
        </Form.Item>
        <Form.Item label="选择颜色" name="color">
          <ChooseColor
            color={normalColor}
            onChangeValue={val => onChangeValue(val)}
          />
        </Form.Item>
        <Form.Item label="状态预览">
          <ViewWrap color={normalColor}>{name || '无'}</ViewWrap>
        </Form.Item>
        <Form.Item label="结束状态" name="endStatus">
          <Switch
            checkedChildren="是"
            unCheckedChildren="否"
            defaultChecked={props?.item?.endStatus}
          />
        </Form.Item>
      </FormWrap>
    </CommonModal>
  )
}

export default EditWorkflow
