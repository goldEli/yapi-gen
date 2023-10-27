/* eslint-disable complexity */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-useless-concat */
/* eslint-disable camelcase */
/* eslint-disable max-params */
import CommonIconFont from '@/components/CommonIconFont'
import styled from '@emotion/styled'
import { useDispatch } from '@store/index'
import { setEditSave } from '@store/formWork'
import { Input, Popover } from 'antd'
import { useEffect, useState } from 'react'
import {
  startWeekData,
  endWeekData,
  nextMonthDay,
  hourData,
  minuteData,
  data,
  dayData,
} from './DataList'
import { useTranslation } from 'react-i18next'
import CommonButton from '@/components/CommonButton'
const PopoverWrap = styled(Popover)({
  '.ant-popover-content': {
    marginTop: '4px',
  },
})
const PickerStyle = styled.div`
  width: 360px;
  height: 232px;
  background-color: var(--neutral-white-d6);
  color: var(--neutral-n2);
  font-size: 14px;
  box-shadow: 0px 0px 15px 6px rgba(0, 0, 0, 0.12);
  border-radius: 6px;
  display: flex;
`
const LeftTime1 = styled.div`
  width: 175px;
  height: 232px;
  overflow-y: auto;
  border-right: 1px solid var(--neutral-n6-d2);
`
const LeftTime = styled.div`
  width: 120px;
  height: 232px;
  overflow-y: auto;
  border-right: 1px solid var(--neutral-n6-d2);
`
const CenterTime = styled.div`
  width: 120px;
  height: 232px;
  overflow-y: auto;
  border-right: 1px solid var(--neutral-n6-d2);
`
const RightTime = styled.div`
  position: relative;
  width: 120px;
  height: 232px;
  overflow-y: auto;
`
const Item = styled.div`
  width: 100%;
  padding: 0 16px;
  height: 32px;
  line-height: 32px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  &:hover {
    cursor: pointer;
    background-color: var(--hover-d3);
    color: var(--neutral-n1-d1);
  }
`
const InputStyle = styled(Input)({
  width: '320px',
})
const Btn = styled.div`
  position: absolute;
  bottom: 12px;
  right: 12px;
`
interface PropsType {
  // remind 代表提醒时间
  pickerType: string
  // 每天 day ,每周 week , 每月 month , 不重复doNot
  type: string
  getValues(val1: number, val2: number, val3: number, onece: boolean): void
  value: any
  onChange?(values: any): void
}
interface Item {
  label: string
  key?: number
}
let v1 = 0
let v2 = 0
let v3 = 0
const Picker = (props: PropsType) => {
  const [t]: any = useTranslation()
  const dispatch = useDispatch()
  const [leftActiveVal, setLeftActiveVal] = useState<number>(0)
  const [centerActiveVal, setCenterActiveVal] = useState<number>(0)
  const [rightActiveVal, setRightActiveVal] = useState<number>(0)
  const [leftDataList, setLeftDataList] = useState<Array<Item>>()
  const [rightDataList, setRightDataList] = useState<Array<Item>>()
  const [centerDataList, setCenterDataList] = useState<Array<Item>>()
  const [value, setValue] = useState('')
  const [popoverVisible, setPopoverVisible] = useState(false)
  // 每天提醒时间只有时(提前24h)和分
  // 每周提醒时间(提前0-5)天时和分
  // 每月提醒时间(提前0-30天)天时和分
  useEffect(() => {
    if (props.type === 'day' && props.pickerType === 'start') {
      // 每天，开始时间
      setLeftDataList(data)
      setCenterDataList(hourData)
      setRightDataList(minuteData)
    } else if (props.type === 'day' && props.pickerType === 'end') {
      // 每天，结束时间
      setLeftDataList(data)
      setCenterDataList(hourData)
      setRightDataList(minuteData)
    } else if (props.type === 'day' && props.pickerType === 'remind') {
      // 每天，提醒时间 去掉rightDataList,展示3栏 --- 每天提醒时间只有时(提前24h)和分
      setCenterDataList(hourData)
      setRightDataList(minuteData)
    } else if (props.type === 'week' && props.pickerType === 'start') {
      // 每周，开始时间
      setLeftDataList(startWeekData)
      setCenterDataList(hourData)
      setRightDataList(minuteData)
    } else if (props.type === 'week' && props.pickerType === 'end') {
      // 每周，结束时间
      setLeftDataList(endWeekData)
      setCenterDataList(hourData)
      setRightDataList(minuteData)
    } else if (props.type === 'week' && props.pickerType === 'remind') {
      // 每周，提醒时间 --- 每周提醒时间(提前0-5)天时和分
      setLeftDataList(dayData.filter(el => el.key <= 5))
      setCenterDataList(hourData)
      setRightDataList(minuteData)
    } else if (props.type === 'month' && props.pickerType === 'start') {
      // 每月，开始时间 - 从25-次月的15日
      const day = dayData.filter(el => el.key >= 25 && el.key <= 31)
      setLeftDataList([...day, ...nextMonthDay])
      setCenterDataList(hourData)
      setRightDataList(minuteData)
    } else if (props.type === 'month' && props.pickerType === 'end') {
      // 每月，开始时间 - 从25-次月的15日
      const day = dayData.filter(el => el.key >= 26 && el.key <= 31)
      setLeftDataList([...day, ...nextMonthDay])
      setCenterDataList(hourData)
      setRightDataList(minuteData)
    } else if (props.type === 'month' && props.pickerType === 'remind') {
      // 每月，提醒时间 --- 30天
      setLeftDataList(dayData)
      setCenterDataList(hourData)
      setRightDataList(minuteData)
    } else if (props.type === 'doNot' && props.pickerType === 'remind') {
      // 不重复--提醒时间
      setLeftDataList(dayData)
      setCenterDataList(hourData)
      setRightDataList(minuteData)
    }
  }, [props.type])

  //  时分数转化为秒
  const time1 = (d: number, h: number, m: number) => {
    let datS: any = d ? d * 60 * 60 * 24 : 0
    let hS = h * 60 * 60
    let minute = m * 60
    const second = datS + hS + minute
    return second
  }
  // 完成
  const getTime = () => {
    dispatch(setEditSave(false))
    props.getValues(leftActiveVal, centerActiveVal, rightActiveVal, false)
    if (props.pickerType === 'start' || props.pickerType === 'end') {
      props?.onChange?.({
        time: time1(0, centerActiveVal, rightActiveVal),
        day_type: leftActiveVal,
      })
    } else {
      if (props.type === 'day') {
        props?.onChange?.(time1(0, centerActiveVal, rightActiveVal))
      } else {
        props?.onChange?.(time1(leftActiveVal, centerActiveVal, rightActiveVal))
      }
    }
    setPopoverVisible(false)
  }

  // 需要中文
  const getLabelName = (num: number) => {
    switch (num) {
      case 0:
        return t('formWork.monday')
      case 1:
        return t(`formWork.tuesday`)
      case 2:
        return t(`formWork.wednesday`)
      case 3:
        return t(`formWork.thursday`)
      case 4:
        return t(`formWork.friday`)
      case 5:
        return t(`formWork.saturday`)
      case 6:
        return t(`formWork.sunday`)
      case 7:
        return t(`formWork.cw1`)
      case 8:
        return t(`formWork.cw2`)
      case 9:
        return t(`formWork.cw3`)
      case 10:
        return t(`formWork.cw4`)
      case 11:
        return t(`formWork.cw5`)
      case 12:
        return t(`formWork.cw6`)
      case 13:
        return t(`formWork.cw7`)
    }
  }
  // 周
  const getWeekValues = () => {
    if (props.pickerType === 'remind') {
      setValue(
        t('formWork.end1') +
          '/' +
          v1 +
          t('formWork.day') +
          '/' +
          v2 +
          t('formWork.h') +
          '/' +
          v3 +
          t('formWork.m'),
      )
    } else {
      setValue(
        getLabelName(v1) +
          '/' +
          v2 +
          t('formWork.h') +
          '/' +
          v3 +
          t('formWork.m'),
      )
    }
  }
  // 天
  const getDayValues = () => {
    // 回显input
    if (props.pickerType === 'remind') {
      setValue(
        t('formWork.end1') +
          '/' +
          v2 +
          t('formWork.h') +
          '/' +
          v3 +
          t('formWork.m'),
      )
    } else {
      setValue(
        (v1 == 1 ? t('formWork.atThatTime') : t('formWork.theNextDay')) +
          '/' +
          v2 +
          t('formWork.h') +
          '/' +
          v3 +
          t('formWork.m'),
      )
    }
  }
  // 月
  const getMonthValues = () => {
    if (props.pickerType === 'remind') {
      setValue(
        t('formWork.end1') +
          '/' +
          v1 +
          t('formWork.day') +
          '/' +
          v2 +
          t('formWork.h') +
          '/' +
          v3 +
          t('formWork.m'),
      )
    } else {
      const arr = [...nextMonthDay, ...dayData]
      const label = arr.find((el: any) => el.key === v1)?.label
      setValue(
        t(`formWork.${label}`) +
          '/' +
          v2 +
          t('formWork.h') +
          '/' +
          v3 +
          t('formWork.m'),
      )
    }
  }
  useEffect(() => {
    if (
      !props?.value?.v2 &&
      !props?.value?.v3 &&
      props?.value?.v2 !== 0 &&
      props?.value?.v3 !== 0
    ) {
      setValue('')
      setLeftActiveVal(0)
      setCenterActiveVal(0)
      setRightActiveVal(0)
      return
    }
    v1 = props?.value?.v1
    v2 = props?.value?.v2
    v3 = props?.value?.v3
    setLeftActiveVal(props?.value?.v1)
    setCenterActiveVal(props?.value?.v2)
    setRightActiveVal(props?.value?.v3)
    props.getValues(props?.value?.v1, props?.value?.v2, props?.value?.v3, true)
    if (props.type === 'day') {
      getDayValues()
    } else if (props.type === 'week') {
      getWeekValues()
    } else if (props.type === 'month' || props.type === 'doNot') {
      getMonthValues()
    }
  }, [props.value])
  const content = () => {
    return (
      <PickerStyle>
        {/* 提醒时间才有 */}
        {props.pickerType === 'remind' ? (
          <LeftTime1>{<Item>{t('formWork.end1')}</Item>}</LeftTime1>
        ) : null}
        {props.type === 'day' && props.pickerType === 'remind' ? null : (
          <LeftTime>
            {leftDataList?.map((el: any, index: number) => (
              <Item
                key={el.label}
                onClick={e => {
                  e.stopPropagation(), setLeftActiveVal(el.key)
                }}
                style={{
                  color:
                    leftActiveVal === el.key
                      ? 'var(--primary-d2)'
                      : 'var(--neutral-n2)',
                }}
              >
                {t(`formWork.${el.label}`)}
              </Item>
            ))}
          </LeftTime>
        )}
        <CenterTime>
          {centerDataList?.map((el: any, index: number) => (
            <Item
              key={el.label}
              onClick={e => {
                e.stopPropagation(), setCenterActiveVal(el.key)
              }}
              style={{
                color:
                  centerActiveVal === el.key
                    ? 'var(--primary-d2)'
                    : 'var(--neutral-n2)',
              }}
            >
              {t(`formWork.${el.label}`)}
            </Item>
          ))}
        </CenterTime>
        <RightTime>
          {rightDataList?.map((el: any, index: number) => (
            <Item
              key={el.label}
              onClick={e => {
                e.stopPropagation(), setRightActiveVal(el.key)
              }}
              style={{
                color:
                  rightActiveVal === el.key
                    ? 'var(--primary-d2)'
                    : 'var(--neutral-n2)',
              }}
            >
              {t(`formWork.${el.label}`)}
            </Item>
          ))}
          <Btn onClick={getTime}>
            <CommonButton type="primary" size="small">
              {t('container.finish')}
            </CommonButton>
          </Btn>
        </RightTime>
      </PickerStyle>
    )
  }
  return (
    <PopoverWrap
      placement="bottomRight"
      title={''}
      open={popoverVisible}
      onOpenChange={setPopoverVisible}
      content={content}
      trigger="[click]"
    >
      <InputStyle
        type="text"
        value={value}
        placeholder={t('formWork.inp1')}
        suffix={
          <CommonIconFont type="time" size={16} color="var(--neutral-n4)" />
        }
      />
    </PopoverWrap>
  )
}
export default Picker
