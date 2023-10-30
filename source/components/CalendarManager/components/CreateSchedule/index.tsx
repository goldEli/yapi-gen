/* eslint-disable no-constant-binary-expression */
/* eslint-disable react/jsx-no-leaked-render */
import CommonButton from '@/components/CommonButton'
import CommonModal from '@/components/CommonModal'
import { CloseWrap, ModalFooter } from '@/components/StyleCommon'
import { setScheduleModal } from '@store/calendar'
import { useDispatch, useSelector } from '@store/index'
import {
  Checkbox,
  DatePicker,
  Drawer,
  Form,
  Input,
  InputRef,
  Popover,
  Radio,
  Select,
  message,
} from 'antd'
import {
  CreateContentAll,
  CreateFormAll,
  CreateFormItemWrap,
  CreateScheduleChecks,
  EasyScheduleHeader,
  ItemFlex,
  NoticeBox,
  ParticipantItem,
  ParticipantItems,
  RepeatTextWrap,
  TimeWrap,
} from '../../styles'
import IconFont from '@/components/IconFont'
import { createRef, useEffect, useRef, useState } from 'react'
import CommonUserAvatar from '@/components/CommonUserAvatar'
import { CheckboxValueType } from 'antd/lib/checkbox/Group'
import { DatePickerProps, RangePickerProps } from 'antd/lib/date-picker'
import { CheckboxChangeEvent } from 'antd/lib/checkbox'
import moment from 'moment'
import RepeatModal from './RepeatModal'
import UploadAttach from '@/components/UploadAttach'
import CreateVisualization from './CreateVisualization'
import { modifySchedule, saveSchedule } from '@store/schedule/schedule.thunk'
import { useTranslation } from 'react-i18next'
import { getScheduleInfo } from '@/services/schedule'
import { setVisualizationTime, setIsAddOrDelete } from '@store/schedule'
import { getMessage } from '@/components/Message'
import NewAddUserModalForTandD from '@/components/NewAddUserModal/NewAddUserModalForTandD/NewAddUserModalForTandD'
interface DefaultTime {
  value?: number
  id: number
}

interface CreateFormItemProps {
  type: string
  label: string
}

const CreateFormItem = (props: CreateFormItemProps) => {
  return (
    <CreateFormItemWrap>
      <IconFont type={props.type} className="icon" />
      <div>{props.label}</div>
    </CreateFormItemWrap>
  )
}

