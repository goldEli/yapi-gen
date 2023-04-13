/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable react/jsx-handler-names */
/* eslint-disable camelcase */
/* eslint-disable no-constant-binary-expression */
// eslint-disable radix
import styled from '@emotion/styled'
import { useEffect, useState } from 'react'
import Addperson from './Addperson'
import Title from './Title'
import FormMain from './FormMain'
import { Form, Radio } from 'antd'
import { useDispatch, useSelector } from '@store/index'
import DeleteConfirm from '@/components/DeleteConfirm'
import {
  setReportContent,
  setFillingRequirements,
  setAWeekDataList,
} from '@store/formWork'
import moment from 'moment'
const PermissionConfigStyle = styled.div`
  padding: 0 24px;
`
const TitleText = styled.div`
  font-size: 14px;
  color: var(--neutral-n1-d1);
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
  // 汇报内容是否展开
  const [report, setReport] = useState(true)
  const [fillIn, setFillIn] = useState(true)
  // 每天 day ,每周 week , 每月 month , 不重复doNot
  const [type, setType] = useState<string>('day')
  const [form] = Form.useForm()
  const [delIsVisible, setDelIsVisible] = useState(false)
  const { fillingRequirements, reportContent, aWeekDataList } = useSelector(
    store => store.formWork,
  )
  const [person1, setPerson1] = useState<any>()
  const [person2, setPerson2] = useState<any>()
  const [person3, setPerson3] = useState<any>()
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
  const onChangeValues = (values: any) => {
    let isAllWrite = 2
    let isAllView = 2
    values.forEach((item: any) => {
      if (item.user_type === 1 && item.key === 'all') {
        // 全员写
        isAllWrite = 1
      } else if (item.user_type === 3 && item.key === 'all') {
        // 全员看
        isAllView = 1
      }
    })
    // 部门的数据重新set 组装成员的数据 需要截取掉之前拼接的字符窜
    const setData =
      values
        ?.filter((el: any) => String(el?.id)?.includes('department_id_'))
        ?.map((el: any) => ({
          target_id: Number(el.id.slice(14)),
          user_type: el.user_type,
          target_type: el.target_type,
          target_value: el.target_value,
        })) || []
    // 团队的数据
    const setData1 =
      values
        ?.filter(
          (el: any) => !String(el?.id)?.includes('department_id_') && el?.id,
        )
        ?.map((el: any) => ({
          target_id: el.id,
          user_type: el.user_type,
          target_type: el.target_type,
          target_value: el.target_value,
        })) || []
    // 管理人员
    const setData2 = values?.filter(
      (el: { target_type: number }) => el.target_type === 4,
    )
    // 最终的大数组-- 人员
    const configsData = [...setData, ...setData1, ...setData2]
    dispatch(
      setReportContent({
        is_all_view: isAllView,
        is_all_write: isAllWrite,
        template_configs: filterValues([
          ...reportContent.template_configs,
          ...configsData,
        ]),
      }),
    )
  }

  // 填写周期
  const onchange = (e: any) => {
    setType(e.target.value)
    let value = 0
    switch (e.target.value) {
      case 'day':
        value = 1
        break
      case 'week':
        value = 2
        break
      case 'month':
        value = 3
        break
      default:
        value = 4
        break
    }
    dispatch(
      setFillingRequirements({ ...fillingRequirements, submit_cycle: value }),
    )
  }
  // 表单更新操作
  const formOnValuesChange = (values: any) => {
    dispatch(setFillingRequirements({ ...fillingRequirements, ...values }))
  }
  // 秒转成时分秒
  const time2 = (num: any, str: string) => {
    let t: any = parseInt(String(num / 60 / 60 / 24), 10)
    const t1 = t * 60 * 60 * 24
    const tv = num - t1
    let h: number = parseInt(String(tv / 60 / 60), 10)
    let hv = h * 60 * 60
    let m = tv - hv
    let mv = m / 60
    let time = 0
    if (str === 'day') {
      time = t
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
          name: '全部',
          avatar: '',
          target_value: {
            user_type: 3,
            key: 'all',
            name: '全部',
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
          name: '全部',
          avatar: '',
          target_value: {
            user_type: 1,
            key: 'all',
            name: '全部',
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
  // 删除重新存
  const onChangedel = (el: any, num: number) => {
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
    if (num === 1) {
      data1 = data1.filter((item: any) => item.target_id !== el.target_id)
    } else if (num === 2) {
      data2 = data2.filter((item: any) => item.target_id !== el.target_id)
    } else {
      data3 = data3.filter((item: any) => item.target_id !== el.target_id)
    }
    dispatch(
      setReportContent({
        is_all_view: reportContent.is_all_view,
        is_all_write: reportContent.is_all_write,
        template_configs: filterValues([...data1, ...data2, ...data3]),
      }),
    )
  }
  const timestampToTime = (timeVal: any) => {
    // 时间戳为10位需*1000，时间戳为13位不需乘1000
    const time = moment(timeVal * 1000).format('YYYY-MM-DD HH:mm:ss')
    return time
  }
  const setFormValues = () => {
    switch (fillingRequirements?.submit_cycle) {
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
    const newObj = { ...fillingRequirements }
    // console.log(fillingRequirements, 'fillingRequirements')
    if (fillingRequirements?.submit_cycle === 1) {
      const nowData = aWeekDataList
      const newData = fillingRequirements?.day
      const arr = nowData.map((item: any) => ({
        ...item,
        value: newData?.includes(item.key) ? true : false,
      }))
      newObj.day = arr
      const newStartTime = {
        v1: fillingRequirements?.start_time?.day_type,
        v2: time2(fillingRequirements?.start_time?.time, 'hour'),
        v3: time2(fillingRequirements?.start_time?.time, 'minute'),
      }
      const newEndTime = {
        v1: fillingRequirements.end_time?.day_type,
        v2: time2(fillingRequirements?.end_time?.time, 'hour'),
        v3: time2(fillingRequirements?.end_time?.time, 'minute'),
      }
      const newReminderTime = {
        v2: time2(fillingRequirements?.reminder_time, 'hour'),
        v3: time2(fillingRequirements?.reminder_time, 'minute'),
      }
      newObj.start_time = newStartTime
      newObj.end_time = newEndTime
      newObj.reminder_time = newReminderTime
    } else if (fillingRequirements?.submit_cycle === 2) {
      const newStartTime = {
        v1: fillingRequirements?.start_time?.day_type,
        v2: time2(fillingRequirements?.start_time?.time, 'hour'),
        v3: time2(fillingRequirements?.start_time?.time, 'minute'),
      }
      const newEndTime = {
        v1: fillingRequirements?.end_time?.day_type,
        v2: time2(fillingRequirements?.end_time?.time, 'hour'),
        v3: time2(fillingRequirements?.end_time?.time, 'minute'),
      }
      const newReminderTime = {
        v1: time2(fillingRequirements?.reminder_time, 'day'),
        v2: time2(fillingRequirements?.reminder_time, 'hour'),
        v3: time2(fillingRequirements?.reminder_time, 'minute'),
      }
      newObj.start_time = newStartTime
      newObj.end_time = newEndTime
      newObj.reminder_time = newReminderTime
    } else if (fillingRequirements?.submit_cycle === 3) {
      const newStartTime = {
        v1: fillingRequirements.start_time?.day_type,
        v2: time2(fillingRequirements?.start_time?.time, 'hour'),
        v3: time2(fillingRequirements?.start_time?.time, 'minute'),
      }
      const newEndTime = {
        v1: fillingRequirements.end_time?.day_type,
        v2: time2(fillingRequirements?.end_time?.time, 'hour'),
        v3: time2(fillingRequirements?.end_time?.time, 'minute'),
      }
      const newReminderTime = {
        v1: time2(fillingRequirements?.reminder_time, 'day'),
        v2: time2(fillingRequirements?.reminder_time, 'hour'),
        v3: time2(fillingRequirements?.reminder_time, 'minute'),
      }
      newObj.start_time = newStartTime
      newObj.end_time = newEndTime
      newObj.reminder_time = newReminderTime
    } else if (fillingRequirements?.submit_cycle === 4) {
      const newEndTime = timestampToTime(
        fillingRequirements?.end_time?.time || fillingRequirements?.end_time,
      )
      const newReminderTime = {
        v1: time2(fillingRequirements?.reminder_time, 'day'),
        v2: time2(fillingRequirements?.reminder_time, 'hour'),
        v3: time2(fillingRequirements?.reminder_time, 'minute'),
      }
      newObj.end_time = newEndTime
      newObj.reminder_time = newReminderTime
    }
    form.setFieldsValue(newObj)
  }
  useEffect(() => {
    fillingRequirements && setFormValues()
  }, [fillingRequirements])

  return (
    <PermissionConfigStyle>
      {/* 汇报内容 */}
      <Title
        headerTitle="汇报内容"
        onChange={(val: boolean) => setReport(val)}
      />
      {report ? (
        <>
          {/* 谁可以写 */}
          <Addperson
            onChangedel={val => onChangedel(val, 1)}
            onChangeValues={val => onChangeValues(val)}
            person={person1}
            title="谁可以写"
            isShow={true}
            state={1}
          />
          {/* 汇报对象*/}
          <Addperson
            onChangedel={val => onChangedel(val, 2)}
            onChangeValues={val => onChangeValues(val)}
            person={person2}
            title="汇报对象"
            isShow={false}
            state={2}
          />
          {/* 谁可以看 */}
          <Addperson
            onChangedel={val => onChangedel(val, 3)}
            onChangeValues={val => onChangeValues(val)}
            person={person3}
            title="谁可以看"
            isShow={false}
            state={3}
          />
        </>
      ) : null}
      {/* 填写要求 */}
      <Title
        headerTitle="填写要求"
        msg="将直接填写要求统计提交情况"
        onChange={(val: boolean) => setFillIn(val)}
      />
      {fillIn ? (
        <div style={{ marginLeft: '24px' }}>
          <TitleText>填写周期</TitleText>
          <Radio.Group
            style={{ margin: '8px 0 16px 0' }}
            value={type}
            onChange={e => {
              onchange(e)
            }}
          >
            <Radio value={'day'}>每天</Radio>
            <Radio value={'week'}>每周</Radio>
            <Radio value={'month'}>每月</Radio>
            <Radio value={'doNot'}>不重复</Radio>
          </Radio.Group>
          <DayFormBox form={form} onValuesChange={formOnValuesChange}>
            <FormMain type={type} />
          </DayFormBox>
          {/* <div onClick={() => console.log(form?.getFieldsValue(), 999)}>123</div> */}
        </div>
      ) : null}

      {/* 未保存的弹窗 */}
      <DeleteConfirm
        title={'保存提示'}
        text="【模版名称】还未保存，是否保存编辑内容？"
        isVisible={delIsVisible}
        onConfirm={() => setDelIsVisible(false)}
        notCancel
      />
    </PermissionConfigStyle>
  )
}
export default PermissionConfig
