/* eslint-disable prefer-regex-literals */
/* eslint-disable require-unicode-regexp */
// 需求设置-编辑需求类别
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable camelcase */
import CommonModal from '@/components/CommonModal'
import { Input, Form, message } from 'antd'
import styled from '@emotion/styled'
import { useEffect, useRef, useState } from 'react'
import ChooseColor from './ChooseColor'
import { getParamsData } from '@/tools'
import { useTranslation } from 'react-i18next'
import { getCategoryIconList } from '@/services/demand'
import {
  addStoryConfigCategory,
  updateStoryConfigCategory,
} from '@/services/project'
import { useSearchParams } from 'react-router-dom'

const FormWrap = styled(Form)({
  '.ant-form-item': {
    margin: '22px 0 0 0',
  },
  marginLeft: '24px',
})

const ViewWrap = styled.div<{ color: string }>(
  {
    height: 22,
    borderRadius: 11,
    padding: '0px',
    marginRight: 8,
    lineHeight: '22px',
    fontSize: 12,
    fontWeight: 400,
  },
  // ({ color, bgColor }) => ({
  //   background: bgColor,
  //   color,
  // }),
)

interface EditorProps {
  isVisible: boolean
  type?: string
  item?: any
  onClose(): void
  onUpdate(): void
}

const EditorCategory = (props: EditorProps) => {
  const [t] = useTranslation()
  const [name, setName] = useState<any>('')
  const [path, setPath] = useState<any>('')
  const [form] = Form.useForm()
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const inputRefDom = useRef<HTMLInputElement>(null)
  const [colorList, setColorList] = useState<any>()
  const getIconList = async () => {
    const list: any = await getCategoryIconList()
    setColorList(list.data)
    if (props?.item) {
      setPath(props?.item?.attachmentPath)
    } else {
      setPath(list.data[0].path)
    }
    form.setFieldsValue({
      color: list.data[0].path,
    })
  }
  useEffect(() => {
    if (props?.type === 'edit' && props.isVisible) {
      getIconList()
      form.setFieldsValue(props?.item)
      setPath(props?.item?.path)
      setName(props?.item?.name)
    } else if (!props?.type && props.isVisible) {
      getIconList()
    }
  }, [props.isVisible])

  const onReset = () => {
    props?.onClose()
    props.onUpdate()
    setTimeout(() => {
      form.resetFields()
      setPath('')
      setName('')
    }, 100)
  }

  const onConfirm = async (props: any) => {
    await form.validateFields()
    if (!form.getFieldValue('color')) {
      message.warning(t('newlyAdd.pleaseChooseColor'))
      return
    }
    const params = form.getFieldsValue()
    params.projectId = paramsData.id
    params.id = props?.item?.id
    const attachment_id = colorList.find((item: any) => item.path === path).id
    params.attachment_id = attachment_id
    if (props?.type === 'edit') {
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
      setPath('')
    }, 100)
  }

  const onChangeValue = (val: { id: number; path: string }) => {
    setPath(val.path)
  }

  return (
    <CommonModal
      isVisible={props.isVisible}
      title={
        props?.type === 'edit'
          ? t('newlyAdd.editCategory')
          : t('newlyAdd.createCategory')
      }
      onClose={onClose}
      onUpdate={props.onUpdate}
      onConfirm={() => onConfirm(props)}
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
            return event.target.value.replace(/(?<start>^\s*)/g, '')
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
            const reg = new RegExp(/(?<start>^\s*)/g)

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
        <Form.Item label={t('newlyAdd.chooseIcon')} name="attachment_id">
          <ChooseColor
            color={path}
            colorList={colorList}
            onChangeValue={(val: any) => onChangeValue(val)}
          />
        </Form.Item>
        <Form.Item label={t('newlyAdd.view')}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <ViewWrap
              color={path || '#969799'}
              // bgColor={
              //   colorList?.filter((i: any) => i.key === (path || '#969799'))[0]
              //     ?.bgColor
              // }
            >
              {/* {name || t('newlyAdd.nothing')} */}
              {path && <img src={path} style={{ width: '20px' }} />}
            </ViewWrap>
            <span>{t('newlyAdd.viewName')}</span>
          </div>
        </Form.Item>
      </FormWrap>
    </CommonModal>
  )
}

export default EditorCategory
