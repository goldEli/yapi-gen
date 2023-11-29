/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable consistent-return */
/* eslint-disable require-unicode-regexp */
import CommonButton from '@/components/CommonButton'
import CommonModal from '@/components/CommonModal'
import CustomSelect from '@/components/CustomSelect'
import { ModalFooter } from '@/components/StyleCommon'
import { useGetloginInfo } from '@/hooks/useGetloginInfo'
import { getShapeRight } from '@/services/demand'
import {
  DatePicker,
  Divider,
  Form,
  Input,
  Select,
  Tooltip,
  TreeSelect,
} from 'antd'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FormWrap, MyDiv } from '../style'
import Excessive from './Excessive'
import WanderVerify from './Verify'
import { getProjectMember } from '@/services/project'
import { getShapeAffairsRight } from '@/services/affairs'
import { getShapeFlawRight } from '@/services/flaw'
import { getMessage } from '@/components/Message'
import MoreSelect from '@/components/MoreSelect'
import { getProjectIdByUrl } from '@/tools'
import { CodeSandboxCircleFilled } from '@ant-design/icons'

interface StatusModalProps {
  // 弹窗显示状态
  isVisible: boolean
  // 当前选中的状态
  checkStatusItem: Model.Project.CheckStatusItem
  // 关闭弹窗
  onClose(): void
  // 每条数据
  record?: any
  // 修改状态接口
  onChangeStatusConfirm(value: any): any
  /**
   * 1 迭代 2 冲刺（冲刺里是事务）
   */
  // 1-需求，2-事务，3-缺陷
  type?: 1 | 2 | 3
}

const LabelComponent = (props: any) => {
  return (
    <Tooltip title={props.title}>
      <div
        style={{
          overflow: 'Hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          width: 'inherit',
        }}
      >
        {props.title}
      </div>
    </Tooltip>
  )
}
const DateInput = (props: any) => {
  const { onChange: set, type } = props

  const change = (key: any, dates: any) => {
    set(dates)
  }
  useEffect(() => {
    set(props.dvalue)
  }, [])

  if (type === 'datetime') {
    return (
      <DatePicker
        defaultValue={props.dvalue ? moment(props.dvalue) : ('' as any)}
        onChange={change}
        style={{ width: '100%' }}
        format="YYYY-MM-DD HH:mm:ss"
        showTime
      />
    )
  }
  return (
    <DatePicker
      defaultValue={props.dvalue ? moment(props.dvalue) : ('' as any)}
      onChange={change}
      style={{ width: '100%' }}
      format="YYYY-MM-DD"
    />
  )
}
const TagSelect = (props: any) => {
  const [t] = useTranslation()
  const { onChange: set } = props

  const onSelect = (e: any[]) => {
    const newArr = e
      .map((item: any) => {
        return props.options.find((index: { id: any }) => index.id === item)
      })
      .map((i: any) => {
        return {
          id: i.id,
          name: i.name,
          color: i.color,
        }
      })
    set(newArr)
  }
  const init3 = () => {
    const newArr = props.dvalue
      .map((item: any) => {
        return props.options.find((index: { id: any }) => index.id === item)
      })
      .map((i: any) => {
        return {
          id: i.id,
          name: i.name,
          color: i.color,
        }
      })
    set(newArr)
  }

  useEffect(() => {
    init3()
  }, [])

  return (
    <CustomSelect
      defaultValue={props.dvalue}
      onChange={onSelect}
      mode="multiple"
      placeholder={t('common.pleaseSelect')}
      allowClear
      options={props.options?.map((item: any) => ({
        label: item.name,
        value: item.id,
      }))}
      optionFilterProp="label"
    />
  )
}
const NumericInput = (props: any) => {
  console.log('-----', props)
  const [t] = useTranslation()
  const { value, onChange, onPress, type } = props
  const enter = (e: any) => {
    onChange(e)
  }
  if (type === 'integer') {
    return (
      <div
        style={{ border: '1px solid var(--neutral-n5)', borderRadius: '6px' }}
      >
        <Input
          type="number"
          placeholder={t('newlyAdd.pleaseValue')}
          onPressEnter={onPress}
          onChange={e => {
            if (/^\w*$/g.test(e.target.value)) {
              enter(e.target.value)
            }
          }}
          value={value}
          style={{ border: 'none' }}
        />
      </div>
    )
  }
  return (
    <div style={{ border: '1px solid var(--neutral-n5)', borderRadius: '6px' }}>
      <Input
        type="number"
        placeholder={t('newlyAdd.pleaseValue')}
        onPressEnter={onPress}
        onChange={e => enter(e.target.value)}
        value={value}
        style={{ border: 'none' }}
      />
    </div>
  )
}

