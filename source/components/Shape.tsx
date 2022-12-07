// 公用状态流转弹窗

/* eslint-disable require-unicode-regexp */
/* eslint-disable complexity */
/* eslint-disable max-lines */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-no-leaked-render */
import { useEffect, useState } from 'react'
import {
  Select,
  Button,
  Form,
  Input,
  Timeline,
  DatePicker,
  TreeSelect,
  Spin,
  Tooltip,
} from 'antd'
import { useModel } from '@/models'
import IconFont from '@/components/IconFont'
import styled from '@emotion/styled'
import { useTranslation } from 'react-i18next'
import { css } from '@emotion/css'
import { getShapeLeft, getShapeRight } from '@/services/project/shape'
import moment from 'moment'

const Left = styled.div`
  min-height: 400px;
  box-sizing: border-box;
  padding: 0 20px;
  padding-top: 32px;
  display: flex;
  flex-direction: column;

  align-items: center;
  border-right: 1px solid #ebedf0;
`
const Right = styled.div`
  position: relative;
  box-sizing: border-box;
  padding-left: 24px;
  padding-top: 40px;
  width: 500px;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`
const Contain = styled.div`
  position: relative;
  min-width: 505px;
  padding-right: 4px;
  min-height: 316px;
  display: flex;
`
const StyledShape = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  padding: 1px 8px 1px 8px;
  width: 100%;
  height: 25px;
  white-space: nowrap;
  background: rgba(255, 255, 255, 1);
  background-blend-mode: normal;
  border: 1px solid rgba(235, 237, 240, 1);
  border-radius: 6px;
  margin-bottom: 16px;
  text-align: center;
  &:hover {
    border: 1px solid rgba(40, 119, 255, 1);
    color: rgba(40, 119, 255, 1);
  }
`
const FormWrap = styled.div`
  box-sizing: border-box;
  padding-right: 24px;
`
const ButtonFooter = styled.div`
  height: 80px;
  display: flex;
  align-items: center;
  flex-direction: row-reverse;
  box-sizing: border-box;
  padding-right: 24px;
`
const Close = styled.span`
  position: absolute;
  right: 10px;
  top: 10px;
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
  background: #ffffff;
  border-radius: 6px 6px 6px 6px;
  opacity: 1;
  border: 1px solid #ebedf0;
  font-size: 12px;
  font-family: PingFang SC-Regular, PingFang SC;
  font-weight: 400;
  color: #969799;
  display: flex;
  align-items: center;
  justify-content: center;
`
const StyledShape3 = styled.div`
  height: 20px;
  font-size: 12px;
  font-family: PingFang SC-Regular, PingFang SC;
  font-weight: 400;
  color: #969799;
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
  color: #323233;
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
  font-weight: 500;
  color: #ffffff;
`
const arrorText = css`
  height: 20px;
  font-size: 12px;
  font-family: PingFang SC-Regular, PingFang SC;
  font-weight: 400;
  color: #323233;
  line-height: 20px;
`
const symbol = css`
  color: #bbbdbf;
  position: absolute;
  width: 16px;
  height: 16px;
  border-radius: 0px 0px 0px 0px;
  top: 5px;
  right: -25px;
`
const ArrorItem = styled.div`
  position: relative;
  height: 50px;
  display: flex;
  flex-direction: column;
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
    <Select
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
      <div style={{ border: '1px solid #d5d6d9', borderRadius: '6px' }}>
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
    <div style={{ border: '1px solid #d5d6d9', borderRadius: '6px' }}>
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

