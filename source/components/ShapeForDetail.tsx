/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable require-unicode-regexp */
// 状态流转弹窗 -- 需求详情

/* eslint-disable complexity */
/* eslint-disable max-lines */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-no-leaked-render */
import { useEffect, useState } from 'react'
import {
  Select,
  Form,
  Input,
  Timeline,
  DatePicker,
  TreeSelect,
  Spin,
  Tooltip,
  Divider,
} from 'antd'
import IconFont from '@/components/IconFont'
import styled from '@emotion/styled'
import { useTranslation } from 'react-i18next'
import { css } from '@emotion/css'
import moment from 'moment'
import { getProjectMember } from '@/services/mine'
import { getShapeRight } from '@/services/demand'
import { useGetloginInfo } from '@/hooks/useGetloginInfo'
import CommonButton from './CommonButton'
import CustomSelect from './CustomSelect'
import { MyDiv } from './Shape'

export function setValue(res: any) {
  const form1Obj: any = {}
  for (const key in res?.fields) {
    // if (res?.fields[key].content === 'users_name') {
    //   // eslint-disable-next-line no-undefined
    //   if (res.originalStatusUserIds.length >= 1) {
    //     form1Obj[res?.fields[key].content] = [
    //       res.originalStatusUserIds.join(','),
    //     ]
    //   }
    // } else
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

const Right = styled.div`
  position: relative;
  box-sizing: border-box;
  padding-left: 24px;
  padding-top: 40px;
  width: 100%;
  /* min-height: 400px; */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`
const Contain = styled.div`
  margin-top: 15px;
  background: var(--neutral-n8);
  border-radius: 6px;
  position: relative;
  width: 100%;
  padding-right: 4px;
  min-height: 316px;
  display: flex;
`

const FormWrap = styled.div`
  box-sizing: border-box;
  padding-right: 24px;
`
const ButtonFooter = styled.div`
  height: 80px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
`

const ExcessiveBox = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
`
const StyledShape2 = styled.div`
  padding: 1px 8px 1px 8px;
  height: 22px;
  background: var(--neutral-white-d7);
  border-radius: 6px 6px 6px 6px;
  opacity: 1;
  border: 1px solid var(--neutral-n9);
  font-size: 12px;
  font-family: PingFang SC-Regular, PingFang SC;
  font-weight: 400;
  color: var(--neutral-n3);
  display: flex;
  align-items: center;
  justify-content: center;
`
const StyledShape3 = styled.div`
  height: 20px;
  font-size: 12px;
  font-family: PingFang SC-Regular, PingFang SC;
  font-weight: 400;
  color: var(--neutral-n3);
  line-height: 20px;
`
const AuditBox = styled.div``
const LineBox = styled.div``

const LineBoxTitle2 = styled.div`
  margin-right: 40px;
  height: 22px;
  font-size: 14px;
  font-family: PingFang SC-Regular, PingFang SC;
  font-weight: 400;
  color: var(--neutral-n1-d1);
  margin-bottom: 8px;
  line-height: 22px;
`
const ArrorBox = styled.div`
  display: flex;
`

const arron = css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: #a4acf5;
  border-radius: 16px 16px 16px 16px;
  font-size: 12px;
  font-family: PingFang SC-Medium, PingFang SC;
  font-family: siyuanmedium;
  color: var(--neutral-white-d2);
`
const arrorText = css`
  height: 20px;
  font-size: 12px;
  font-family: PingFang SC-Regular, PingFang SC;
  font-weight: 400;
  color: var(--neutral-n1-d1);
  line-height: 20px;
  margin-left: 5px;
`
const symbol = css`
  color: var(--neutral-n4);
  position: absolute;
  width: 16px;
  height: 16px;
  border-radius: 0px 0px 0px 0px;
  top: 5px;
  right: -25px;
`
const ArrorItem = styled.div`
  position: relative;
  height: 60px;
  display: flex;
  /* flex-direction: column; */
  display: flex;
  align-items: center;
  justify-content: space-between;
  &:nth-last-child(1) {
    .${symbol} {
      visibility: hidden;
    }
  }
`

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
      <div style={{ border: '1px solid var( --active)', borderRadius: '6px' }}>
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
    <div style={{ border: '1px solid var(--active)', borderRadius: '6px' }}>
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

const ShapeContentForDetail = (props: any) => {
  const [t] = useTranslation()
  const {
    row: {
      status: { status: fromText },
    },
  } = props

  const {
    record: {
      id: myid,
      project_id: projectId,
      status: { id: activeID, can_changes: statusList },
    },
    hide,
    tap,
  } = props

  const [form] = Form.useForm()
  const [form2] = Form.useForm()
  const [optionsList, setOptionsList] = useState([])
  const [rightList, setRightList] = useState<any>()
  const [loading, setLoading] = useState<boolean>(false)
  const [activeStatus, setActiveStatus] = useState<any>({})
  const [active, setActive] = useState(activeID)
  const [reviewerValue, setReviewerValue] = useState('')
  const info = useGetloginInfo()

  const handleChange = (value: string) => {
    setReviewerValue(value)
  }

  const init2 = async () => {
    setLoading(false)
    setActiveStatus(props.row.status)
    const res2 = await getProjectMember(projectId)
    setOptionsList(res2.data)
    const res = await getShapeRight({
      id: props.row.project_id,
      nId: props.sid,
      fromId: props.fromId,
      toId: props.row.id,
    })
    setRightList(res)

    form.setFieldsValue(setValue(res))
    setLoading(true)
  }

  useEffect(() => {
    if (props.row.id !== props.sid) {
      init2()
    }
  }, [props.row])

  const onClear = () => {
    form.resetFields()
  }

  const activeContent =
    statusList?.filter((i: any) => i.id === active)[0]?.content !== '规划中'
  const hasDealName = props.row?.dealName === '--'

  const confirm = async () => {
    const res2 = await form.validateFields()
    const res = JSON.parse(JSON.stringify(res2))
    for (const key in res) {
      if (typeof res[key] === 'undefined') {
        res[key] = null
      }
    }
    await form2.validateFields()
    const putData = {
      projectId,
      nId: myid,
      toId: active,
      fields: res,
      verifyId: reviewerValue,
    }
    const putData2 = {
      projectId: props.row.project_id,
      nId: props.sid,
      toId: props.row.id,
      fields: res,
      verifyId: reviewerValue,
    }

    await tap(props.noleft ? putData2 : putData)
    onClear()
  }

  const onConfirm = async () => {
    await confirm()
  }
  const formatName = (content: any, name: any, id: any) => {
    if ((content === 'users_name' || content === 'user_name') && id === info) {
      return `${name} （${t('myself')}）`
    }
    if (rightList?.originalStatusUserIds.includes(id)) {
      return `${name}（${t('theOriginalStateHandlesThePerson')}）`
    }
    return name
  }

  const format = (i: any) => {
    const a = i.children?.map((item: any) => ({
      ...item,
      label: formatName(i.content, item.name, item.id),

      value: item.id,
    }))
    const newA = a.filter((j: any) => {
      return j.id === info
    })

    const newC = a.filter((j: any) => {
      return rightList?.originalStatusUserIds.includes(j.id)
    })

    const ids = rightList?.originalStatusUserIds.join(',')
    const names = newC.map((k: any) => k.name).join(' ; ')
    let newD: any = []
    if (ids) {
      newD = [
        {
          id: ids,
          label: `${names}（${t('theOriginalStateHandlesThePerson')}）`,
          name: names,
          value: ids,
        },
      ]
    }

    const newB = a.filter((j: any) => {
      return j.id !== info && !rightList?.originalStatusUserIds.includes(j.id)
    })

    return (newD ? newD : []).concat(newA, newB)
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
        return rightList?.originalStatusUserIds.includes(j.id)
      })

      const names = newC.map((k: any) => k.name).join(' ; ')

      return names ? `${names}（${t('theOriginalStateHandlesThePerson')}）` : ''
    }
  }
  const setMyValue = () => {
    const arr = form.getFieldsValue().users_name
    const arr2 = rightList?.originalStatusUserIds
    form.setFieldsValue({
      users_name: Array.from(new Set([...arr, ...arr2])),
    })
  }
  const setMyValue2 = () => {
    const arr = form.getFieldsValue().users_name
    const arr2 = [info]
    form.setFieldsValue({
      users_name: Array.from(new Set([...arr, ...arr2])),
    })
  }
  const valid = () => {
    const str1 = form.getFieldsValue()?.users_name?.join(',')
    const str2 = rightList?.originalStatusUserIds?.join(',')

    return str1?.includes(str2)
  }
  return (
    <Contain>
      {loading && (
        <Right>
          <div>
            <FormWrap>
              <Form
                labelCol={{ span: 4 }}
                labelAlign="left"
                form={form}
                onFinish={confirm}
                onFinishFailed={() => {
                  setTimeout(() => {
                    const errorList = (document as any).querySelectorAll(
                      '.ant-form-item-has-error',
                    )

                    errorList[0].scrollIntoView({
                      block: 'center',
                      behavior: 'smooth',
                    })
                  }, 100)
                }}
              >
                {rightList?.fields?.map((i: any) => (
                  <div key={i.content}>
                    {i.type === 'area' && (
                      <Form.Item
                        getValueFromEvent={event => {
                          return event.target.value.replace(
                            /(?<start>^\s*)/g,
                            '',
                          )
                        }}
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
                          style={{ maxHeight: '132px', minHeight: '132px' }}
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
                            // dropdownRender={(menu: any) => {
                            //   return (
                            //     <div
                            //       style={{
                            //         padding: '8px ',
                            //       }}
                            //     >
                            //       {format2(i, 2) && (
                            //         <MyDiv
                            //           show={valid() as unknown as boolean}
                            //           onClick={setMyValue}
                            //         >
                            //           {format2(i, 2)}
                            //         </MyDiv>
                            //       )}

                            //       <MyDiv
                            //         show={form
                            //           .getFieldsValue()
                            //           ?.users_name?.includes(info)}
                            //         onClick={setMyValue2}
                            //       >
                            //         {format2(i, 1)}
                            //       </MyDiv>
                            //       <Divider style={{ margin: '8px 0' }} />
                            //       {menu}
                            //     </div>
                            //   )
                            // }}
                            placeholder={t('common.pleaseSelect')}
                            allowClear
                            // options={i.children?.map((item: any) => ({
                            //   label: item.name,
                            //   value: item.id,
                            // }))}
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
                          <CustomSelect
                            mode="multiple"
                            placeholder={t('common.pleaseSelect')}
                            allowClear
                            options={format(i)}
                            optionFilterProp="label"
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
                          return event.target.value.replace(
                            /(?<start>^\s*)/g,
                            '',
                          )
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
              </Form>
            </FormWrap>
            {rightList?.is_verify ? (
              <ExcessiveBox>
                <StyledShape2
                  style={{
                    color: props.noleft ? props?.active.color : fromText?.color,
                    border: `1px solid ${
                      props.noleft ? props?.active.color : fromText?.color
                    }`,
                    marginRight: '8px',
                  }}
                >
                  {props.noleft ? props?.active?.content : fromText?.content}
                </StyledShape2>
                <IconFont
                  style={{
                    fontSize: '50px',
                    margin: '0 8px',
                    color: 'var(--neutral-n4)',
                  }}
                  type="flow"
                />
                <StyledShape2
                  style={{
                    color: activeStatus.color,
                    border: `1px solid ${activeStatus.color}`,
                    marginRight: '8px',
                  }}
                >
                  {activeStatus?.content}
                </StyledShape2>
                <StyledShape3>{t('newlyAdd.needReview')}</StyledShape3>
              </ExcessiveBox>
            ) : null}
            {rightList.is_verify && rightList.verify.verify_type === 1 ? (
              <AuditBox>
                <div
                  style={{
                    height: '22px',
                    fontSize: '14px',
                    fontFamily: 'SiYuanMedium',
                    color: 'var(--neutral-n1-d1)',
                    lineHeight: '22px',
                    marginBottom: '20px',
                  }}
                >
                  {t('newlyAdd.reviewProcess')}
                </div>

                <Timeline>
                  {rightList.verify.process.map((item2: any) => (
                    <Timeline.Item key={item2}>
                      <LineBox>
                        <div style={{ display: 'flex' }}>
                          <LineBoxTitle2>
                            {t('newlyAdd.reviewPerson')}
                          </LineBoxTitle2>
                        </div>

                        <ArrorBox>
                          {item2.verify_users.map((item: any, index: any) => (
                            <div
                              key={item}
                              style={{ display: 'flex', alignItems: 'center' }}
                            >
                              <ArrorItem>
                                <span className={arron}>
                                  {item.name?.trim().charAt(0)}
                                </span>
                                <span className={arrorText}>{item.name}</span>
                              </ArrorItem>
                              {index !== item2.verify_users?.length - 1 && (
                                <IconFont
                                  style={{
                                    fontSize: 16,
                                    margin: '0 8px',
                                    color: 'var(--neutral-n4)',
                                    position: 'relative',
                                    top: '0px',
                                  }}
                                  type={
                                    item2.operator === 1
                                      ? 'right'
                                      : item2.operator === 2
                                      ? 'and'
                                      : 'line'
                                  }
                                />
                              )}
                            </div>
                          ))}
                        </ArrorBox>
                      </LineBox>
                    </Timeline.Item>
                  ))}
                  <Timeline.Item>
                    <LineBox>
                      <div style={{ display: 'flex' }}>
                        <LineBoxTitle2>
                          {t('newlyAdd.circulationTo')}
                        </LineBoxTitle2>

                        <StyledShape2
                          style={{
                            color: activeStatus.color,
                            border: `1px solid ${activeStatus.color}`,
                            marginRight: '8px',
                          }}
                        >
                          {activeStatus?.content}
                        </StyledShape2>
                      </div>
                    </LineBox>
                  </Timeline.Item>
                </Timeline>
              </AuditBox>
            ) : null}
            {rightList.is_verify && rightList.verify.verify_type === 2 ? (
              <Form
                labelCol={{ span: 4 }}
                labelAlign="left"
                form={form2}
                onFinish={confirm}
                onFinishFailed={() => {
                  setTimeout(() => {
                    const errorList = (document as any).querySelectorAll(
                      '.ant-form-item-has-error',
                    )

                    errorList[0].scrollIntoView({
                      block: 'center',
                      behavior: 'smooth',
                    })
                  }, 100)
                }}
              >
                <Form.Item
                  style={{ paddingRight: '24px' }}
                  labelAlign="left"
                  label={t('newlyAdd.reviewPerson')}
                  name="reviewerValue"
                  rules={[
                    {
                      required:
                        activeContent || (!activeContent && !hasDealName),
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
              </Form>
            ) : null}
          </div>

          <ButtonFooter>
            <CommonButton
              isDisable={!rightList.user_has_auth}
              onClick={onConfirm}
              type="primary"
            >
              {rightList.is_verify
                ? t('newlyAdd.submitReview')
                : t('common.circulation')}
            </CommonButton>
          </ButtonFooter>
        </Right>
      )}

      {!loading && (
        <Spin
          style={{
            width: '100%',
            position: 'absolute',
            transform: 'translate(-50%, -50%)',
            top: '50%',
            left: '50%',
          }}
        />
      )}
    </Contain>
  )
}

export default ShapeContentForDetail
