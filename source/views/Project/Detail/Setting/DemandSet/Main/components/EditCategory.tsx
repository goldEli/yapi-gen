/* eslint-disable prefer-regex-literals */
/* eslint-disable require-unicode-regexp */
// 需求设置-编辑需求类别

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/naming-convention */
import CommonModal from '@/components/CommonModal'
import { Input, Form, message } from 'antd'
import styled from '@emotion/styled'
import { useEffect, useRef, useState } from 'react'
import ChooseColor from '../../components/ChooseColor'
import { useSearchParams } from 'react-router-dom'
import { getParamsData } from '@/tools'
import { useTranslation } from 'react-i18next'
import { useSelector } from '@store/index'
import {
  addStoryConfigCategory,
  updateStoryConfigCategory,
} from '@/services/project'

const FormWrap = styled(Form)({
  '.ant-form-item': {
    margin: '22px 0 0 0',
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
    '::before': {
      content: "'#'",
    },
    '::after': {
      content: "'#'",
    },
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

const EditorCategory = (props: EditorProps) => {
  const { colorList } = useSelector(store => store.project)
  const [t] = useTranslation()
  const [name, setName] = useState<any>('')
  const [normalColor, setNormalColor] = useState<any>('#2877FF')
  const [form] = Form.useForm()
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const inputRefDom = useRef<HTMLInputElement>(null)

  useEffect(() => {
    form.setFieldsValue({
      color: '#2877FF',
    })
  }, [props.isVisible])

  useEffect(() => {
    if (props?.item?.id) {
      form.setFieldsValue(props?.item)
      setNormalColor(props?.item?.color)
      setName(props?.item?.name)
    } else {
      form.resetFields()
      form.setFieldsValue({
        color: '#2877FF',
      })
      setName('')
    }
    setTimeout(() => {
      inputRefDom.current?.focus()
    }, 50)
  }, [props?.item])

  const onReset = () => {
    props?.onClose()
    props.onUpdate()
    setTimeout(() => {
      form.resetFields()
      setNormalColor('#2877FF')
      setName('')
    }, 100)
  }

  const onConfirm = async () => {
    await form.validateFields()
    if (!form.getFieldValue('color')) {
      message.warning(t('newlyAdd.pleaseChooseColor'))
      return
    }
    const params = form.getFieldsValue()
    params.projectId = paramsData.id
    params.id = props?.item?.id
    if (props?.item?.id) {
      try {
        await updateStoryConfigCategory(params)
        message.success(t('common.editSuccess'))
        onReset()
      } catch (error) {
        //
      }
    } else {
      try {
        await addStoryConfigCategory(params)
        message.success(t('common.createSuccess'))
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
      setNormalColor('#2877FF')
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
      title={
        props?.item?.id
          ? t('newlyAdd.editCategory')
          : t('newlyAdd.createCategory')
      }
      onClose={onClose}
      onConfirm={onConfirm}
      confirmText={props?.item?.id ? t('common.confirm') : t('newlyAdd.create')}
    >
      <FormWrap
        form={form}
        layout="vertical"
        style={{ padding: '0 16px 0 2px' }}
      >
        <Form.Item
          label={t('newlyAdd.categoryName')}
          name="name"
          rules={[{ required: true, message: '' }]}
          getValueFromEvent={event => {
            // eslint-disable-next-line require-unicode-regexp
            return event.target.value.replace(
              /(?<start>^\s*)|(?<end>\s*$)/g,
              '',
            )
          }}
        >
          <Input
            autoComplete="off"
            ref={inputRefDom as any}
            placeholder={t('newlyAdd.pleaseCategory')}
            allowClear
            maxLength={10}
            onChange={e => setName(e.target.value)}
            autoFocus
          />
        </Form.Item>
        <Form.Item
          label={t('newlyAdd.categoryRemark')}
          getValueFromEvent={event => {
            const reg = new RegExp(/(?<start>^\s*)|(?<end>\s*$)/g)

            return event.target.value.replace(reg, '')
          }}
          name="remark"
        >
          <Input.TextArea
            placeholder={t('newlyAdd.pleaseCategoryRemark')}
            autoSize={{ minRows: 5, maxRows: 5 }}
            maxLength={100}
          />
        </Form.Item>
        <Form.Item label={t('newlyAdd.chooseColor')} name="color">
          <ChooseColor
            color={normalColor}
            onChangeValue={val => onChangeValue(val)}
          />
        </Form.Item>
        <Form.Item label={t('newlyAdd.view')}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <ViewWrap
              color={normalColor || '#969799'}
              bgColor={
                colorList?.filter(
                  (i: any) => i.key === (normalColor || '#969799'),
                )[0]?.bgColor
              }
            >
              {name || t('newlyAdd.nothing')}
            </ViewWrap>
            <span>{t('newlyAdd.viewName')}</span>
          </div>
        </Form.Item>
      </FormWrap>
    </CommonModal>
  )
}

export default EditorCategory
