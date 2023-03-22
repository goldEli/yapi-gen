/* eslint-disable require-unicode-regexp */
import { uploadFileToKey } from '@/services/cos'
import { addIterate, getIterateInfo, updateIterate } from '@/services/iterate'
import {
  getProjectInfo,
  getProjectList,
  getProjectRecent,
} from '@/services/project'
import styled from '@emotion/styled'
import { useDispatch, useSelector } from '@store/index'
import {
  setCreateIterationParams,
  setIsCreateIterationVisible,
  setIsUpdateList,
} from '@store/iterate'
import { Editor, EditorRef } from '@xyfe/uikit'
import { Form, Input, message, Select, Space } from 'antd'
import moment from 'moment'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import CommonModal from '../CommonModal'
import CustomSelect from '../CustomSelect'
import MoreOptions from '../MoreOptions'
import RangePicker from '../RangePicker'

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
  const editorRef = useRef<EditorRef>(null)
  const { isCreateIterationVisible, createIterationParams } = useSelector(
    store => store.iterate,
  )
  const inputRef = useRef<HTMLInputElement>(null)
  const [form] = Form.useForm()
  // 迭代时间
  const [times, setTimes] = useState<any>(null)
  // 项目列表
  const [projectList, setProjectList] = useState<any>([])

  // 获取项目信息
  const getProjectInfoData = async (id: any) => {
    const result = await getProjectInfo({ projectId: id })
    if (
      result?.projectPermissions?.length > 0 &&
      result?.projectPermissions?.filter(
        (i: any) => i.identity === 'b/iterate/store',
      )?.length > 0
    ) {
      form.setFieldsValue({
        projectId: id || null,
      })
    }
  }

  // 获取最近项目列表 -- 使用列表的第一个
  const getRecentlyList = async () => {
    const data = await getProjectRecent()
    getProjectInfoData(data[0]?.id)
  }

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
    if (createIterationParams?.projectId) {
      form.setFieldsValue({
        projectId: createIterationParams?.projectId,
      })
    } else {
      getRecentlyList()
    }
  }

  //   关闭弹窗
  const onCancel = () => {
    form.resetFields()
    setTimes(null)
    dispatch(setIsCreateIterationVisible(false))
    dispatch(
      setCreateIterationParams(
        createIterationParams?.id ? { isUpdate: true } : {},
      ),
    )
  }

  const onConfirm = async () => {
    await form.validateFields()
    const values = form.getFieldsValue()
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
              label={t('optionProject')}
              rules={[{ required: true, message: '' }]}
              name="projectId"
            >
              <CustomSelect
                optionLabelProp="label"
                placeholder={t('common.searchProject')}
                allowClear
                showArrow
                optionFilterProp="label"
                getPopupContainer={(node: any) => node}
                showSearch
                disabled={createIterationParams.id}
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
              </CustomSelect>
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
          <Form.Item name="info" label={t('project.iterateTarget')}>
            <Editor
              ref={editorRef}
              key={Math.random()}
              upload={file => {
                const key = uploadFileToKey(
                  file,
                  file.name,
                  `richEditorFiles_${new Date().getTime()}`,
                  false,
                  data => {
                    editorRef.current?.notifyUploaded(data.key, data.url)
                  },
                )
                return key
              }}
              getSuggestions={() => {
                return new Promise(resolve => {
                  setTimeout(() => {
                    resolve([])
                    // resolve(options)
                  }, 1000)
                })
              }}
            />
          </Form.Item>
        </Form>
      </div>
    </CommonModal>
  )
}

export default CreateIteration
