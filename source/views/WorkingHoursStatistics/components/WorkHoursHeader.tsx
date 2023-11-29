/* eslint-disable react/jsx-handler-names */
import styled from '@emotion/styled'
import { Form, Input } from 'antd'
import MoreSelect from '@/components/MoreSelect'
import moment from 'moment'
import RangePicker from '@/components/RangePicker'
import { SelectWrapBedeck } from '@/components/StyleCommon'
import { useTranslation } from 'react-i18next'
import Tabs from '@/components/Tabs'
import CommonButton from '@/components/CommonButton'
import { useEffect, useState, useLayoutEffect } from 'react'
import Export from '@/components/Export'
import { getProjectMember } from '@/services/project'
import { cos } from '@/services'
import CommonInput from '@/components/CommonInput'
import InputSearch from '@/components/InputSearch'
import CommonIconFont from '@/components/CommonIconFont'
const WorkHoursHeaderWrap = styled.div`
  padding: 20px 0px 0px 0;
  margin-left: 24px;
  border-bottom: 1px solid var(--neutral-n6-d1);
`
const FormStyle = styled(Form)`
  display: flex;
  justify-content: space-between;
  .ant-form-item {
    margin: 0;
  }
`
const LeftWrap = styled.div`
  display: flex;
  align-items: center;
  min-height: 32px;
  flex-wrap: wrap;
`
const PersonWrap = styled.div`
  margin: 16px 0 28px 24px;
  background: var(--auxiliary-b5);
  border-radius: 6px;
  height: 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 12px;
  font-size: 14px;
  color: var(--neutral-n2);
`
const WorkHoursHeader = (props: {
  onSearch: (val: any, type: number) => void
  onGetExport: (val: any) => void
  stat: { total: number; report: number; absence: number; leave: number }
  id: number
}) => {
  const [form] = Form.useForm()
  const [t] = useTranslation()
  const [open, setOpen] = useState(false)
  const [time, setTime] = useState<any>([])
  const [dateType, setDateType] = useState<any>(1)
  const [state, setState] = useState<any>(0)
  const [state1, setState1] = useState<any>(3)
  const [memberList, setMemberList] = useState<any>([])
  const [dropdownMatchSelectWidth, setDropdownMatchSelectWidth] =
    useState<any>(0)
  const [statusWidth, setStatusWidth] = useState<any>(0)
  const confirm = () => {
    props.onSearch(form.getFieldsValue(), dateType)
  }
  useEffect(() => {
    setTime(getWeekDates())
    form.setFieldsValue({
      time: '',
      person: [],
      date: getWeekDates(),
      type: 0,
      state: 1,
      style: 'story',
    })
    setDateType(1)
    setState(0)
    props.onSearch(form.getFieldsValue(), 1)
    getList()
  }, [])
  useLayoutEffect(() => {
    const w = document
      .querySelector('#SelectWrap')
      ?.getBoundingClientRect().width
    setDropdownMatchSelectWidth(w)
    const statusW = document
      .querySelector('#statusSelectWrap')
      ?.getBoundingClientRect().width
    setDropdownMatchSelectWidth(w)
    setStatusWidth(statusW)
  }, [window.localStorage.getItem('language')])
  // 人员接口
  const getList = async () => {
    const result = await getProjectMember({
      projectId: props.id,
      all: 1,
    })
    setMemberList(
      result.map((el: any) => ({ ...el, label: el.name, value: el.id })),
    )
  }
  const onChangeTime = (dates: any) => {
    if (dates) {
      form.setFieldsValue({
        time: [
          moment(dates[0]).format('YYYY-MM-DD'),
          moment(dates[1]).format('YYYY-MM-DD'),
        ],
        date: [],
      })
      setTime([
        moment(dates[0]).format('YYYY-MM-DD'),
        moment(dates[1]).format('YYYY-MM-DD'),
      ])
      setDateType(-1)
    } else {
      setDateType(1)
      setTime(getWeekDates())
      form.setFieldsValue({ date: getWeekDates(), time: '' })
    }
    props.onSearch(form.getFieldsValue(), dates ? -1 : 1)
  }
  const tabsValue = [
    {
      id: 0,
      text: t('today'),
    },
    {
      id: 1,
      text: t('thisWeek'),
    },

    {
      id: 2,
      text: t('thisMonth'),
    },
  ]
  const tabsValue1 = [
    {
      id: 3,
      text: t('askForLeave'),
      label: t('askForLeave'),
      value: 3,
    },
    {
      id: 2,
      text: t('reportNormally'),
      label: t('reportNormally'),
      value: 2,
    },
    {
      id: 1,
      text: t('notReported'),
      label: t('notReported'),
      value: 1,
    },
    {
      id: 0,
      text: t('all'),
      label: t('all'),
      value: 0,
    },
  ]
  const tabsValue2 = [
    {
      id: 2,
      text: t('normal'),
    },
    {
      id: 1,
      text: t('overdue'),
    },
    {
      id: 0,
      text: t('all'),
    },
  ]
  // 按人员和按项目
  const tabsValuePersonAndTask = [
    {
      id: 0,
      text: '按人员',
    },
    {
      id: 1,
      text: '任务',
    },
  ]
  const onGetExportApi = () => {
    props.onGetExport(form.getFieldsValue())
  }
  // 获取每周
  const getWeekDates = () => {
    const d = getMonDate()
    let arr = []
    for (let i = 0; i < 7; i++) {
      arr.push(
        toTimeFormat(
          d.getFullYear() + '-' + (d.getMonth() + 1 + '-' + d.getDate()),
        ),
      )
      d.setDate(d.getDate() + 1)
    }
    const start = arr[0]
    const end = arr[6]
    return [start, end]
  }

  // 日期格式处理函数(自动补零)
  const toTimeFormat = (d: any) => {
    const arr = d.split('-')
    arr.forEach((item: any, index: number) => {
      arr[index] = item < 10 ? '0' + item : item
    })
    return arr.join('-')
  }
  // 获取当前星期一的日期对象
  const getMonDate = () => {
    const d = new Date()
    const day = d.getDay()
    const date = d.getDate()
    if (day === 1) return d
    if (day === 0) d.setDate(date - 6)
    else d.setDate(date - day + 1)
    return d
  }
  // 本月第一天和最后一天
  function getLastDay() {
    const y: any = new Date().getFullYear()
    let m: any = new Date().getMonth() + 1
    let d: any = new Date(y, m, 0).getDate()
    m = m < 10 ? '0' + m : m
    d = d < 10 ? '0' + d : d
    const start = [y, m, '01'].join('-')
    const end = [y, m, d].join('-')
    return [start, end]
  }
  const onChange = (val: number) => {
    switch (val) {
      case 0:
        setTime([moment(new Date()).format('YYYY-MM-DD')])
        setDateType(0)
        form.setFieldsValue({
          date: [moment(new Date()).format('YYYY-MM-DD')],
          time: '',
        })
        break
      case 1:
        setDateType(1)
        form.setFieldValue('time', '')
        setTime(getWeekDates())
        form.setFieldsValue({ date: getWeekDates(), time: '' })
        break
      case 2:
        setDateType(2)
        form.setFieldValue('time', '')
        setTime(getLastDay())
        form.setFieldsValue({ date: getLastDay(), time: '' })
        break
    }
    props.onSearch(form.getFieldsValue(), val)
  }

  const onChangeType = (val: number, num: number) => {
    num === 1
      ? form.setFieldValue('type', val)
      : form.setFieldValue('state', val)
    props.onSearch(form.getFieldsValue(), dateType)
  }
  const onChangeMode = (type: string) => {
    form.setFieldValue('style', type ? 'story' : 'member')
    props.onSearch(form.getFieldsValue(), dateType)
  }
  return (
    <>
      <WorkHoursHeaderWrap>
        <FormStyle name="basic" form={form} initialValues={{ remember: true }}>
          <LeftWrap>
            <div style={{ margin: '0 16px 20px 0px' }}>
              <Form.Item name="keyword">
                <Input
                  placeholder={t('search_for_transaction_name_or_number')}
                  onPressEnter={confirm}
                  allowClear
                  onChange={e => {
                    console.log('11', e.target.value)
                    if (!e.target.value) {
                      confirm()
                    }
                  }}
                  prefix={
                    <CommonIconFont
                      type="search"
                      size={16}
                      color="var(--neutral-n4)"
                    />
                  }
                ></Input>
              </Form.Item>
            </div>
            <SelectWrapBedeck style={{ marginBottom: 20 }} id="SelectWrap">
              <span style={{ margin: '0 16px', fontSize: '14px' }}>
                {t('personnel')}
              </span>
              <Form.Item name={'user_ids'}>
                <MoreSelect
                  onConfirm={confirm}
                  options={memberList}
                  width={dropdownMatchSelectWidth}
                />
              </Form.Item>
            </SelectWrapBedeck>
            <SelectWrapBedeck
              style={{ margin: '0 0px 20px 16px' }}
              id="statusSelectWrap"
            >
              <Form.Item name={'type'}>
                <MoreSelect
                  onConfirm={confirm}
                  options={tabsValue1}
                  width={statusWidth}
                  more
                  hiddernfooter
                />
              </Form.Item>
            </SelectWrapBedeck>

            <SelectWrapBedeck style={{ marginLeft: 16, marginBottom: 20 }}>
              <span style={{ margin: '0 16px', fontSize: '14px' }}>
                {t('time')}
              </span>
              <Form.Item name={'time'}>
                <RangePicker
                  width="235px"
                  isShowQuick={false}
                  dateValue={
                    form.getFieldValue('time')
                      ? [
                          moment(form.getFieldValue('time')[0]),
                          moment(form.getFieldValue('time')[1]),
                        ]
                      : null
                  }
                  onChange={dates => onChangeTime(dates)}
                  placement="bottomRight"
                />
              </Form.Item>
            </SelectWrapBedeck>
            <SelectWrapBedeck
              style={{ marginLeft: 16, marginBottom: 20, border: 'none' }}
            >
              <Form.Item name={'style'}>
                <Tabs
                  tabsValue={tabsValuePersonAndTask}
                  active={dateType}
                  onChange={onChangeMode}
                />
              </Form.Item>
            </SelectWrapBedeck>

            <SelectWrapBedeck
              style={{ margin: '0 16px 20px 16px', border: 'none' }}
            >
              <Form.Item name={'date'}>
                <Tabs
                  tabsValue={tabsValue}
                  active={dateType}
                  onChange={onChange}
                />
              </Form.Item>
            </SelectWrapBedeck>

            <SelectWrapBedeck
              style={{ margin: '0 16px 20px 0', border: 'none' }}
            >
              <Form.Item name={'state'}>
                <Tabs
                  tabsValue={tabsValue2}
                  active={form.getFieldValue('state')}
                  onChange={val => onChangeType(val, 2)}
                />
              </Form.Item>
            </SelectWrapBedeck>
          </LeftWrap>
          <CommonButton type="primary" onClick={() => setOpen(true)}>
            {t('exportRecords')}
          </CommonButton>
        </FormStyle>
      </WorkHoursHeaderWrap>
      <PersonWrap
        style={{ width: localStorage.language === 'zh' ? '339px' : '667px' }}
      >
        <span>
          {t('numberOfPeopleReported')}: {props.stat?.report}/
          {props.stat?.total}
        </span>
        <span>
          {t('numberOfPeopleAskingForLeave')}: {props.stat?.leave}
        </span>
        <span>
          {t('underreporting')}: {props.stat?.absence}
        </span>
      </PersonWrap>
      {/* 导出 */}
      <Export
        time={time?.length > 1 ? `${time[0]} ~ ${time[1]}` : time[0]}
        title={t('performance.exportTitle')}
        isVisible={open}
        onClose={() => setOpen(false)}
        onConfirm={() => {
          setOpen(false), onGetExportApi()
        }}
        personData={[]}
      />
    </>
  )
}
export default WorkHoursHeader
