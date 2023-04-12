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
  DatePickerProps,
  Form,
  Input,
  Popover,
  Radio,
  Select,
  message,
} from 'antd'
import {
  CreateContent,
  CreateForm,
  CreateFormItemWrap,
  CreateScheduleChecks,
  ItemFlex,
  NoticeBox,
  ParticipantItem,
  ParticipantItems,
  TimeWrap,
} from '../../styles'
import IconFont from '@/components/IconFont'
import { useEffect, useRef, useState } from 'react'
import CalendarColor from '../CalendarColor'
import { ColorWrap } from '../CalendarSidebar/CalendarFormModal/style'
import { colorMap } from '../../config'
import AddMemberCommonModal from '@/components/AddUser/CommonModal'
import CommonUserAvatar from '@/components/CommonUserAvatar'
import { CheckboxValueType } from 'antd/lib/checkbox/Group'
import { RangePickerProps } from 'antd/lib/date-picker'
import { CheckboxChangeEvent } from 'antd/lib/checkbox'
import moment, { Moment } from 'moment'
import RepeatModal from './RepeatModal'
import UploadAttach from '@/components/UploadAttach'
import CreateVisualization from './CreateVisualization'
import { saveSchedule } from '@store/schedule/schedule.thunk'

interface DefaultTime {
  value: number | undefined
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
  const dispatch = useDispatch()
  const leftDom: any = useRef<HTMLDivElement>(null)
  const inputDom: any = useRef<HTMLInputElement>(null)
  const { scheduleModal, relateConfig, calendarData, calendarConfig } =
    useSelector(store => store.calendar)
  const { userInfo } = useSelector(store => store.user)
  const [form] = Form.useForm()
  const [calendarCategory, setCalendarCategory] = useState<
    Model.Calendar.Info[]
  >([])
  const [isVisible, setIsVisible] = useState(false)
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
  const [isAll, setIsAll] = useState(false)
  //   重复
  const [repeatValue, setRepeatValue] = useState<{
    value: number
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
    { label: '可修改日程', value: 0 },
    { label: '邀请参与者', value: 1 },
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
  const onConfirm = async () => {
    await form.validateFields()
    let values = form.getFieldsValue()
    values.is_busy = status
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
      ...repeatValue.params,
    }
    resultParams.start_datetime = isAll
      ? moment(values.time[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss')
      : moment(values.time[0]).format('YYYY-MM-DD HH:mm:ss')
    resultParams.end_datetime = isAll
      ? moment(values.time[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss')
      : moment(values.time[1]).format('YYYY-MM-DD HH:mm:ss')
    delete resultParams.time
    await dispatch(saveSchedule(resultParams))
    message.success('创建成功')
    onClose()
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
    form.setFieldsValue({
      isAll: e.target.checked,
      time,
    })
  }

  //   修改重复
  const onChangeRepeat = (value: number) => {
    // 是否可操作重复限制
    const limitDay = [0, 1, 1, 31, 366]
    if (!time) {
      message.warning('请选择时间！')
      return
    }
    const startTime = isAll ? moment(time[0]).startOf('day') : moment(time[0])
    const endTime = isAll ? moment(time[1]).endOf('day') : moment(time[0])
    // 计算日期相差多少
    const difference = moment(
      moment(endTime).format('YYYY-MM-DD HH:mm:ss'),
    ).diff(moment(startTime).format('YYYY-MM-DD HH:mm:ss'))

    if (value === 0) {
      setRepeatValue({ value, params: {} })
    } else {
      if (difference / 86400000 < limitDay[value]) {
        message.warning(`仅支持时长在${limitDay[value]}天内的日程重复！`)
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
      files: result?.map((i: any) => i.url),
    })
  }

  useEffect(() => {
    if (scheduleModal.visible) {
      // 获取日历列表，并且过滤出可创建日程的日历
      const result = [
        ...calendarData.manager,
        ...calendarData.subscribe,
      ].filter((i: Model.Calendar.Info) => [1, 2].includes(i.user_group_id))
      setCalendarCategory(result)
      // 默认日历列表第一条
      setNormalCategory(result[0])
      // 公开范围默认 为默认
      form.setFieldsValue({
        permission: 1,
      })
      if (scheduleModal?.params?.id) {
        // 调用日程详情接口
      }
      // 从简易弹窗跳转过来
      if (scheduleModal?.params?.time) {
        // 调用日程详情接口
      }
      setTimeout(() => {
        inputDom.current.focus()
      }, 100)
    }
  }, [scheduleModal])

  return (
    <>
      <RepeatModal
        isVisible={isRepeatVisible}
        title={relateConfig.schedule.repeat_types[currentRepeat]?.label}
        currentRepeat={currentRepeat}
        onRepeatConfirm={onRepeatConfirm}
        onClose={() => {
          setIsRepeatVisible(false)
          setCurrentRepeat(0)
        }}
      />
      <AddMemberCommonModal
        isVisible={isChooseVisible}
        title="添加成员"
        onClose={() => setIsChooseVisible(false)}
        onConfirm={onAddConfirm}
      />
      <CommonModal
        isVisible={scheduleModal.visible}
        title={scheduleModal?.params?.id ? '编辑日程' : '创建日程'}
        width={1056}
        onClose={onClose}
        hasFooter={
          <ModalFooter>
            <CommonButton type="light" onClick={onClose}>
              取消
            </CommonButton>
            <CommonButton type="secondary">完成并创建下一个</CommonButton>
            <CommonButton type="primary" onClick={onConfirm}>
              创建
            </CommonButton>
          </ModalFooter>
        }
      >
        <CreateContent>
          <CreateForm
            ref={leftDom}
            scrollToFirstError
            form={form}
            layout="vertical"
            className="haveRight"
          >
            <Form.Item
              label={<CreateFormItem label="主题" type="database" />}
              name="subject"
              rules={[{ required: true, message: '' }]}
            >
              <Input
                autoComplete="off"
                placeholder="请输入主题"
                maxLength={80}
                ref={inputDom}
                autoFocus
              />
            </Form.Item>
            <TimeWrap>
              <Form.Item
                label={<CreateFormItem label="时间" type="time" />}
                name="time"
                rules={[{ required: true, message: '' }]}
                style={{ margin: 0, width: '84%' }}
              >
                <DatePicker.RangePicker
                  style={{ width: '100%' }}
                  showTime={!isAll}
                  onChange={setTime}
                  allowClear={false}
                />
              </Form.Item>
              <Checkbox value={isAll} onChange={onChangeIsAll}>
                全天
              </Checkbox>
            </TimeWrap>
            <Form.Item style={{ width: '80%', marginTop: 8 }}>
              <Select
                className="select"
                value={repeatValue.value}
                options={relateConfig.schedule.repeat_types}
                onChange={onChangeRepeat}
                getPopupContainer={n => n}
              />
            </Form.Item>
            <ItemFlex style={{ margin: '24px 0' }}>
              <div className="box">
                <CreateFormItem type="team" label="参与者" />
                <CloseWrap
                  width={24}
                  height={24}
                  onClick={() => setIsChooseVisible(true)}
                >
                  <IconFont type="plus" />
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
              label={<CreateFormItem label="日程描述" type="file-02" />}
              name="describe"
            >
              <Input.TextArea
                placeholder="请输入日程描述"
                autoSize
                maxLength={200}
              />
            </Form.Item>
            <Form.Item
              label={<CreateFormItem label="日程类别" type="calendar-days" />}
            >
              <ItemFlex>
                <div className="box">
                  <Select
                    value={normalCategory?.calendar_id}
                    onChange={value =>
                      setNormalCategory(
                        calendarCategory.filter(
                          (i: Model.Calendar.Info) => i.calendar_id === value,
                        )[0],
                      )
                    }
                    style={{ width: '90%' }}
                    getPopupContainer={n => n}
                    options={calendarCategory.map((i: Model.Calendar.Info) => ({
                      label: i.is_default === 1 ? i.user.name : i.name,
                      value: i.calendar_id,
                    }))}
                  />
                  <Popover
                    trigger={['hover']}
                    placement="bottomRight"
                    open={isVisible}
                    onOpenChange={setIsVisible}
                    overlayStyle={{ width: 192 }}
                    content={
                      <ColorWrap>
                        <CalendarColor
                          color={normalCategory.color}
                          onChangeColor={color => {
                            setNormalCategory({
                              calendar_id: normalCategory?.calendar_id,
                              color,
                            })
                            setIsVisible(false)
                          }}
                        />
                      </ColorWrap>
                    }
                  >
                    <div
                      className="color"
                      style={{ background: colorMap[normalCategory.color] }}
                    />
                  </Popover>
                </div>
              </ItemFlex>
            </Form.Item>
            <Form.Item
              label={<CreateFormItem label="公开范围" type="lock" />}
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
              label={<CreateFormItem label="提醒" type="alarm" />}
              name="reminds"
            >
              <CommonButton
                type="primaryText"
                icon="plus"
                iconPlacement="left"
                onClick={onAddNotice}
              >
                添加提醒
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
              label={<CreateFormItem label="附件" type="attachment" />}
              name="files"
            >
              <UploadAttach
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
                      添加附件
                    </CommonButton>
                  </div>
                }
              />
            </Form.Item>
          </CreateForm>
          <CreateVisualization />
        </CreateContent>
      </CommonModal>
    </>
  )
}

export default CreateSchedule