export const ShapeContent = (props: any) => {
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
  const { getProjectMember } = useModel('mine')
  const [optionsList, setOptionsList] = useState([])
  const [leftList, setLeftList] = useState([])
  const [rightList, setRightList] = useState<any>()
  const [loading, setLoading] = useState<boolean>(false)
  const [activeStatus, setActiveStatus] = useState<any>({})
  const [active, setActive] = useState(activeID)
  const [reviewerValue, setReviewerValue] = useState('')

  const handleChange = (value: string) => {
    setReviewerValue(value)
  }

  const change = async (item?: any) => {
    setLoading(false)
    form.resetFields()
    setActiveStatus(item.status)
    setActive(item.id)
    const res = await getShapeRight({
      id: projectId,
      nId: myid,
      fromId: activeID,
      toId: item.id ?? activeID,
    })
    setRightList(res)

    const form1Obj: any = {}
    for (const key in res?.fields) {
      form1Obj[res?.fields[key].content] =
        res?.fields[key].true_value === 0 ? '' : res?.fields[key].true_value
    }

    form.setFieldsValue(form1Obj)
    setLoading(true)
  }

  const getRight = async () => {
    setActiveStatus(fromText)
    const res = await getShapeRight({
      id: projectId,
      nId: myid,
      fromId: activeID,
      toId: activeID,
    })
    setRightList(res)

    const form1Obj: any = {}
    for (const key in res?.fields) {
      if (res?.fields[key].type === 'select') {
        form1Obj[res?.fields[key].content] =
          res?.fields[key].true_value === null &&
          res?.fields[key].children.some(
            (i: any) => i.id === res?.fields[key].true_value,
          )
            ? []
            : res?.fields[key].true_value
      }
    }

    form.setFieldsValue(form1Obj)
    setLoading(true)
  }

  const init2 = async () => {
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

    const form1Obj: any = {}
    for (const key in res?.fields) {
      form1Obj[res?.fields[key].content] =
        res?.fields[key].true_value === 0 ? '' : res?.fields[key].true_value
    }

    form.setFieldsValue(form1Obj)
    setLoading(true)
  }
  // console.log(rightList);

  const init = async () => {
    const res = await getProjectMember(projectId)
    setOptionsList(res.data)
    const res2 = await getShapeLeft({
      id: projectId,
      nId: myid,
    })
    setLeftList(res2)
    getRight()
  }

  useEffect(() => {
    if (props.noleft) {
      init2()
    } else {
      init()
    }
  }, [])

  const onClear = () => {
    hide()
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

    tap(props.noleft ? putData2 : putData)
    onClear()
  }

  return (
    <Contain>
      {!props.noleft && (
        <Left>
          {leftList.map((item: any) => (
            <div
              style={{ width: '100%' }}
              onClick={() => change(item)}
              key={item.id}
            >
              <StyledShape
                style={{
                  color: item.id === active ? '#2877ff' : '#969799',
                  border:
                    item.id === active
                      ? '1px solid #2877ff'
                      : '1px solid #EBEDF0',
                }}
              >
                {item.status.content}
              </StyledShape>
            </div>
          ))}
        </Left>
      )}

      {loading && (
        <Right>
          <div style={{ maxHeight: 280, overflow: 'auto' }}>
            <FormWrap>
              <Form
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
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
                        <Select
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
                    {['select_checkbox', 'checkbox'].includes(i.type) && (
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
                        <Select
                          mode="multiple"
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
                          placeholder="Please select"
                          treeDefaultExpandAll
                        />
                      </Form.Item>
                    )}
                    {['text', 'textarea'].includes(i.type) && (
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
                    color: '#BBBDBF',
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
                    fontWeight: 500,
                    color: '#323233',
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
                                    color: '#BBBDBF',
                                    position: 'relative',
                                    top: '-13px',
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
                labelCol={{ span: 10 }}
                wrapperCol={{ span: 16 }}
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
                  <Select
                    onChange={handleChange}
                    placeholder={t('common.pleaseSelect')}
                    allowClear
                    getPopupContainer={node => node}
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
            <Button
              disabled={!rightList.user_has_auth}
              onClick={() => {
                form.submit()
                form2.submit()
              }}
              style={{ marginLeft: '16px' }}
              type="primary"
            >
              {rightList.is_verify
                ? t('newlyAdd.submitReview')
                : t('common.circulation')}
            </Button>

            <Button onClick={() => onClear()}>{t('common.cancel')}</Button>
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

      <Close onClick={() => onClear()}>
        <IconFont type="close" style={{ fontSize: 16, cursor: 'pointer' }} />
      </Close>
    </Contain>
  )
}