const CreateSchedule = () => {
  const [t] = useTranslation()
  const attachRef: any = createRef()
  const dispatch = useDispatch()
  // const leftDom = useRef<Ref<FormInstance<unknown>>>()
  const inputDom = useRef<InputRef | null>(null)
  const { scheduleModal, relateConfig, calendarData, calendarConfig } =
    useSelector(store => store.calendar)
  const { userInfo } = useSelector(store => store.user)
  const { visualizationTime } = useSelector(store => store.schedule)
  const [form] = Form.useForm()
  const [calendarCategory, setCalendarCategory] = useState<
    Model.Calendar.Info[]
  >([])
  const leftWidth = 1020
  const [isVisible, setIsVisible] = useState(false)
  // 当前日程所在日是否在我管理里
  const [hasCalendar, setHasCalendar] = useState<{
    label: string
    value: number
  }>({ label: '', value: 0 })
  // 创建日历默认主题色
  const [normalCategory, setNormalCategory] = useState({
    color: 0,
    calendar_id: 0,
  })
  // 选择成员显示
  const [isChooseVisible, setIsChooseVisible] = useState(false)
  // 忙碌或者空闲
  const [status, setStatus] = useState(1)
  // 是否是全天
  const [isAll, setIsAll] = useState<boolean | undefined>(false)
  //   重复
  const [repeatValue, setRepeatValue] = useState<{
    value?: number
    params: any
  }>({
    value: 0,
    params: {},
  })
  // 重复弹窗
  const [isRepeatVisible, setIsRepeatVisible] = useState(false)
  // 当前选择的重复值
  const [currentRepeat, setCurrentRepeat] = useState<number>(0)
  const [time, setTime] = useState<any>()
  // 参与者
  const [participant, setParticipant] = useState<{
    list: Model.Calendar.MemberItem[]
    permission: CheckboxValueType[]
  }>({
    list: [],
    permission: [0],
  })
  // 提醒
  const [noticeList, setNoticeList] = useState<DefaultTime[]>([])
  //   附件
  const [attachList, setAttachList] = useState<any>([])

  // 参与者的权限
  const checkboxOptions = [
    { label: t('calendarManager.modifiable_schedule'), value: 0 },
    // { label: t('calendarManager.invite_participants'), value: 1 },
  ]

  // 关闭弹窗
  const onClose = () => {
    dispatch(setScheduleModal({ visible: false, params: {} }))
    form.resetFields()
    setAttachList([])
    setNoticeList([])
    setCurrentRepeat(0)
    setParticipant({
      list: [],
      permission: [],
    })
    setTime(null)
    setNormalCategory({
      color: 0,
      calendar_id: 0,
    })
    setIsAll(false)
    setRepeatValue({
      value: 0,
      params: {},
    })
    setStatus(1)
  }

  // 保存
  const onConfirm = async (next?: boolean) => {
    if (attachRef.current?.getAttachState() > 0) {
      getMessage({
        type: 'warning',
        msg: t('theFileIsBeingPleaseWait'),
      })
      return
    }
    await form.validateFields()
    let values = form.getFieldsValue()
    // 选择的结束重复时间不能小于选择的结束时间
    if (repeatValue.params.repeat_end_type === 1) {
      const endTime = moment(values.time[1], 'YYYY-MM-DD HH:mm:ss')
      const repeatEndTime = moment(
        repeatValue.params.repeat_end_date,
        'YYYY-MM-DD HH:mm:ss',
      )
      if (endTime.diff(repeatEndTime) > 0) {
        getMessage({
          msg: t(
            'calendarManager.end_repeat_time_cannot_be_less_than_end_time',
          ),
          type: 'warning',
        })
        return
      }
    }
    const repeatValueParams = repeatValue.value ? { ...repeatValue.params } : {}
    values.is_busy = status
    values.is_all_day = isAll ? 1 : 2
    values.repeat_type = repeatValue.value
    values.members = participant.list.map((i: Model.Calendar.MemberItem) => ({
      user_id: i.id,
      company_id: userInfo.company_id,
    }))
    values.reminds = noticeList.map((i: DefaultTime) => i.value)
    if (participant.list.length > 0) {
      values.permission_update = participant.permission.includes(0) ? 1 : 2
      values.permission_invite = participant.permission.includes(1) ? 1 : 2
    }
    const resultParams = {
      ...values,
      ...{
        color: normalCategory.color,
        calendar_id: normalCategory.calendar_id,
      },
      ...{ ...repeatValueParams },
    }

    resultParams.start_datetime = isAll
      ? moment(values.time[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss')
      : moment(values.time[0]).format('YYYY-MM-DD HH:mm:ss')
    resultParams.end_datetime = isAll
      ? moment(values.time[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss')
      : moment(values.time[1]).format('YYYY-MM-DD HH:mm:ss')
    delete resultParams.time

    if (
      moment(resultParams.start_datetime).format('x') ===
      moment(resultParams.end_datetime).format('x')
    ) {
      getMessage({ msg: t('calendarManager.time_limit'), type: 'warning' })
      return
    }

    if (scheduleModal?.params?.id) {
      await dispatch(
        modifySchedule({
          ...resultParams,
          ...{ schedule_id: scheduleModal?.params?.id },
        }),
      )
      onClose()
      message.success(t('calendarManager.editSuccess'))
    } else {
      await dispatch(saveSchedule(resultParams))
      message.success(t('calendarManager.createSuccess'))
      dispatch(setIsAddOrDelete(true))
      if (next) {
        dispatch(
          setScheduleModal({
            ...scheduleModal,
            params: {
              isAll,
              permission: resultParams.permission,
              startTime: resultParams.start_datetime,
              endTime: resultParams.end_datetime,
            },
          }),
        )
      } else {
        onClose()
      }
    }
  }

  // 选中的共享成员
  const onAddConfirm = (list: Model.Calendar.MemberItem[]) => {
    const newList = [...participant.list, ...list]
    let obj: any = {}
    const result: Model.Calendar.MemberItem[] = newList.reduce(
      (cur: Model.Calendar.MemberItem[], next: Model.Calendar.MemberItem) => {
        obj[next.id] ? '' : (obj[next.id] = true && cur.push(next))
        return cur
      },
      [],
    )
    setParticipant({ ...participant, ...{ list: result } })
    setIsChooseVisible(false)
  }

  // 删除已选择的参与者
  const onDeleteParticipant = (item: Model.Calendar.MemberItem) => {
    const resultList = participant.list.filter(
      (i: Model.Calendar.MemberItem) => i.id !== item.id,
    )
    setParticipant({ ...participant, ...{ list: resultList } })
  }

  // 是否是全天
  const onChangeIsAll = (e: CheckboxChangeEvent) => {
    setIsAll(e.target.checked)
    setNoticeList([])
    const format = e.target.checked ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm:ss'
    const startTime = new Date()
    const endTime = new Date(
      new Date().setSeconds(
        new Date().getSeconds() +
          (calendarConfig.schedule_configs?.schedule_default_duration || 0),
      ),
    )
    // 通知右侧可视化
    dispatch(
      setVisualizationTime({
        startTime: moment(startTime).format(format),
        endTime: moment(endTime).format(format),
      }),
    )
  }

  //   修改重复
  const onChangeRepeat = (value: number) => {
    // 是否可操作重复限制
    const limitDay = [0, 1, 1, 31, 366]
    if (!time) {
      message.warning(t('calendarManager.please_select_a_time'))
      return
    }
    const startTime = isAll ? moment(time[0]).startOf('day') : moment(time[0])
    const endTime = isAll ? moment(time[1]).endOf('day') : moment(time[1])

    // 计算日期相差多少
    const difference = moment(
      moment(endTime).format('YYYY-MM-DD HH:mm:ss'),
    ).diff(moment(startTime).format('YYYY-MM-DD HH:mm:ss'))

    if (value === 0) {
      setRepeatValue({ value, params: {} })
    } else {
      if (difference / 86400000 > limitDay[value]) {
        message.warning(
          t(
            'calendarManager.only_schedule_repeats_with_a_duration_of_days_are_supported',
            {
              value: limitDay[value],
            },
          ),
        )
        return
      }
      setIsRepeatVisible(true)
      setCurrentRepeat(value)
    }
  }

  // 重复小弹窗确认事件
  const onRepeatConfirm = (params: any) => {
    setRepeatValue({ value: currentRepeat, params })
  }

  // 添加提醒
  const onAddNotice = () => {
    const list = [
      ...[
        {
          id: new Date().getTime(),
          value: isAll
            ? calendarConfig.notification_configs?.all_day_remind
            : calendarConfig.notification_configs?.not_all_day_remind,
        },
      ],
      ...noticeList,
    ]
    setNoticeList(list)
  }

  // 删除添加的提醒
  const onDeleteNotice = (id: number) => {
    const result = noticeList.filter((i: DefaultTime) => i.id !== id)
    setNoticeList(result)
  }

  // 修改提醒
  const onChangeNotice = (value: number, id: number) => {
    const result = noticeList.map((i: DefaultTime) => ({
      ...i,
      value: i.id === id ? value : i.value,
    }))
    setNoticeList(result)
  }

  //   修改附件
  const onChangeAttachment = (result: any) => {
    form.setFieldsValue({
      files: result.map((i: any) => ({
        url: i.url,
        size: i.size,
        name: i.name,
        suffix: i.ext,
      })),
    })
  }

  // 获取日程详情
  const getScheduleInfoData = async (list: Model.Calendar.Info[]) => {
    const scheduleInfo = await getScheduleInfo({
      id:
        (scheduleModal.params?.id ?? scheduleModal.params?.copyScheduleId) || 0,
    })
    const resultTime = [
      moment(
        scheduleInfo.is_all_day === 1
          ? scheduleInfo.start_date
          : scheduleInfo.start_datetime,
      ),
      moment(
        scheduleInfo.is_all_day === 1
          ? scheduleInfo.end_date
          : scheduleInfo.end_datetime,
      ),
    ]
    form.setFieldsValue({
      subject: scheduleInfo.subject,
      permission: scheduleInfo.permission,
      time: resultTime,
      describe: scheduleInfo.describe,
    })
    setIsAll(scheduleInfo.is_all_day === 1)
    const hasStateList = list.filter(
      (i: Model.Calendar.Info) => i.calendar_id === scheduleInfo.calendar_id,
    )
    setHasCalendar(
      hasStateList?.length > 0
        ? { label: '', value: 0 }
        : {
            label: scheduleInfo.calendar_name || '',
            value: scheduleInfo.calendar_id || 0,
          },
    )
    setNormalCategory({
      color: scheduleInfo.color,
      calendar_id: scheduleInfo.calendar_id,
    })
    setStatus(scheduleInfo.is_busy)
    setRepeatValue({
      value: scheduleInfo.repeat_type,
      params: {
        repeat_interval: scheduleInfo.repeat_interval,
        repeat_end_type: scheduleInfo.repeat_end_type,
        repeat_end_date: scheduleInfo.repeat_end_date,
        repeat_end_num: scheduleInfo.repeat_end_num,
        repeat_choose: scheduleInfo.repeat_choose,
      },
    })
    setTime(resultTime)
    // 参与者权限
    let participantPermission = []
    if (scheduleInfo.permission_update === 1) {
      participantPermission.push(0)
    }
    if (scheduleInfo.permission_invite === 1) {
      participantPermission.push(1)
    }
    setParticipant({
      list: scheduleInfo.members?.map((i: any) => ({
        id: i.user_id,
        avatar: i.user.avatar,
        name: i.user.name,
      })) as Model.Calendar.MemberItem[],
      permission: participantPermission,
    })
    setNoticeList(
      scheduleInfo.reminds?.map((i: any) => ({
        id: new Date().getTime() + Math.random(),
        value: i.before_time,
      })) as DefaultTime[],
    )
    setAttachList(
      scheduleInfo?.files?.map((i: any) => ({
        url: i.url,
        id: new Date().getTime() + Math.random() + i.user_id,
        size: i.size,
        time: i.created_at,
        name: i.name || '--',
        suffix: i.suffix,
        username: i.user.name ?? '--',
      })),
    )
  }

  // 简易弹窗更多选项
  const getEasyInfo = () => {
    const resultTime = [
      moment(scheduleModal?.params?.startTime),
      moment(scheduleModal?.params?.endTime),
    ]
    form.setFieldsValue({
      subject: scheduleModal?.params?.subject,
      time: resultTime,
      describe: scheduleModal?.params?.describe,
    })
    setIsAll(scheduleModal?.params?.isAll)
    setNormalCategory(
      scheduleModal?.params?.normalCategory || {
        color: 0,
        calendar_id: 0,
      },
    )
    setNoticeList(scheduleModal.params?.noticeList || [])
    setParticipant(
      scheduleModal.params?.participant || {
        list: [],
        permission: [],
      },
    )
  }

  // 修改时间
  const onChangeTime = (
    value: DatePickerProps['value'] | RangePickerProps['value'],
    dateString: [string, string] | string,
  ) => {
    setTime(value)
    // 通知右侧可视化
    dispatch(
      setVisualizationTime({
        startTime: dateString[0],
        endTime: dateString[1],
      }),
    )
  }

  // 获取重复文字
  const getRepeatText = () => {
    let text
    const lastText =
      repeatValue.params.repeat_end_type === 1
        ? `${t('calendarManager.repeat_end_time')}${
            repeatValue.params.repeat_end_date
          }`
        : `${t('calendarManager.repeat_end_count')}${
            repeatValue.params.repeat_end_num
          }`
    if (repeatValue.value === 1) {
      text = t('calendarManager.day_repeat', {
        num: repeatValue.params.repeat_interval,
      })
    } else if (repeatValue.value === 2) {
      const weekList = [
        t('calendarManager.weekday'),
        t('calendarManager.monday1'),
        t('calendarManager.tuesday'),
        t('calendarManager.wednesday'),
        t('calendarManager.thursday'),
        t('calendarManager.friday'),
        t('calendarManager.saturday1'),
      ]
      let resultWeek: string[] = []
      repeatValue.params.repeat_choose.forEach((element: number) => {
        resultWeek.push(weekList[element])
      })
      text = t('calendarManager.week_repeat', { text: resultWeek.join('、') })
    } else if (repeatValue.value === 3) {
      text = t('calendarManager.month_repeat', {
        num: repeatValue.params.repeat_interval,
      })
    } else {
      text = t('calendarManager.year_repeat', {
        num: repeatValue.params.repeat_interval,
      })
    }
    return text + lastText
  }

  // 更新右侧可视化调整时间
  useEffect(() => {
    const resultTime = [
      moment(visualizationTime?.startTime),
      moment(visualizationTime?.endTime),
    ]
    setTime(resultTime)
    form.setFieldsValue({
      time: resultTime,
    })
  }, [visualizationTime])

  useEffect(() => {
    if (scheduleModal.visible) {
      // 获取日历列表，并且过滤出可创建日程的日历
      setCalendarCategory(calendarData.manager)
      // 默认日历列表第一条
      setNormalCategory(calendarData.manager[0])
      setIsAll(scheduleModal.params?.isAll)

      // 通知右侧可视化
      dispatch(
        setVisualizationTime({
          startTime: scheduleModal.params?.startTime,
          endTime: scheduleModal.params?.endTime,
        }),
      )
      // 公开范围默认 为默认
      form.setFieldsValue({
        permission: scheduleModal.params?.permission ?? 1,
      })
      if (scheduleModal?.params?.id || scheduleModal?.params?.copyScheduleId) {
        // 调用日程详情接口
        getScheduleInfoData(calendarData.manager)
      }
      // 从简易弹窗跳转过来
      if (scheduleModal?.params?.subject) {
        // 调用日程详情接口
        getEasyInfo()
      }
      setTimeout(() => {
        inputDom?.current?.focus()
      }, 100)
    }
  }, [scheduleModal])
  return (
    <>
      <RepeatModal
        entTime={time ? time[1] : ''}
        repeatParams={repeatValue}
        isVisible={isRepeatVisible}
        title={relateConfig.schedule.repeat_types[currentRepeat]?.label}
        currentRepeat={currentRepeat}
        onRepeatConfirm={onRepeatConfirm}
        onClose={() => {
          setIsRepeatVisible(false)
          setCurrentRepeat(0)
        }}
      />
      <NewAddUserModalForTandD
        title={t('calendarManager.add_a_member')}
        state={2}
        isVisible={isChooseVisible}
        onConfirm={onAddConfirm}
        onClose={() => setIsChooseVisible(false)}
      />
      <Drawer
        closable={false}
        placement="right"
        bodyStyle={{ padding: 0, position: 'relative' }}
        width={leftWidth}
        open={scheduleModal.visible}
        onClose={onClose}
        destroyOnClose
        // mask={false}
        className="drawerRoot"
      >
        <EasyScheduleHeader>
          <span>
            {scheduleModal?.params?.id
              ? t('calendarManager.edit_schedule')
              : t('calendarManager.create_schedule')}
          </span>
          <CloseWrap onClick={onClose} width={32} height={32}>
            <IconFont
              style={{ fontSize: 20, color: 'var(--neutral-n2)' }}
              type="close"
            />
          </CloseWrap>
        </EasyScheduleHeader>
        <CreateContentAll>
          <CreateFormAll
            // ref={leftDom}
            scrollToFirstError
            form={form}
            layout="vertical"
            className="haveRight"
          >
            <Form.Item
              label={
                <CreateFormItem
                  label={t('calendarManager.theme')}
                  type="database"
                />
              }
              name="subject"
              rules={[{ required: true, message: '' }]}
            >
              <Input
                autoComplete="off"
                placeholder={t('calendarManager.please_enter_a_theme')}
                maxLength={80}
                ref={inputDom}
                autoFocus
              />
            </Form.Item>
            <TimeWrap>
              <Form.Item
                label={
                  <CreateFormItem
                    label={t('calendarManager.time')}
                    type="time"
                  />
                }
                name="time"
                rules={[{ required: true, message: '' }]}
                style={{ margin: 0, width: '82%' }}
              >
                <DatePicker.RangePicker
                  style={{ width: '100%' }}
                  showTime={!isAll}
                  onChange={onChangeTime}
                  allowClear={false}
                />
              </Form.Item>
              <Checkbox checked={isAll} onChange={onChangeIsAll}>
                {t('calendarManager.all_day_long')}
              </Checkbox>
            </TimeWrap>
            <Form.Item style={{ width: '82%', marginTop: 8 }}>
              <Select
                className="select"
                value={repeatValue.value}
                options={relateConfig.schedule.repeat_types}
                onSelect={onChangeRepeat}
                getPopupContainer={n => n}
              />
              {repeatValue.value !== 0 && (
                <RepeatTextWrap>{getRepeatText()}</RepeatTextWrap>
              )}
            </Form.Item>
            <ItemFlex style={{ margin: '24px 0' }}>
              <div className="box">
                <CreateFormItem
                  type="team"
                  label={t('calendarManager.participant')}
                />
                <CloseWrap
                  width={24}
                  height={24}
                  onClick={() => setIsChooseVisible(true)}
                >
                  <IconFont type="plus" style={{ fontSize: 18 }} />
                </CloseWrap>
              </div>
              <ParticipantItems>
                {participant.list.map((i: Model.Calendar.MemberItem) => (
                  <ParticipantItem key={i.id}>
                    <CommonUserAvatar avatar={i.avatar} name={i.name} />
                    <IconFont
                      onClick={() => onDeleteParticipant(i)}
                      className="icon"
                      type="close"
                    />
                  </ParticipantItem>
                ))}
              </ParticipantItems>
              {participant.list.length > 0 && (
                <CreateScheduleChecks size={24}>
                  <Checkbox.Group
                    options={checkboxOptions}
                    value={participant.permission}
                    onChange={values =>
                      setParticipant({
                        ...participant,
                        ...{ permission: values },
                      })
                    }
                  />
                </CreateScheduleChecks>
              )}
            </ItemFlex>
            <Form.Item
              label={
                <CreateFormItem
                  label={t('calendarManager.schedule_description')}
                  type="file-02"
                />
              }
              name="describe"
            >
              <Input.TextArea
                placeholder={t(
                  'calendarManager.please_enter_a_schedule_description',
                )}
                autoSize={{ maxRows: 5 }}
                maxLength={200}
              />
            </Form.Item>
            <Form.Item
              label={
                <CreateFormItem
                  label={t('calendarManager.schedule_category')}
                  type="calendar-days"
                />
              }
            >
              <ItemFlex>
                <Select
                  value={normalCategory?.calendar_id}
                  onChange={value =>
                    setNormalCategory(
                      calendarCategory.filter(
                        (i: Model.Calendar.Info) => i.calendar_id === value,
                      )[0],
                    )
                  }
                  style={{ width: '100%' }}
                  getPopupContainer={n => n}
                  options={calendarCategory
                    .map((i: Model.Calendar.Info) => ({
                      label: i.is_default === 1 ? i.user.name : i.name,
                      value: i.calendar_id,
                    }))
                    .concat(hasCalendar.value === 0 ? [] : [hasCalendar])}
                  disabled={hasCalendar.value as unknown as boolean}
                />
              </ItemFlex>
            </Form.Item>
            <Form.Item
              label={
                <CreateFormItem
                  label={t('calendarManager.public_scope')}
                  type="lock"
                />
              }
              name="permission"
              style={{ margin: 0 }}
            >
              <Select
                options={relateConfig.schedule.permission_types}
                getPopupContainer={n => n}
              />
            </Form.Item>
            <Form.Item>
              <Radio.Group
                value={status}
                onChange={e => setStatus(e.target.value)}
              >
                {relateConfig.schedule.busy_status.map(
                  (i: Model.Calendar.GetRelateConfigCommonInfo) => (
                    <Radio key={i.value} value={i.value}>
                      {i.label}
                    </Radio>
                  ),
                )}
              </Radio.Group>
            </Form.Item>
            <Form.Item
              label={
                <CreateFormItem
                  label={t('calendarManager.remind')}
                  type="alarm"
                />
              }
              name="reminds"
            >
              <CommonButton
                type="primaryText"
                icon="plus"
                iconPlacement="left"
                onClick={onAddNotice}
              >
                {t('calendarManager.add_reminder')}
              </CommonButton>
              {noticeList.map((i: DefaultTime) => (
                <NoticeBox key={i.id}>
                  <Select
                    className="select"
                    value={i.value}
                    options={
                      isAll
                        ? relateConfig.schedule.all_day_remind
                        : relateConfig.schedule.un_all_day_remind
                    }
                    onChange={value => onChangeNotice(value, i.id)}
                    getPopupContainer={n => n}
                    optionFilterProp="label"
                  />
                  <IconFont
                    onClick={() => onDeleteNotice(i.id)}
                    className="icon"
                    type="close"
                  />
                </NoticeBox>
              ))}
            </Form.Item>
            <Form.Item
              label={
                <CreateFormItem
                  label={t('calendarManager.attachment')}
                  type="attachment"
                />
              }
              name="files"
            >
              <UploadAttach
                ref={attachRef}
                power
                defaultList={attachList}
                onChangeAttachment={onChangeAttachment}
                addWrap={
                  <div style={{ marginBottom: 8 }}>
                    <CommonButton
                      type="primaryText"
                      icon="plus"
                      iconPlacement="left"
                    >
                      {t('calendarManager.addAdjunct')}
                    </CommonButton>
                  </div>
                }
              />
            </Form.Item>
          </CreateFormAll>
          <CreateVisualization />
        </CreateContentAll>
        <ModalFooter>
          <CommonButton type="light" onClick={onClose}>
            {t('calendarManager.cancel')}
          </CommonButton>
          {!scheduleModal.params?.id && (
            <CommonButton type="secondary" onClick={() => onConfirm(true)}>
              {t('calendarManager.finishToAdd')}
            </CommonButton>
          )}
          <CommonButton type="primary" onClick={() => onConfirm()}>
            {scheduleModal.params?.id
              ? t('calendarManager.confirm2')
              : t('calendarManager.create')}
          </CommonButton>
        </ModalFooter>
      </Drawer>
    </>
  )
}

export default CreateSchedule
