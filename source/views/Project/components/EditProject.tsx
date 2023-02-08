// 编辑项目信息

/* eslint-disable no-undefined */
/* eslint-disable require-unicode-regexp */
/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Input, Select, message } from 'antd'
import PosterComponent from './PosterComponent'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import CommonModal from '@/components/CommonModal'
import { useDispatch } from '@store/index'
import { setIsRefreshGroup } from '@store/project'
import { addProject, getGroupList, updateProject } from '@/services/project'

interface Props {
  visible: boolean
  onChangeVisible(): void
  details?: any
  onUpdate?(): void
  // 当前选中的项
  activeType?: any
  // 当前选中的分组
  groupId?: any
}

const EditProject = (props: Props) => {
  const [t] = useTranslation()
  const [form] = Form.useForm()
  const [selectGroupList, setSelectGroupList] = useState<any>([])
  const inputRefDom = useRef<HTMLInputElement>(null)
  const dispatch = useDispatch()

  const getGroupData = async () => {
    const result = await getGroupList()
    setSelectGroupList(
      result?.list?.map((i: any) => ({ label: i.name, value: i.id })),
    )
  }

  useEffect(() => {
    if (props.visible) {
      getGroupData()
    }
  }, [props.visible])

  const onConfirm = async () => {
    await form.validateFields()
    try {
      if (props.details?.id) {
        const data = form.getFieldsValue()
        data.id = props.details?.id
        await updateProject(data)
        message.success(t('common.editSuccess'))
      } else {
        if (!form.getFieldValue('isPublic')) {
          form.setFieldsValue({
            isPublic: 2,
          })
        }
        await addProject(form.getFieldsValue())
        message.success(t('common.createSuccess'))
        dispatch(setIsRefreshGroup(true))
      }
      props.onChangeVisible()
      props.onUpdate?.()
    } catch (error) {
      //
    }
  }

  const onChangePoster = (value: string) => {
    form.setFieldsValue({
      cover: value[0],
    })
  }

  useEffect(() => {
    if (props.details?.id) {
      form.setFieldsValue(props?.details)
    } else {
      form.resetFields()
      if (props.activeType === -1) {
        form.setFieldsValue({
          groupIds: [props.groupId],
        })
      }
    }
    setTimeout(() => {
      inputRefDom.current?.focus()
    }, 100)
  }, [props.details])

  return (
    <CommonModal
      title={
        props.details?.id ? t('project.editProject') : t('common.createProject')
      }
      isVisible={props.visible}
      onClose={props.onChangeVisible}
      onConfirm={onConfirm}
    >
      <Form form={form} layout="vertical" style={{ paddingRight: 20 }}>
        <Form.Item
          label={t('project.projectPoster')}
          rules={[{ required: true, message: '' }]}
          name="cover"
        >
          <PosterComponent
            value={props.details?.id ? props.details?.cover : ''}
            onChangeValue={cover => onChangePoster(cover)}
            isVisible={props.visible}
          />
        </Form.Item>
        <Form.Item
          label={t('common.projectName')}
          getValueFromEvent={event => {
            return event.target.value.replace(/(?<start>^\s*)/g, '')
          }}
          rules={[
            { required: true, message: '' },
            {
              message: t('mark.waring'),
            },
          ]}
          name="name"
        >
          <Input
            allowClear
            ref={inputRefDom as any}
            autoComplete="off"
            maxLength={30}
            placeholder={t('common.pleaseProjectName')}
            autoFocus
          />
        </Form.Item>
        <Form.Item
          label={t('project.projectInfo')}
          name="info"
          getValueFromEvent={event => {
            return event.target.value.replace(/(?<start>^\s*)/g, '')
          }}
        >
          <Input.TextArea
            maxLength={500}
            showCount
            placeholder={t('project.pleaseProjectInfo')}
            autoSize={{ minRows: 3, maxRows: 5 }}
          />
        </Form.Item>
        <Form.Item label={t('project.isPublic')} name="isPublic">
          <Select
            placeholder={t('common.pleaseSelect')}
            defaultValue={props.activeType === 1 ? [1] : [2]}
          >
            <Select.Option value={2}>
              {t('common.privateProject')}
            </Select.Option>
            <Select.Option value={1}>{t('project.companyOpen')}</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label={t('version2.projectGroup')} name="groupIds">
          <Select
            placeholder={t('common.pleaseSelect')}
            mode="multiple"
            options={selectGroupList}
            showArrow
            showSearch
            allowClear
            optionFilterProp="label"
          />
        </Form.Item>
      </Form>
    </CommonModal>
  )
}

export default EditProject
