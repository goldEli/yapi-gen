/* eslint-disable require-unicode-regexp */
import { addIterate, getIterateInfo, updateIterate } from '@/services/iterate'
import { getProjectList } from '@/services/project'
import styled from '@emotion/styled'
import { useDispatch, useSelector } from '@store/index'
import {
  setCreateIterationParams,
  setIsCreateIterationVisible,
  setIsUpdateList,
} from '@store/iterate'
import { Form, Input, message, Select, Space } from 'antd'
import moment from 'moment'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import CommonModal from '../CommonModal'
import MoreOptions from '../MoreOptions'
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
  // 项目列表
  const [projectList, setProjectList] = useState<any>([])
  const [html, setHtml] = useState('')

  // 获取项目列表
  const getProjectData = async () => {
    const res = await getProjectList({
      self: 1,
      all: 1,
    })
    setProjectList(res.list)
    // 如果有需求id则获取详情
    if (createIterationParams.id) {
      const response = await getIterateInfo({
        projectId: createIterationParams.projectId,
        id: createIterationParams?.id,
      })
      setHtml(response?.info)
      setTimes([
        moment(response.createdTime || response?.startTime || 0),
        moment(response.endTime || 1893427200),
      ])
      form.setFieldsValue({
        info: response?.info,
        iterationName: response.name,
        time: response.endTime
          ? [
              moment(response.createdTime || response?.startTime || 0),
              moment(response.endTime || 1893427200),
            ]
          : null,
      })
    }
    form.setFieldsValue({
      projectId: createIterationParams?.projectId || null,
    })
  }

  //   关闭弹窗
  const onCancel = () => {
    form.resetFields()
    setTimes(null)
    setHtml('')
    dispatch(setIsCreateIterationVisible(false))
    dispatch(setCreateIterationParams({}))
  }

  const onConfirm = async () => {
    await form.validateFields()
    const values = form.getFieldsValue()
    values.info = html
    if (createIterationParams?.id) {
      await updateIterate({
        projectId: createIterationParams?.projectId,
        id: createIterationParams?.id,
        ...values,
      })
      message.success(t('common.editSuccess'))
    } else {
      await addIterate({
        projectId: createIterationParams?.projectId,
        ...values,
      })
      message.success(t('common.createSuccess'))
    }
    onCancel()
    dispatch(setIsUpdateList(true))
    dispatch(setCreateIterationParams({ isUpdate: true }))
    setTimeout(() => {
      form.resetFields()
    }, 100)
  }

  const onChangePicker = (values: any) => {
    setTimes(values)
    form.setFieldsValue({
      time: values,
    })
  }

  useEffect(() => {
    if (isCreateIterationVisible) {
      getProjectData()
    }
  }, [isCreateIterationVisible])

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
              <Select
                optionLabelProp="label"
                placeholder={t('common.searchProject')}
                allowClear
                showArrow
                optionFilterProp="label"
                getPopupContainer={node => node}
                showSearch
              >
                {projectList
                  ?.filter((i: any) => i.status === 1)
                  ?.map((i: any) => {
                    return (
                      <Select.Option value={i.id} key={i.id} label={i.name}>
                        <MoreOptions
                          type="project"
                          name={i.name}
                          dec={i.dec}
                          img={i.cover}
                        />
                      </Select.Option>
                    )
                  })}
              </Select>
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
            <RichEditor value={html} />
          </Form.Item>
        </Form>
      </div>
    </CommonModal>
  )
}

export default CreateIteration
