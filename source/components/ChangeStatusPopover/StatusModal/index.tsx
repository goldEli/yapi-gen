/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable consistent-return */
/* eslint-disable require-unicode-regexp */
import CommonButton from '@/components/CommonButton'
import CommonModal from '@/components/CommonModal'
import CustomSelect from '@/components/CustomSelect'
import { ModalFooter } from '@/components/StyleCommon'
import { useGetloginInfo } from '@/hooks/useGetloginInfo'
import { getShapeRight } from '@/services/demand'
import { DatePicker, Divider, Form, Input, Tooltip, TreeSelect } from 'antd'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FormWrap, MyDiv } from '../style'
import Excessive from './Excessive'
import WanderVerify from './Verify'

interface StatusModalProps {
  isVisible: boolean
  checkStatusItem: any
  onClose(): void
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
        showTime={{
          defaultValue: moment('00:00:00', 'HH:mm:ss'),
        }}
      />
    )
  }
  return (
    <DatePicker
      defaultValue={props.dvalue ? moment(props.dvalue) : ('' as any)}
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
  const [active, setActive] = useState()
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
      } else {
        form1Obj[res?.fields[key].content] = res?.fields[key].true_value
      }
    }
    return form1Obj
  }

  const activeContent =
    props.checkStatusItem.canChange?.filter((i: any) => i.id === active)[0]
      ?.content !== '规划中'
  const hasDealName = props.checkStatusItem?.dealName === '--'

  const valid = () => {
    const str1 = form.getFieldsValue()?.users_name?.join(',')
    const str2 = configData?.originalStatusUserIds?.join(',')

    return str1?.includes(str2)
  }

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

  // 获取状态流转配置
  const getConfig = async () => {
    setActive(props.checkStatusItem.id)
    const res = await getShapeRight({
      id: props.checkStatusItem.projectId,
      nId: props.checkStatusItem.infoId,
      fromId: props.checkStatusItem.id,
      toId: props.checkStatusItem.id ?? props.checkStatusItem.statusId,
    })
    setConfigData(res)
    form.setFieldsValue(setValue(res))
  }

  // 关闭弹窗
  const onClose = () => {
    props.onClose()
    form.resetFields()
    setConfigData({})
  }

  // 提交表单
  const onConfirm = () => {
    //
  }

  useEffect(() => {
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
            isDisable={!configData.user_has_auth}
            onClick={onConfirm}
            style={{ marginLeft: '16px' }}
          >
            {configData.is_verify
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
                        dropdownRender={(menu: any) => {
                          return (
                            <div
                              style={{
                                padding: '8px ',
                              }}
                            >
                              {format2(i, 2) && (
                                <MyDiv
                                  show={valid() as unknown as boolean}
                                  onClick={setMyValue}
                                >
                                  {format2(i, 2)}
                                </MyDiv>
                              )}

                              <MyDiv
                                show={form
                                  .getFieldsValue()
                                  ?.users_name?.includes(info)}
                                onClick={setMyValue2}
                              >
                                {format2(i, 1)}
                              </MyDiv>
                              <Divider style={{ margin: '8px 0' }} />
                              {menu}
                            </div>
                          )
                        }}
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
                    <NumericInput type={i.value[0]} />
                  </Form.Item>
                )}
                {i.type === 'tree' && (
                  <Form.Item
                    initialValue={i.true_value ?? []}
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
            {configData.is_verify && configData.verify.verify_type === 2 ? (
              <Form.Item
                labelAlign="left"
                label={t('newlyAdd.reviewPerson')}
                name="reviewerValue"
                rules={[
                  {
                    required: activeContent || (!activeContent && !hasDealName),
                    message: '',
                  },
                ]}
              >
                <CustomSelect
                  // onChange={handleChange}
                  placeholder={t('common.pleaseSelect')}
                  allowClear
                  getPopupContainer={(node: any) => node}
                  // options={optionsList?.map((item: any) => ({
                  //   label: item.name,
                  //   value: item.id,
                  // }))}
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