const StatusModal = (props: StatusModalProps) => {
  const [t] = useTranslation()
  const [configData, setConfigData] = useState<any>({})
  const [reviewerValue, setReviewerValue] = useState('')
  const [optionsList, setOptionsList] = useState([])
  // const [active, setActive] = useState<number>()
  const [form] = Form.useForm()
  const info = useGetloginInfo()

  const setValue = (res: any) => {
    const form1Obj: any = {}
    for (const key in res?.fields) {
      if (
        res?.fields[key].type === 'select' &&
        res?.fields[key].true_value !== 0 &&
        res?.fields[key].true_value !== ''
      ) {
        form1Obj[res?.fields[key].content] = res?.fields[key].children.some(
          (i: any) => i.id === res?.fields[key].true_value,
        )
          ? res?.fields[key].true_value
          : []
      } else if (
        res?.fields[key].type === 'select' &&
        res?.fields[key].true_value === ''
      ) {
        form1Obj[res?.fields[key].content] = null
      } else if (res?.fields[key].true_value === 0) {
        form1Obj[res?.fields[key].content] = null
      } else if (
        res?.fields[key].type === 'select_checkbox' &&
        res?.fields[key].true_value !== 0
      ) {
        form1Obj[res?.fields[key].content] = res?.fields[key].true_value
          ? res?.fields[key].true_value
          : []
      } else if (res?.fields[key].type === 'tree') {
        form1Obj[res?.fields[key].content] = res?.fields[
          key
        ].children[0].children
          .map((f: any) => f.value)
          .includes(res?.fields[key].true_value.content)
          ? res?.fields[key].true_value
          : // eslint-disable-next-line no-undefined
            undefined
      } else {
        form1Obj[res?.fields[key].content] = res?.fields[key].true_value
      }
    }
    return form1Obj
  }

  const valid = () => {
    const str1 = form.getFieldsValue()?.users_name?.join(',')
    const str2 = configData?.originalStatusUserIds?.join(',')

    return str1?.includes(str2)
  }

  const rightList = [
    { key: 1, url: getShapeRight },
    { key: 2, url: getShapeAffairsRight },
    { key: 3, url: getShapeFlawRight },
  ]

  const currentType = rightList.filter((i: any) => i.key === props.type)[0]

  const formatName = (content: any, name: any, id: any) => {
    if (content === 'users_name' && id === info) {
      return `${name} （${t('myself')}）`
    }
    if (configData?.originalStatusUserIds.includes(id)) {
      return `${name}（${t('theOriginalStateHandlesThePerson')}）`
    }
    return name
  }

  const format2 = (i: any, type: any) => {
    const a = i.children?.map((item: any) => ({
      ...item,
      label: formatName(i.content, item.name, item.id),

      value: item.id,
    }))
    const newA = a.filter((j: any) => {
      return j.id === info
    })

    if (type === 1) {
      return newA[0]?.label
    }
    if (type === 2) {
      const newC = a.filter((j: any) => {
        return configData?.originalStatusUserIds.includes(j.id)
      })

      const names = newC.map((k: any) => k.name).join(' ; ')

      return names ? `${names}（${t('theOriginalStateHandlesThePerson')}）` : ''
    }
  }

  const setMyValue = () => {
    const arr = form.getFieldsValue()['users_name']
    const arr2 = configData?.originalStatusUserIds
    form.setFieldsValue({
      users_name: Array.from(new Set([...arr, ...arr2])),
    })
  }

  const setMyValue2 = () => {
    const arr = form.getFieldsValue()['users_name']
    const arr2 = [info]
    form.setFieldsValue({
      users_name: Array.from(new Set([...arr, ...arr2])),
    })
  }

  // 下拉选择审核人员
  const handleChange = (value: string) => {
    setReviewerValue(value)
  }

  // 获取项目成员列表
  const getProjectMemberData = async () => {
    const res2 = await getProjectMember({
      projectId: props.checkStatusItem.projectId,
      all: 1,
    })
    setOptionsList(res2)
  }

  // 获取状态流转配置
  const getConfig = async () => {
    getProjectMemberData()
    // setActive(props.checkStatusItem.id)
    const res = await currentType?.url({
      id: props.checkStatusItem.projectId,
      nId: props.checkStatusItem.infoId,
      fromId: props.checkStatusItem.fromId,
      toId: props.checkStatusItem.id,
    })
    if (
      res.fields?.filter((i: any) =>
        ['expected_start_at', 'expected_end_at'].includes(i.content),
      )
    ) {
      setConfigData({
        ...res,
        fields: res.fields?.map((k: any) => ({
          ...k,
          ...{
            true_value:
              ['expected_start_at', 'expected_end_at'].includes(k.content) &&
              !k.true_value
                ? moment(new Date()).format(
                    k.type === 'datetime'
                      ? 'YYYY-MM-DD HH:mm:ss'
                      : 'YYYY-MM-DD',
                  )
                : k.true_value,
          },
        })),
      })
    } else {
      setConfigData(res)
    }
    form.setFieldsValue(setValue(res))
    console.log('-----', form.getFieldsValue(), setValue(res))
  }

  // 关闭弹窗
  const onClose = () => {
    props.onClose()
    form.resetFields()
    setConfigData({})
  }

  const confirm = async () => {
    const res2 = await form.validateFields()
    const res = JSON.parse(JSON.stringify(res2))
    for (const key in res) {
      if (typeof res[key] === 'undefined') {
        res[key] = null
      }
    }
    await form.validateFields()

    const params = {
      projectId: props?.record?.project_id ?? props?.record?.projectId,
      nId: props?.record?.id,
      toId: props.checkStatusItem.id,
      fields: res,
      verifyId: reviewerValue,
    }

    // 判断两个时间都有值，并且开始时间小于且不等于结束时间时拦截
    if (
      new Set([
        ...new Set(Object.keys(res)),
        ...new Set(['expected_start_at', 'expected_end_at']),
      ])?.size > 0 &&
      res?.expected_start_at &&
      res?.expected_end_at &&
      !moment(res.expected_start_at, 'YYYY-MM-DD HH:mm:ss').isBefore(
        moment(res.expected_end_at, 'YYYY-MM-DD HH:mm:ss'),
      ) &&
      res?.expected_start_at !== res?.expected_end_at
    ) {
      getMessage({
        type: 'warning',
        msg: t('theEstimatedStartTimeCannotBeGreaterThanTheEstimatedEndTime'),
      })
      return
    }
    const a = await props.onChangeStatusConfirm(params)

    if (props.checkStatusItem.onConfirm && a === 'finish') {
      props.checkStatusItem.onConfirm()
    }
    onClose()
  }

  // 提交表单
  const onConfirm = async () => {
    form.submit()
    await confirm()
  }

  useEffect(() => {
    console.log('configData', configData?.fields)
    if (props.isVisible && props.checkStatusItem?.id) {
      getConfig()
    }
  }, [props.isVisible, props.checkStatusItem])

  return (
    <CommonModal
      width={582}
      isVisible={props.isVisible}
      title=""
      onClose={onClose}
      hasFooter={
        <ModalFooter>
          <CommonButton type="light" onClick={onClose}>
            {t('common.cancel')}
          </CommonButton>
          <CommonButton
            type="primary"
            isDisable={!configData?.user_has_auth}
            onClick={onConfirm}
            style={{ marginLeft: '16px' }}
          >
            {configData?.is_verify
              ? t('newlyAdd.submitReview')
              : t('common.circulation')}
          </CommonButton>
        </ModalFooter>
      }
    >
      <div style={{ paddingRight: 4 }}>
        <Excessive checkStatusItem={props.checkStatusItem} />
        <FormWrap>
          <Form
            labelAlign="left"
            form={form}
            layout="vertical"
            onFinish={confirm}
            onFinishFailed={() => {
              setTimeout(() => {
                const errorList = (document as any).querySelectorAll(
                  '.ant-form-item-has-error',
                )

                errorList[0]?.scrollIntoView({
                  block: 'center',
                  behavior: 'smooth',
                })
              }, 100)
            }}
          >
            {configData?.fields?.map((i: any) => (
              <div key={i.content}>
                {i.type === 'area' && (
                  <Form.Item
                    label={<LabelComponent title={i.title} />}
                    name={i.content}
                    rules={[
                      {
                        required: i.is_must === 1,
                        message: '',
                      },
                    ]}
                    style={{ marginTop: 2 }}
                  >
                    <Input.TextArea
                      maxLength={200}
                      style={{
                        maxHeight: '132px',
                        minHeight: '132px',
                      }}
                      placeholder={t('project.pleaseComment')}
                    />
                  </Form.Item>
                )}
                {i.type === 'single_checkbox' && (
                  <Form.Item
                    label={<LabelComponent title={i.title} />}
                    name={i.content}
                    rules={[
                      {
                        required: i.is_must === 1,
                        message: '',
                      },
                    ]}
                    style={{ marginTop: 2 }}
                  >
                    <CustomSelect
                      placeholder={t('common.pleaseSelect')}
                      showSearch
                      showArrow
                      optionFilterProp="label"
                      getPopupContainer={(node: any) => node}
                      allowClear
                    >
                      <Select.Option value={0}>{t('untick')}</Select.Option>
                      <Select.Option value={1}>{t('check')}</Select.Option>
                    </CustomSelect>
                  </Form.Item>
                )}

                {['select', 'radio'].includes(i.type) && (
                  <Form.Item
                    initialValue={i.true_value === 0 ? '' : i.true_value}
                    label={<LabelComponent title={i.title} />}
                    name={i.content}
                    rules={[
                      {
                        required: i.is_must === 1,
                        message: '',
                      },
                    ]}
                  >
                    <CustomSelect
                      placeholder={t('common.pleaseSelect')}
                      allowClear
                      options={i.children?.map((item: any) => ({
                        label: item.name,
                        value: item.id,
                      }))}
                      optionFilterProp="label"
                    />
                  </Form.Item>
                )}
                {['select_checkbox', 'checkbox'].includes(i.type) &&
                  i.content === 'users_name' && (
                    <Form.Item
                      label={<LabelComponent title={i.title} />}
                      name={i.content}
                      rules={[
                        {
                          required: i.is_must === 1,
                          message: '',
                        },
                      ]}
                    >
                      <CustomSelect
                        mode="multiple"
                        placeholder={t('common.pleaseSelect')}
                        allowClear
                        optionFilterProp="label"
                      >
                        {i.children.map((item: any) => {
                          return (
                            <Select.Option
                              key={item.id}
                              value={item.id}
                              label={item.name}
                              className={
                                item.status === 2 && item.isFirst
                                  ? 'removeStyle'
                                  : ''
                              }
                              disabled={item.status === 2}
                            >
                              {item.name ?? item.content}
                              <span>
                                {item.status === 1 ? '' : t('removed')}
                              </span>
                            </Select.Option>
                          )
                        })}
                      </CustomSelect>
                    </Form.Item>
                  )}
                {['select_checkbox', 'checkbox'].includes(i.type) &&
                  i.content !== 'users_name' && (
                    <Form.Item
                      label={<LabelComponent title={i.title} />}
                      name={i.content}
                      rules={[
                        {
                          required: i.is_must === 1,
                          message: '',
                        },
                      ]}
                    >
                      <CustomSelect
                        mode="multiple"
                        placeholder={t('common.pleaseSelect')}
                        allowClear
                        options={i.children?.map((item: any) => ({
                          label: item.name,
                          value: item.id,
                        }))}
                        optionFilterProp="name"
                      />
                    </Form.Item>
                  )}
                {['date', 'time', 'datetime'].includes(i.type) && (
                  <Form.Item
                    label={<LabelComponent title={i.title} />}
                    name={i.content}
                    rules={[
                      {
                        required: i.is_must === 1,
                        message: '',
                      },
                    ]}
                  >
                    <DateInput type={i.type} dvalue={i.true_value} />
                  </Form.Item>
                )}
                {i.type === 'tag' && (
                  <Form.Item
                    label={<LabelComponent title={i.title} />}
                    name={i.content}
                    rules={[
                      {
                        required: i.is_must === 1,
                        message: '',
                      },
                    ]}
                  >
                    <TagSelect dvalue={i.true_value} options={i.children} />
                  </Form.Item>
                )}
                {i.type === 'number' && (
                  <Form.Item
                    label={<LabelComponent title={i.title} />}
                    name={i.content}
                    rules={[
                      {
                        required: i.is_must === 1,
                        message: '',
                      },
                    ]}
                  >
                    <NumericInput type={i.value ? i.value[0] : ''} />
                  </Form.Item>
                )}
                {i.type === 'tree' && (
                  <Form.Item
                    label={<LabelComponent title={i.title} />}
                    name={i.content}
                    rules={[
                      {
                        required: i.is_must === 1,
                        message: '',
                      },
                    ]}
                  >
                    <TreeSelect
                      style={{ width: '100%', border: 'none' }}
                      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                      treeData={i.children[0].children}
                      placeholder={t('common.pleaseSelect')}
                      treeDefaultExpandAll
                    />
                  </Form.Item>
                )}
                {['text', 'textarea'].includes(i.type) && (
                  <Form.Item
                    getValueFromEvent={event => {
                      return event.target.value.replace(/(?<start>^\s*)/g, '')
                    }}
                    label={<LabelComponent title={i.title} />}
                    name={i.content}
                    rules={[
                      {
                        required: i.is_must === 1,
                        message: '',
                      },
                    ]}
                  >
                    <Input placeholder={i.remarks} />
                  </Form.Item>
                )}
              </div>
            ))}
            {configData?.is_verify && configData?.verify.verify_type === 2 ? (
              <Form.Item
                labelAlign="left"
                label={t('newlyAdd.reviewPerson')}
                name="reviewerValue"
                rules={[
                  {
                    // required: activeContent || (!activeContent && !hasDealName),
                    required: true,
                    message: '',
                  },
                ]}
              >
                <CustomSelect
                  onChange={handleChange}
                  placeholder={t('common.pleaseSelect')}
                  allowClear
                  getPopupContainer={(node: any) => node}
                  options={optionsList?.map((item: any) => ({
                    label: item.name,
                    value: item.id,
                  }))}
                  optionFilterProp="label"
                />
              </Form.Item>
            ) : null}
          </Form>
          <WanderVerify
            configData={configData}
            checkStatusItem={props.checkStatusItem}
          />
        </FormWrap>
      </div>
    </CommonModal>
  )
}

export default StatusModal
