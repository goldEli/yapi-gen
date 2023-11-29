/* eslint-disable react/jsx-handler-names */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
/* eslint-disable new-cap */
/* eslint-disable require-unicode-regexp */
/* eslint-disable no-negated-condition */
/* eslint-disable complexity */
/* eslint-disable max-params */
import { Checkbox, Switch, Form, Dropdown, DatePicker, message } from 'antd'
import { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import CommonIconFont from '@/components/CommonIconFont'
import Picker from './Picker'
import { setEditSave, setErr, setErrMsg } from '@store/formWork'
import { useDispatch, useSelector } from '@store/index'
import moment from 'moment'
import { dayData1, weekData, monthData } from './DataList'
import { throttle } from 'lodash'
import { useTranslation } from 'react-i18next'
import { getMessage } from '@/components/Message'
const Text = styled.div`
  color: var(--neutral-n1-d1);
  font-size: 14px;
  margin-right: 8px;
`
const BtnStyle = styled.div`
  color: var(--auxiliary-text-t2-d2);
  &:hover {
    cursor: pointer;
  }
`
const RowStyle = styled.div`
  display: flex;
  align-items: center;
`
interface SupScopeType {
  // 显示的数据不同
  type: string
  value?: any
  onChange?(val: string | number): void
}

interface Item {
  label: string
  key: string
}
const DatePicker1 = (props: any) => {
  const dispatch = useDispatch()
  const [t] = useTranslation()
  const [value, setValue] = useState<any>('')
  const onChange = (e: any, dateString: string) => {
    props.datePickValue(dateString)
    var T = new Date(dateString)
    props.onChange(T.getTime())
    dispatch(setEditSave(false))
  }
  useEffect(() => {
    if (props.value) {
      setValue(moment(props.value))
    } else {
      setValue('')
    }
  }, [props.value])
  return (
    <DatePicker
      placeholder={t('formWork.msg13')}
      onChange={(date: any, dateString: string) => {
        onChange(date, dateString)
      }}
      showTime
      value={value}
    />
  )
}
const SupScope = (props: SupScopeType) => {
  const dispatch = useDispatch()
  const [isOpen, setIsOpen] = useState(false)
  const [items, setItems] = useState<Array<Item>>()
  const [t]: any = useTranslation()
  // 每天 day ,每周 week , 每月 month , 不重复doNot
  useEffect(() => {
    switch (props.type) {
      case 'day':
        setItems(
          dayData1.map((el: any) => ({
            ...el,
            label: t(`formWork.${el.label}`),
          })),
        )
        break
      case 'week':
        setItems(
          weekData.map((el: any) => ({
            ...el,
            label: t(`formWork.${el.label}`),
          })),
        )
        break
      case 'month':
        setItems(
          monthData.map((el: any) => ({
            ...el,
            label: t(`formWork.${el.label}`),
          })),
        )
        break
    }
  }, [props.type])
  const onOpenChange = (e: { key: any }) => {
    props.onChange?.(Number(e.key))
    dispatch(setEditSave(false))
    setIsOpen(false)
  }
  return (
    <RowStyle>
      <Text>{t('formWork.msg3')}:</Text>
      <Dropdown
        placement="bottomLeft"
        open={isOpen}
        trigger={['click']}
        menu={{ items, onClick: onOpenChange }}
        overlayStyle={{
          width: 120,
          background: 'var(--neutral-white-d1)',
        }}
      >
        <BtnStyle
          onClick={e => {
            setIsOpen(!isOpen)
          }}
        >
          <span style={{ marginRight: '12px' }}>{props.value?.label}</span>
          <CommonIconFont
            type={isOpen ? 'up' : 'down'}
            size={14}
            color="var(--primary-d2)"
          />
        </BtnStyle>
      </Dropdown>
    </RowStyle>
  )
}
interface ValueType {
  label: string
  key: number
  value: boolean
}
interface CheckBoxGroupType {
  onChange?(val: Array<ValueType>): void
  value?: any
}
// 选择周几
const CheckBoxGroup = (props: CheckBoxGroupType) => {
  const [t]: any = useTranslation()
  const dispatch = useDispatch()
  const onChange = throttle(
    (value: boolean, el1: { value: boolean; key: number }) => {
      dispatch(setEditSave(false))
      const filterVal = props?.value.map(
        (item: { value: boolean; key: number }) => ({
          ...item,
          value: el1.key === item.key ? value : item.value,
        }),
      )
      props.onChange?.(filterVal)
    },
    500,
  )
  return (
    <>
      {props.value?.map(
        (el: { value: boolean; key: number; label: string }) => (
          <Checkbox
            key={el.key}
            onChange={e => onChange(e.target.checked, el)}
            checked={el.value}
          >
            {t(`formWork.${el.label}`)}
          </Checkbox>
        ),
      )}
    </>
  )
}
interface EditType {
  onChange?(val: boolean): void
  value?: boolean
}
const Edit = (props: EditType) => {
  const dispatch = useDispatch()
  const [t] = useTranslation()
  return (
    <RowStyle>
      <Text>{t('formWork.msg4')}</Text>
      <Switch
        checked={props.value || false}
        style={{ marginLeft: 8 }}
        onChange={e => {
          dispatch(setEditSave(false)), props.onChange?.(e)
        }}
      />
    </RowStyle>
  )
}
interface CheckBoxType {
  title: string
  value?: boolean
  onChange?(val: boolean): void
}

const CheckBox = (props: CheckBoxType) => {
  const dispatch = useDispatch()
  return (
    <Checkbox
      checked={props.value}
      onChange={e => {
        dispatch(setEditSave(false)), props.onChange?.(e.target.checked)
      }}
    >
      {props.title}
    </Checkbox>
  )
}
interface FormType {
  // 每周每月每日补交范围不同，不重复没有补交范围
  type: string
}
let startTime: any = null
let endTime: any = null
let remindTime: any = null
const FormMain = (props: FormType) => {
  const dispatch = useDispatch()
  const [t] = useTranslation()
  const [startTimes, setStartTimes] = useState<any>()
  const [endTimes, setEndTimes] = useState<any>()
  const [remindTimes, setRemindTimes] = useState<any>()
  const { fillingRequirements } = useSelector(store => store.formWork)
  // 每天选择不能大于24小时
  const dayJudgeTime = () => {
    if (
      (startTime?.v1 === 1 && endTime?.v1 === 1) ||
      (startTime?.v1 === 2 && endTime?.v1 === 2)
    ) {
      // 判断结束必须大于开始
      if (endTime?.v2 < startTime?.v2) {
        getMessage({ msg: t('formWork.msg10'), type: 'warning' })
        dispatch(setErr(false))
        dispatch(setErrMsg(t('formWork.msg10')))
        return
      } else if (endTime?.v2 === startTime?.v2) {
        if (endTime?.v3 < startTime?.v3) {
          getMessage({ msg: t('formWork.msg10'), type: 'warning' })
          dispatch(setErr(false))
          dispatch(setErrMsg(t('formWork.msg10')))
          return
        }
      }
    } else if (startTime?.v1 === 1 && endTime?.v1 === 2) {
      if (endTime?.v2 > startTime?.v2) {
        getMessage({ msg: t('formWork.msg11'), type: 'warning' })
        dispatch(setErrMsg(t('formWork.msg11')))
        dispatch(setErr(false))
        return
      } else if (startTime?.v2 === endTime?.v2) {
        if (endTime?.v3 > startTime?.v3) {
          getMessage({ msg: t('formWork.msg11'), type: 'warning' })
          dispatch(setErrMsg(t('formWork.msg11')))
          dispatch(setErr(false))
          return
        }
      }
    } else if (startTime?.v1 === 2 && endTime?.v1 === 1) {
      getMessage({ msg: t('formWork.msg12'), type: 'warning' })
      dispatch(setErrMsg(t('formWork.msg12')))
      dispatch(setErr(false))
      return
    }
    dispatch(setErr(true))
  }
  // 不能超过一周
  const WeekJudgeTime = () => {
    if (endTime?.v1 > startTime?.v1 + 7) {
      getMessage({ msg: t('formWork.msg14'), type: 'warning' })
      dispatch(setErr(false))
      dispatch(setErrMsg(t('formWork.msg14')))
      setErrMsg
      return
    } else if (endTime?.v1 === startTime?.v1 + 7) {
      if (endTime?.v2 > startTime?.v2) {
        getMessage({ msg: t('formWork.msg14'), type: 'warning' })
        dispatch(setErrMsg(t('formWork.msg14')))
        dispatch(setErr(false))
        return
      } else if (endTime?.v2 === startTime?.v2) {
        if (endTime?.v3 > startTime?.v3) {
          getMessage({ msg: t('formWork.msg14'), type: 'warning' })
          dispatch(setErrMsg(t('formWork.msg14')))
          dispatch(setErr(false))
          return
        }
      }
    }
    dispatch(setErr(true))
  }
  const MonthJudgeTime = () => {
    if (startTime.v1 > endTime.v1) {
      getMessage({ msg: t('formWork.msg10'), type: 'warning' })
      dispatch(setErrMsg(t('formWork.msg10')))
      dispatch(setErr(false))
      return
    } else if (startTime.v1 === endTime.v1) {
      if (startTime.v2 > endTime.v2) {
        getMessage({ msg: t('formWork.msg10'), type: 'warning' })
        dispatch(setErrMsg(t('formWork.msg10')))
        dispatch(setErr(false))
        return
      } else if (startTime.v2 === endTime.v2) {
        if (startTime.v3 > endTime.v3) {
          getMessage({ msg: t('formWork.msg10'), type: 'warning' })
          dispatch(setErrMsg(t('formWork.msg10')))
          dispatch(setErr(false))
          return
        }
      }
    }
    dispatch(setErr(true))
  }
  // 时间组件选择后赋值，在判断时间是否合格
  const getValues = (
    type: string,
    v1: number,
    v2: number,
    v3: number,
    onece: boolean,
  ) => {
    if (type === 'start') {
      startTime = {
        v1,
        v2,
        v3,
      }
      setStartTimes(startTime)
    } else if (type === 'end') {
      endTime = {
        v1,
        v2,
        v3,
      }
      setEndTimes(endTime)
    } else if (type === 'remind') {
      if (props.type === 'day') {
        remindTime = {
          v2,
          v3,
        }
      } else if (props.type === 'week' || props.type === 'month') {
        remindTime = {
          v1,
          v2,
          v3,
        }
      }
      setRemindTimes(remindTime)
    }
    // onece 第一次回显不效验时间是否合格
    if (props.type === 'day' && !onece) {
      dayJudgeTime()
    } else if (props.type === 'week' && !onece) {
      WeekJudgeTime()
    } else if (props.type === 'month' && !onece) {
      MonthJudgeTime()
    }
  }
  return (
    <>
      {props.type === 'day' ? (
        <>
          <Form.Item label="" name="is_holiday">
            <CheckBox title={t('formWork.msg5')} />
          </Form.Item>
          <Form.Item
            label=""
            name="day"
            style={{
              marginBottom: '26px',
            }}
          >
            <CheckBoxGroup />
          </Form.Item>
        </>
      ) : null}
      {/* 不重复是时间插件*/}
      {props.type === 'doNot' ? null : (
        <Form.Item
          rules={[{ required: true, message: '' }]}
          style={{
            marginBottom: '32px',
          }}
          label={t('formWork.start')}
          name="start_time"
        >
          {props.type === 'day' ||
          props.type === 'week' ||
          props.type === 'month' ? (
            <Picker
              value={startTimes}
              type={props.type}
              pickerType="start"
              getValues={(v1: number, v2: number, v3: number, onece: boolean) =>
                getValues('start', v1, v2, v3, onece)
              }
            />
          ) : null}
        </Form.Item>
      )}

      <Form.Item
        rules={[{ required: true, message: '' }]}
        style={{
          margin: '32px 0 16px 0',
        }}
        label={t('formWork.end')}
        name="end_time"
      >
        {props.type === 'day' ||
        props.type === 'week' ||
        props.type === 'month' ? (
          <Picker
            getValues={(v1: number, v2: number, v3: number, onece: boolean) =>
              getValues('end', v1, v2, v3, onece)
            }
            type={props.type}
            pickerType="end"
            value={endTimes}
          />
        ) : (
          <DatePicker1
            value={endTimes}
            datePickValue={(val: any) => setEndTimes(val)}
          />
        )}
      </Form.Item>
      <RowStyle>
        <Form.Item style={{ marginRight: 48 }} label="" name="is_supply">
          <CheckBox title={t('formWork.msg6')} />
        </Form.Item>

        {props.type === 'doNot' || !fillingRequirements?.is_supply ? null : (
          <Form.Item label="" name="hand_scope">
            <SupScope type={props.type} />
          </Form.Item>
        )}
      </RowStyle>
      <Form.Item label="" name="is_cycle_limit">
        <CheckBox title={t('formWork.msg7')} />
      </Form.Item>
      <Form.Item label="" name="is_submitter_edit">
        <CheckBox title={t('formWork.msg8')} />
      </Form.Item>
      <Form.Item
        style={{
          marginTop: '32px',
        }}
        label=""
        name="auto_reminder"
      >
        <Edit />
      </Form.Item>
      {fillingRequirements?.auto_reminder ? (
        <Form.Item
          rules={[{ required: true, message: '' }]}
          style={{
            marginTop: '16px',
            marginBottom: '24px',
          }}
          label={t('formWork.msg9')}
          name="reminder_time"
        >
          <Picker
            getValues={(v1: number, v2: number, v3: number, onece: boolean) =>
              getValues('remind', v1, v2, v3, onece)
            }
            value={remindTimes}
            type={props.type}
            pickerType="remind"
          />
        </Form.Item>
      ) : null}
    </>
  )
}

export default FormMain
