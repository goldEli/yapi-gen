/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/naming-convention */
import CommonModal from '@/components/CommonModal'
import { Input, Form, Switch, Space, message } from 'antd'
import styled from '@emotion/styled'
import { useEffect, useState } from 'react'
import ChooseColor from '../../components/ChooseColor'
import { useModel } from '@/models'
import { ViewWrap } from '@/components/StyleCommon'
import { useSearchParams } from 'react-router-dom'
import { getParamsData } from '@/tools'

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
  onUpdate(): void
}

const EditWorkflow = (props: EditorProps) => {
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const [form] = Form.useForm()
  const [status, setStatus] = useState(false)
  const [name, setName] = useState('')
  const [normalColor, setNormalColor] = useState<any>('')
  const { colorList, updateStoryConfigWorkflow } = useModel('project')

  useEffect(() => {
    setNormalColor(props?.item?.color)
    setName(props?.item?.name)
    form.setFieldsValue(props?.item)
    setStatus(form.getFieldValue('endStatus'))
  }, [props?.item])

  const onConfirm = async () => {
    await form.validateFields()
    const params = form.getFieldsValue()
    params.projectId = paramsData.id
    params.id = props?.item?.id
    params.endStatus = status ? 1 : 2

    try {
      await updateStoryConfigWorkflow(params)
      message.success('编辑成功')
      props?.onClose()
      props?.onUpdate()
      setTimeout(() => {
        form.resetFields()
      }, 100)
    } catch (error) {

      //
    }
  }

  const onClose = () => {
    props.onClose()
    setTimeout(() => {
      form.resetFields()
      setName('')
      setNormalColor('')
      setStatus(false)
    }, 100)
  }

  const onChangeValue = (val: string | undefined) => {
    setNormalColor(val)
    form.setFieldsValue({
      color: val,
    })
  }

  const onChangeStatus = (checked: any) => {
    if (props?.item?.startStatus && checked) {
      message.warning('起始状态与结束状态不能同时存在')
      return
    }
    setStatus(checked)
  }

  return (
    <CommonModal
      isVisible={props.isVisible}
      title="编辑状态"
      onClose={onClose}
      onConfirm={onConfirm}
    >
      <div style={{ maxHeight: 464, overflowY: 'auto', paddingRight: 20 }}>
        {props?.item?.categorys?.length && (
          <>
            <div style={{ color: '#323233', fontSize: 14 }}>
              该状态已存在于需求类别中
            </div>
            <Space
              size={8}
              style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
              }}
            >
              {props?.item?.categorys?.map((i: any) => (
                <CategoryWrap
                  style={{ margin: 0, marginTop: 8 }}
                  color={i.color}
                  bgColor={
                    colorList?.filter(k => k.key === i.color)[0]?.bgColor
                  }
                  key={i.id}
                >
                  {i.name}
                </CategoryWrap>
              ))}
            </Space>
          </>
        )}
        <FormWrap form={form} layout="vertical">
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Form.Item label="状态名称" name="name">
              <Input
                autoComplete="off"
                maxLength={10}
                placeholder="请输入状态名称"
                allowClear
                onChange={e => setName(e.target.value)}
              />
            </Form.Item>
            <span style={{ marginTop: 4, fontSize: 12, color: '#969799' }}>
              状态名称是显示在页面上的名字，最多输入10个字。
            </span>
          </div>
          <Form.Item label="状态说明" name="info">
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
              checked={status}
              onChange={checked => onChangeStatus(checked)}
            />
          </Form.Item>
        </FormWrap>
      </div>
    </CommonModal>
  )
}

export default EditWorkflow
