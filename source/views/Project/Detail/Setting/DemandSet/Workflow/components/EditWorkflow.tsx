/* eslint-disable require-unicode-regexp */
// 需求设置-编辑工作流弹窗

/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/naming-convention */
import CommonModal from '@/components/CommonModal'
import { Input, Form, Switch, Space, message } from 'antd'
import styled from '@emotion/styled'
import { useEffect, useState } from 'react'
import ChooseColor from '../../components/ChooseColor'
import { ViewWrap, CategoryWrap } from '@/components/StyleCommon'
import { useSearchParams } from 'react-router-dom'
import { getParamsData } from '@/tools'
import { useTranslation } from 'react-i18next'
import { useSelector } from '@store/index'
import { updateStoryConfigWorkflow } from '@/services/project'

const FormWrap = styled(Form)({
  '.ant-form-item': {
    margin: '22px 0 0 0',
  },
})

interface EditorProps {
  isVisible: boolean
  item?: any
  onClose(): void
  onUpdate(): void
}

const EditWorkflow = (props: EditorProps) => {
  const [t] = useTranslation()
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const [form] = Form.useForm()
  const [status, setStatus] = useState(false)
  const [name, setName] = useState('')
  const [normalColor, setNormalColor] = useState<any>('#2877FF')
  const { colorList } = useSelector((store: { project: any }) => store.project)

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
      message.success(t('common.editSuccess'))
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
      setNormalColor('#2877FF')
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
      message.warning(t('newlyAdd.startStatusNoEnd'))
      return
    }
    setStatus(checked)
  }

  return (
    <CommonModal
      isVisible={props.isVisible}
      title={t('newlyAdd.editStatus')}
      onClose={onClose}
      onConfirm={onConfirm}
    >
      <div
        style={{ maxHeight: 464, overflowY: 'auto', padding: '0 16px 0 2px' }}
      >
        {props?.item?.categorys?.length && (
          <>
            <div style={{ color: '#323233', fontSize: 14 }}>
              {t('newlyAdd.existenceCategory')}
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
                    colorList?.filter((k: any) => k.key === i.color)[0]?.bgColor
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
            <Form.Item
              getValueFromEvent={event => {
                return event.target.value.replace(
                  /(?<start>^\s*)|(?<end>\s*$)/g,
                  '',
                )
              }}
              label={t('newlyAdd.statusName')}
              name="name"
            >
              <Input
                autoComplete="off"
                maxLength={10}
                placeholder={t('newlyAdd.pleaseStatusName')}
                allowClear
                onChange={e => setName(e.target.value)}
              />
            </Form.Item>
            <span style={{ marginTop: 4, fontSize: 12, color: '#969799' }}>
              {t('newlyAdd.pleaseStatusNameMax')}
            </span>
          </div>
          <Form.Item
            getValueFromEvent={event => {
              // eslint-disable-next-line require-unicode-regexp
              return event.target.value.replace(
                /(?<start>^\s*)|(?<end>\s*$)/g,
                '',
              )
            }}
            label={t('newlyAdd.statusRemark')}
            name="info"
          >
            <Input.TextArea
              autoSize={{ minRows: 5, maxRows: 5 }}
              placeholder={t('newlyAdd.pleaseStatusRemark')}
              maxLength={100}
            />
          </Form.Item>
          <Form.Item label={t('newlyAdd.chooseColor')} name="color">
            <ChooseColor
              color={normalColor}
              onChangeValue={val => onChangeValue(val)}
            />
          </Form.Item>
          <Form.Item label={t('newlyAdd.statusView')}>
            <ViewWrap color={normalColor}>
              {name || t('newlyAdd.nothing')}
            </ViewWrap>
          </Form.Item>
          <Form.Item label={t('newlyAdd.endStatus')} name="endStatus">
            <Switch
              checkedChildren={t('newlyAdd.yes')}
              unCheckedChildren={t('newlyAdd.no')}
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
