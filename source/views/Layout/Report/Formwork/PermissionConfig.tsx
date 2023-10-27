/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable react/jsx-handler-names */
/* eslint-disable camelcase */
/* eslint-disable no-constant-binary-expression */
// eslint-disable radix
/* eslint-disable complexity */
/* eslint-disable consistent-return */
/* eslint-disable no-case-declarations */
import styled from '@emotion/styled'
import { useEffect, useState } from 'react'
import Addperson from './Addperson'
import Title from './Title'
import FormMain from './FormMain'
import { Form, message, Radio } from 'antd'
import { useDispatch, useSelector } from '@store/index'
import DeleteConfirm from '@/components/DeleteConfirm'
import {
  setReportContent,
  setFillingRequirements,
  setEditSave,
  setErr,
} from '@store/formWork'
import { dayData1, weekData, monthData, aWeekDataList } from './DataList'
import moment from 'moment'
import { debounce, throttle } from 'lodash'
import { useTranslation } from 'react-i18next'
import IconFont from '@/components/IconFont'
import { css } from '@emotion/css'
const PermissionConfigStyle = styled.div`
  padding: 0 24px;
  overflow-y: auto;
  height: calc(100vh - 265px);
`
const TitleText = styled.div`
  font-size: 14px;
  color: var(--neutral-n1-d1);
`
const bian2 = css`
  transition: all 0.3s;
  background: #fafafc;
  :hover {
    background: #f6f7f9;
  }
`
const DayFormBox = styled(Form)({
  '.ant-form-item': {
    marginBottom: 0,
  },
  '.ant-row': {
    display: 'block',
  },
  '.ant-picker': {
    width: '320px',
  },
})
interface PropsType {
  back(): void
}
const PermissionConfig = (props: PropsType) => {
  const dispatch = useDispatch()
  const [t]: any = useTranslation()
  // 汇报内容是否展开
  const [report, setReport] = useState(true)
  const [fillIn, setFillIn] = useState(true)
  // 每天 day ,每周 week , 每月 month , 不重复doNot
  const [type, setType] = useState<string>('day')
  const [form] = Form.useForm()
  const { fillingRequirements, reportContent } = useSelector(
    store => store.formWork,
  )
  const [person1, setPerson1] = useState<any>([])
  const [person2, setPerson2] = useState<any>([])
  const [person3, setPerson3] = useState<any>([])
  // 去重
  const fitlerDataList = (data: any) => {
    let obj: any = {}
    let set: any = data?.reduce((cur: any, next: any) => {
      obj[next.target_id] ? '' : (obj[next.target_id] = true && cur.push(next))
      return cur
    }, [])
    return set
  }
  // 存之前过滤
  const filterValues = (list: any) => {
    // 谁可以写
    let data1 =
      list?.filter((item: { user_type: number }) => item.user_type === 1) || []
    //  汇报对象
    let data2 = list?.filter(
      (item: { user_type: number }) => item.user_type === 2,
    )
    //  谁可以看
    let data3 =
      list?.filter((item: { user_type: number }) => item.user_type === 3) || []
    const d1 = fitlerDataList(data1)
    const d2 = fitlerDataList(data2)
    const d3 = fitlerDataList(data3)
    return [...d1, ...d2, ...d3]
  }
  // 根据接口拆解数据
  const onChangeValues = (values: any, num: number) => {
    let d1: any = person1 || []
    let d2 = person2 || []
    let d3 = person3 || []
    if (num === 1) {
      const val1 =
        values?.map((el: any) => ({
          target_id: el.id || el.target_id,
          user_type: el.user_type,
          target_type: el.target_type,
          target_value: el.target_value,
        })) || []
      d1 = [...person1, ...val1]
    } else if (num === 2) {
      const val2 =
        values?.map((el: any) => ({
          target_id: el.id || el.target_id,
          user_type: el.user_type,
          target_type: el.target_type,
          target_value: el.target_value,
        })) || []
      d2 = [...person2, ...val2]
      setPerson2(d2)
    } else {
      const val3 =
        values?.map((el: any) => ({
          target_id: el.id || el.target_id,
          user_type: el.user_type,
          target_type: el.target_type,
          target_value: el.target_value,
        })) || []
      d3 = [...person3, ...val3]
    }
    const d3V = d3.find(
      (item: any) =>
        item.user_type === 3 &&
        (item.key === 'all' || item?.target_value?.key === 'all'),
    )
    const d1v = d1.find(
      (item: any) =>
        item.user_type === 1 &&
        (item.key === 'all' || item?.target_value?.key === 'all'),
    )
    dispatch(
      setReportContent({
        is_all_view: d3V ? 1 : 2,
        is_all_write: d1v ? 1 : 2,
        template_configs: [...d1, ...d2, ...d3],
      }),
    )
  }
  // 填写周期
  const onchange = (e: any) => {
    dispatch(setEditSave(false))
    dispatch(setErr(true))
    setType(e.target.value)
    let value = 0
    let start = null
    let end = null
    let reminder_time = 0
    switch (e.target.value) {
      case 'day':
        value = 1
        start = {
          day_type: 1,
          time: 0,
        }
        end = {
          day_type: 2,
          time: 0,
        }
        reminder_time = 2 * 60 * 60
        break
      case 'week':
        value = 2
        start = {
          day_type: 4,
          time: 0,
        }
        end = {
          day_type: 7,
          time: 0,
        }
        reminder_time = 172800
        break

      case 'month':
        value = 3
        start = {
          day_type: 25,
          time: 0,
        }
        end = {
          day_type: 34,
          time: 0,
        }
        reminder_time = 172800
        break
      default:
        value = 4
        reminder_time = 172800
        break
    }
    const claerConfig: any = {
      day: aWeekDataList,
      hand_scope: 1,
      is_submitter_edit: true,
      is_cycle_limit: true,
      is_supply: true,
      reminder_time,
      auto_reminder: true,
      submit_cycle: 1,
      is_holiday: true,
      end_time: end,
      start_time: start,
    }
    dispatch(setFillingRequirements({ ...claerConfig, submit_cycle: value }))
  }
  // 表单更新操作
  const formOnValuesChange = (values: any) => {
    dispatch(setFillingRequirements({ ...fillingRequirements, ...values }))
  }
  // 秒转成时分秒 b为true代表取天数
  const time2 = (b: boolean, num: any, str: string) => {
    let tt = 0
    let t1 = 0
    if (b) {
      tt = parseInt(String(num / 60 / 60 / 24), 10)
      t1 = tt ? tt * 60 * 60 * 24 : 0
    }
    const tv = num - t1
    let h: number = parseInt(String(tv / 60 / 60), 10)
    let hv = h * 60 * 60
    let m = tv - hv
    let mv = m / 60
    let time = 0
    if (str === 'day') {
      time = tt
    } else if (str === 'hour') {
      time = h
    } else {
      time = parseInt(String(mv), 10)
    }
    return time
  }
  // 组装数据
  const assemblyData = () => {
    // 谁可以写
    let data1 =
      reportContent.template_configs?.filter(
        (item: { user_type: number }) => item.user_type === 1,
      ) || []
    //  汇报对象
    let data2 = reportContent.template_configs?.filter(
      (item: { user_type: number }) => item.user_type === 2,
    )
    //  谁可以看
    let data3 =
      reportContent.template_configs?.filter(
        (item: { user_type: number }) => item.user_type === 3,
      ) || []
    // 有已经存在的情况，需要过滤掉
    if (reportContent.is_all_view === 1) {
      const newData3 = [
        {
          user_type: 3,
          key: 'all',
          name: '全员',
          avatar: '',
          target_id: -1,
          target_value: {
            user_type: 3,
            key: 'all',
            name: '全员',
            avatar: '',
          },
        },
        ...data3,
      ]
      const hasAll = data3.find((el: any) => el.target_value.key === 'all')
      setPerson3(hasAll ? data3 : newData3)
    }
    // 有已经存在的情况，需要过滤掉
    if (reportContent.is_all_write === 1) {
      const newData1 = [
        {
          user_type: 1,
          key: 'all',
          name: '全员',
          avatar: '',
          target_id: -1,
          target_value: {
            user_type: 1,
            key: 'all',
            name: '全员',
            avatar: '',
          },
        },
        ...data1,
      ]
      const hasAll = data1.find((el: any) => el.target_value.key === 'all')
      setPerson1(hasAll ? data1 : newData1)
    }
    reportContent.is_all_view === 2 && setPerson3(data3)
    reportContent.is_all_write === 2 && setPerson1(data1)
    setPerson2(data2)
  }
  useEffect(() => {
    reportContent && assemblyData()
  }, [reportContent])
  // 选人删除重新存
  const onChangedel = (el: any, num: number) => {
    let data1: any = person1 || []
    let data2: any = person2 || []
    let data3: any = person3 || []
    if (num === 1) {
      data1 = person1.filter((item: any) =>
        el?.target_id ? item?.target_id !== el?.target_id : el.key !== item.key,
      )
    } else if (num === 2) {
      data2 = person2.filter((item: any) => item.target_id !== el.target_id)
    } else {
      data3 = person3.filter((item: any) =>
        el?.target_id ? item?.target_id !== el?.target_id : el.key !== item.key,
      )
    }
    const v3 = data3.find(
      (item: any) =>
        item.user_type === 3 &&
        (item.key === 'all' || item.target_value?.key === 'all'),
    )
    const v1 = data1.find(
      (item: any) =>
        item.user_type === 1 &&
        (item.key === 'all' || item.target_value?.key === 'all'),
    )

    dispatch(
      setReportContent({
        is_all_view: v3 ? 1 : 2,
        is_all_write: v1 ? 1 : 2,
        template_configs: filterValues([...data1, ...data2, ...data3]),
      }),
    )
  }
  const timestampToTime = (timeVal: any) => {
    // 时间戳为10位需*1000，时间戳为13位不需乘1000
    let timeValLen = String(timeVal)
    let v = timeValLen.length === 13 ? timeVal : timeVal * 1000
    const time = timeVal ? moment(v).format('YYYY-MM-DD HH:mm:ss') : null
    return time
  }
  // 表单值处理，时间秒转换成展示的数字
  const setFormValues = throttle((obj: any) => {
    switch (obj?.submit_cycle) {
      case 1:
        setType('day')
        break
      case 2:
        setType('week')
        break
      case 3:
        setType('month')
        break
      case 4:
        setType('doNot')
        break
    }
    const newObj = { ...obj }
    if (obj?.submit_cycle === 1) {
      const newStartTime = {
        v1: obj?.start_time?.day_type,
        v2: time2(false, obj?.start_time?.time, 'hour'),
        v3: time2(false, obj?.start_time?.time, 'minute'),
      }
      const newEndTime = {
        v1: obj.end_time?.day_type,
        v2: time2(false, obj?.end_time?.time, 'hour'),
        v3: time2(false, obj?.end_time?.time, 'minute'),
      }
      const newReminderTime = {
        v2: time2(false, obj?.reminder_time, 'hour'),
        v3: time2(false, obj?.reminder_time, 'minute'),
      }
      newObj.start_time = newStartTime
      newObj.end_time = newEndTime
      newObj.reminder_time = newReminderTime
    } else if (obj?.submit_cycle === 2 || obj?.submit_cycle === 3) {
      const newStartTime = {
        v1: obj?.start_time?.day_type,
        v2: time2(false, obj?.start_time?.time, 'hour'),
        v3: time2(false, obj?.start_time?.time, 'minute'),
      }
      const newEndTime = {
        v1: obj?.end_time?.day_type,
        v2: time2(false, obj?.end_time?.time, 'hour'),
        v3: time2(false, obj?.end_time?.time, 'minute'),
      }
      const newReminderTime = {
        v1: time2(true, obj?.reminder_time, 'day'),
        v2: time2(true, obj?.reminder_time, 'hour'),
        v3: time2(true, obj?.reminder_time, 'minute'),
      }
      newObj.start_time = newStartTime
      newObj.end_time = newEndTime
      newObj.reminder_time = newReminderTime
    } else if (obj?.submit_cycle === 4) {
      const newEndTime = obj?.end_time ? timestampToTime(obj?.end_time) : null
      const newReminderTime = {
        v1: time2(true, obj?.reminder_time, 'day'),
        v2: time2(true, obj?.reminder_time, 'hour'),
        v3: time2(true, obj?.reminder_time, 'minute'),
      }
      newObj.end_time = newEndTime
      newObj.reminder_time = newReminderTime
    }
    form.setFieldsValue(newObj)
  }, 500)
  // 补交范围组数据
  const getHandScopeValue = (num: any, typeState: number) => {
    switch (typeState) {
      case 1:
        const item = dayData1.find((el: { key: number }) => el.key === num)
        return { label: t(`formWork.${item?.label}`), key: item?.key }
      case 2:
        const item1 = weekData.find((el: { key: number }) => el.key === num)
        return { label: t(`formWork.${item1?.label}`), key: item1?.key }
      case 3:
        const item2 = monthData.find((el: { key: number }) => el.key === num)
        return { label: t(`formWork.${item2?.label}`), key: item2?.key }
    }
  }
  useEffect(() => {
    const newVal = { ...fillingRequirements }
    // 补交范围改值
    const obj = getHandScopeValue(
      Number(newVal.hand_scope),
      newVal.submit_cycle,
    ) || { label: 1, key: 1 }
    newVal.hand_scope = obj
    fillingRequirements && setFormValues(newVal)
  }, [fillingRequirements])
  return (
    <PermissionConfigStyle>
      {/* 汇报内容 */}
      <div style={{ border: '1px solid #ECEDEF', borderRadius: 6 }}>
        <div
          onClick={() => setReport(!report)}
          style={{
            height: '56px',
            display: 'flex',
            alignItems: 'center',
            borderRadius: 6,
            justifyContent: 'space-between',
            paddingRight: '24px',
            cursor: 'pointer',
          }}
          className={bian2}
        >
          <Title headerTitle={t('formWork.title1')} onChange={() => {}} />
          <IconFont type={report ? 'up' : 'down'} />
        </div>
        {report ? (
          <div style={{ padding: ' 16px 32px ' }}>
            {/* 谁可以写 */}
            <Addperson
              onChangedel={val => onChangedel(val, 1)}
              onChangeValues={val => onChangeValues(val, 1)}
              person={person1}
              title={t('formWork.title2')}
              isShow={true}
              state={1}
            />
            {/* 汇报对象*/}
            <Addperson
              onChangedel={val => onChangedel(val, 2)}
              onChangeValues={val => onChangeValues(val, 2)}
              person={person2}
              title={t('formWork.title3')}
              isShow={false}
              state={2}
            />
            {/* 谁可以看 */}
            <Addperson
              onChangedel={val => onChangedel(val, 3)}
              onChangeValues={val => onChangeValues(val, 3)}
              person={person3}
              title={t('formWork.title4')}
              isShow={false}
              state={3}
            />
          </div>
        ) : null}
      </div>

      {/* 填写要求 */}
      <div
        style={{
          border: '1px solid #ECEDEF',
          borderRadius: 6,
          marginTop: '20px',
        }}
      >
        <div
          onClick={() => setFillIn(!fillIn)}
          style={{
            height: '56px',

            display: 'flex',
            alignItems: 'center',
            borderRadius: 6,
            justifyContent: 'space-between',
            paddingRight: '24px',
            cursor: 'pointer',
          }}
          className={bian2}
        >
          <Title
            headerTitle={t('formWork.title5')}
            msg={t('formWork.title6')}
            onChange={() => {}}
          />
          <IconFont type={fillIn ? 'up' : 'down'} />
        </div>
        {fillIn ? (
          <div style={{ marginLeft: '24px' }}>
            <TitleText style={{ marginTop: '20px' }}>
              {t('formWork.title7')}
            </TitleText>
            <Radio.Group
              style={{ margin: '8px 0 16px 0' }}
              value={type}
              onChange={e => {
                onchange(e)
              }}
            >
              <Radio value={'day'}>{t('formWork.title8')}</Radio>
              <Radio value={'week'}>{t('formWork.title9')}</Radio>
              <Radio value={'month'}>{t('formWork.title10')}</Radio>
              <Radio value={'doNot'}>{t('formWork.title11')}</Radio>
            </Radio.Group>
            <DayFormBox form={form} onValuesChange={formOnValuesChange}>
              <FormMain type={type} />
            </DayFormBox>
          </div>
        ) : null}
      </div>
    </PermissionConfigStyle>
  )
}
export default PermissionConfig
