/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable consistent-return */
/* eslint-disable require-unicode-regexp */
import CommonButton from '@/components/CommonButton'
import CommonModal from '@/components/CommonModal'
import CustomSelect from '@/components/CustomSelect'
import { ModalFooter } from '@/components/StyleCommon'
import { useGetloginInfo } from '@/hooks/useGetloginInfo'
import { getShapeRight, flowDate } from '@/services/demand'
import {
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  Select,
  Tooltip,
  TreeSelect,
} from 'antd'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FormWrap, MyDiv, StatusTitle } from '../style'
import Excessive from './Excessive'
import WanderVerify from './Verify'
import { getProjectMember } from '@/services/project'
import { getShapeAffairsRight } from '@/services/affairs'
import { getShapeFlawRight } from '@/services/flaw'
import { getMessage } from '@/components/Message'
import { copyLink } from '@/tools'
import CommonIconFont from '@/components/CommonIconFont'
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
  const change = async (key: any, dates: any) => {
    const params = {
      project_id: props.record?.project_id,
      story_id: props.record?.id,
      [props.id]: dates,
    }
    set(dates)
    const res = await flowDate(params)
    props.onChangeCb(res, props.id)
  }
  useEffect(() => {
    set(props.dvalue)
  }, [])

  if (type === 'datetime') {
    return (
      <DatePicker
        value={props.value ? moment(props.value) : moment(props.dvalue)}
        onChange={change}
        style={{ width: '100%' }}
        format="YYYY-MM-DD HH:mm:ss"
        showTime={{
          defaultValue: moment('00:00:00', 'HH:mm:ss'),
        }}
      />
    )
  }
  return (
    <DatePicker
      value={props.value ? moment(props.value) : moment(props.dvalue)}
      onChange={change}
      style={{ width: '100%' }}
      format="YYYY-MM-DD "
      showTime={{
        defaultValue: moment('00:00:00', 'HH:mm:ss'),
      }}
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
    const value = Array.isArray(props.dvalue) ? props.dvalue : []
    const newArr = value
      ?.map((item: any) => {
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
      value={props.dvalue}
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
  const [statusData, setStatusData] = useState({})
  const setValue = (res: any) => {
    const form1Obj: any = {}
    for (const key in res?.fields) {
      if (
        (res?.fields[key].type === 'select' ||
          res?.fields[key].type === 'tag') &&
        res?.fields[key].true_value !== 0 &&
        res?.fields[key].true_value !== ''
      ) {
        form1Obj[res?.fields[key].content] = res?.fields[key].children?.some(
          (i: any) =>
            i.id ===
            (res?.fields[key].true_value?.content ??
              res?.fields[key].true_value),
        )
          ? res?.fields[key].true_value?.content ?? res?.fields[key].true_value
          : []
      } else if (
        (res?.fields[key].type === 'select' ||
          res?.fields[key].type === 'tag') &&
        res?.fields[key].true_value === ''
      ) {
        form1Obj[res?.fields[key].content] = []
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
    // console.log({
    //   ...res,
    //   fields: res.fields?.map((k: any) => ({
    //     ...k,
    //     ...{
    //       true_value:
    //         ['expected_start_at', 'expected_end_at'].includes(k.content) &&
    //         !k.true_value
    //           ? moment(new Date()).format(
    //               k.type === 'datetime' ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD',
    //             )
    //           : k.true_value,
    //     },
    //   })),
    // })
    form.setFieldsValue(setValue(res))
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
    setStatusData(props.record)
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
        <StatusTitle>
          <img src={props.record?.category_attachment}></img>
          {props.record?.name}【{props.record?.storyPrefixKey}】
          <CommonIconFont
            type="copy"
            onClick={() => {
              const text = `${props.record?.name}【${props.record?.storyPrefixKey}】`
              copyLink(text, '复制成功', t('common.copyFail'))
            }}
          ></CommonIconFont>
        </StatusTitle>
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
                    initialValue={i.true_value}
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
                {/* 勾选值未验证 */}
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
                    initialValue={
                      i.true_value === 0
                        ? ''
                        : i.true_value?.content ?? i.true_value
                    }
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
                      initialValue={
                        i.true_value === 0
                          ? ''
                          : i.true_value?.content ?? i.true_value
                      }
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
                      initialValue={
                        i.true_value === 0
                          ? ''
                          : i.true_value?.content ?? i.true_value
                      }
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
                        value={i.true_value?.title ?? i.true_value}
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
                    <DateInput
                      type={i.type}
                      dvalue={i.true_value}
                      record={props.record}
                      onChangeCb={(res: any, type: any) => {
                        setConfigData((pre: any) => {
                          const { fields } = pre
                          if (type === 'expected_start_at') {
                            fields.find(
                              (item: any) => item.content === 'expected_end_at',
                            ).true_value = res.end_date
                            fields.find(
                              (item: any) =>
                                item.content === 'expected_start_at',
                            ).true_value = res.start_date
                          }
                          if (type === 'expected_end_at') {
                            fields.find(
                              (item: any) =>
                                item.content === 'expected_start_at',
                            ).true_value = res.start_date
                            fields.find(
                              (item: any) => item.content === 'expected_end_at',
                            ).true_value = res.end_date
                          }
                          setTimeout(() => {
                            form.setFieldsValue(setValue(pre))
                          })
                          console.log('pre----', pre, setValue(pre))
                          return pre
                        })
                      }}
                    />
                  </Form.Item>
                )}
                {i.type === 'tag' && (
                  <Form.Item
                    initialValue={
                      i.true_value?.title ?? Array.isArray(i.true_value)
                        ? i.true_value
                        : []
                    }
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
                {i.type === 'number' && (
                  <Form.Item
                    initialValue={i.true_value}
                    label={<LabelComponent title={i.title} />}
                    name={i.content}
                    rules={[
                      {
                        required: i.is_must === 1,
                        message: '',
                      },
                    ]}
                  >
                    {i.content === 'work_hours' ? (
                      <InputNumber
                        placeholder={t('common.pleaseEnter')}
                        autoComplete="off"
                        style={{ width: '100%' }}
                        min={1}
                        precision={1}
                        disabled={i.is_readOnly === 1}
                      />
                    ) : (
                      <NumericInput type={i.value ? i.value[0] : ''} />
                    )}
                  </Form.Item>
                )}
                {/* 分类值未验证 */}
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
                    initialValue={i.true_value}
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
