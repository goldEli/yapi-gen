/* eslint-disable no-constant-binary-expression */
import styled from '@emotion/styled'
import { css } from '@emotion/css'
import { useDispatch, useSelector } from '@store/index'
import {
  Checkbox,
  DatePicker,
  DatePickerProps,
  Dropdown,
  Form,
  Input,
  Popover,
  Select,
  message,
} from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import useModalPosition from '../../hooks/useModalPosition'
import AddMemberCommonModal from '@/components/AddUser/CommonModal'
import { CheckboxValueType } from 'antd/lib/checkbox/Group'
import IconFont from '@/components/IconFont'
import {
  CreateForm,
  CreateFormItemWrap,
  CreateScheduleChecks,
  ItemFlex,
  NoticeBox,
  ParticipantItem,
  ParticipantItems,
  TimeWrap,
  EasyScheduleHeader,
} from '../../styles'
import { CloseWrap, ModalFooter } from '@/components/StyleCommon'
import CommonUserAvatar from '@/components/CommonUserAvatar'
import CalendarColor from '../CalendarColor'
import CommonButton from '@/components/CommonButton'
import { ColorWrap } from '../CalendarSidebar/CalendarFormModal/style'
import { CheckboxChangeEvent } from 'antd/lib/checkbox'
import moment, { Moment } from 'moment'
import { RangePickerProps } from 'antd/lib/date-picker'
import { colorMap } from '../../config'
import { setQuickCreateScheduleModel } from '@store/calendarPanle'
import { setScheduleModal } from '@store/calendar'
import { saveSchedule } from '@store/schedule/schedule.thunk'
import { EventBus } from '../../eventBus'
interface CreateScheduleBoxProps {
  containerClassName?: string
}

const CreateSchedule = styled.div<{
  visible: boolean
  top: number
  left: number
}>`
  width: 528px;
  overflow-y: scroll;
  background-color: var(--neutral-white-d1);
  box-shadow: 0px 0px 15px 6px rgba(0, 0, 0, 0.12);
  z-index: 100;
  display: ${props => (props.visible ? 'block' : 'none')};
  position: absolute;
  top: ${props => props.top + 'px'};
  left: ${props => props.left + 'px'};
  border-radius: 6px;
`

interface CreateFormItemProps {
  type: string
  label: string
}

interface DefaultTime {
  value: number | undefined
  id: number
}

const CreateFormItem = (props: CreateFormItemProps) => {
  return (
    <CreateFormItemWrap>
      <IconFont type={props.type} className="icon" />
      <div>{props.label}</div>
    </CreateFormItemWrap>
  )
}

const QuickCreateScheduleModel: React.FC<CreateScheduleBoxProps> = props => {
  const { relateConfig, calendarConfig, calendarData } = useSelector(
    store => store.calendar,
  )
  const { userInfo } = useSelector(store => store.user)
  const { quickCreateScheduleModel } = useSelector(store => store.calendarPanel)
  const { visible } = quickCreateScheduleModel
  const { position } = useModalPosition({
    ...quickCreateScheduleModel,
    containerClassName: props.containerClassName,
    modalClassName: '.schedule-info-dropdown-box',
    modalInfo: {
      width: 528,
      height: 544,
    },
  })
  const dispatch = useDispatch()
  const [form] = Form.useForm()
  const inputDom: any = useRef<HTMLInputElement>(null)
  const [calendarCategory, setCalendarCategory] = useState<
    Model.Calendar.Info[]
  >([])
  // 选择成员显示
  const [isChooseVisible, setIsChooseVisible] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  // 是否是全天
  const [isAll, setIsAll] = useState(false)
  // 创建日历默认主题色
  const [normalCategory, setNormalCategory] = useState({
    color: 0,
    calendar_id: 0,
  })
  const [time, setTime] = useState<
    Moment | undefined | DatePickerProps['value'] | RangePickerProps['value']
  >(null)
  // 参与者
  const [participant, setParticipant] = useState<{
    list: Model.Calendar.MemberItem[]
    permission: CheckboxValueType[]
  }>({
    list: [],
    permission: [],
  })
  // 提醒
  const [noticeList, setNoticeList] = useState<DefaultTime[]>([])

  // 关闭弹窗
  const onClose = () => {
    EventBus.getInstance().dispatch('cancelCreateSchedule')
    form.resetFields()
    dispatch(setQuickCreateScheduleModel({ visible: false }))
    setNoticeList([])
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
  }

  // 参与者的权限
  const checkboxOptions = [
    { label: '可修改日程', value: 0 },
    { label: '邀请参与者', value: 1 },
  ]

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
    form.setFieldsValue({
      isAll: e.target.checked,
      time,
    })
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

  const onGetParams = async () => {
    await form.validateFields()
    let values = form.getFieldsValue()
    values.members = participant.list.map((i: Model.Calendar.MemberItem) => ({
      user_id: i.id,
      company_id: userInfo.company_id,
    }))
    values.repeat_type = 0
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
    }
    resultParams.start_datetime = moment(values.time[0]).format(
      isAll ? 'YYYY-MM-DD' : 'YYYY-MM-DD hh:mm:ss',
    )
    resultParams.end_datetime = moment(values.time[1]).format(
      isAll ? 'YYYY-MM-DD' : 'YYYY-MM-DD hh:mm:ss',
    )
    delete resultParams.time
    return resultParams
  }

  // 保存
  const onConfirm = async () => {
    const params = await onGetParams()
    await dispatch(saveSchedule(params))
    message.success('创建成功')
    onClose()
  }

  // 跳转更多选项
  const onToMore = async () => {
    const params = await onGetParams()
    dispatch(setScheduleModal({ visible: true, params }))
    setTimeout(() => {
      onClose()
    }, 10)
  }

  useEffect(() => {
    if (quickCreateScheduleModel.visible) {
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
      setTimeout(() => {
        inputDom.current.focus()
      }, 100)
    }
  }, [quickCreateScheduleModel])

  if (!position) {
    return <></>
  }

  return (
    <>
      <AddMemberCommonModal
        isVisible={isChooseVisible && !!position}
        title="添加成员"
        onClose={() => {
          setIsChooseVisible(false)
          EventBus.getInstance().dispatch('cancelCreateSchedule')
        }}
        onConfirm={onAddConfirm}
      />
      <CreateSchedule
        className="quick-create-schedule-model"
        visible={visible && !!position}
        top={position?.y ?? 0}
        left={position?.x ?? 0}
        onClick={e => {
          e.stopPropagation()
        }}
      >
        <EasyScheduleHeader>
          <span>创建日程</span>
          <CloseWrap onClick={onClose} width={32} height={32}>
            <IconFont
              style={{ fontSize: 20, color: 'var(--neutral-n2)' }}
              type="close"
            />
          </CloseWrap>
        </EasyScheduleHeader>
        <CreateForm
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
              style={{ margin: 0, width: '80%' }}
            >
              <DatePicker.RangePicker
                style={{ width: '100%' }}
                showTime
                onChange={setTime}
                allowClear={false}
              />
            </Form.Item>
            <Checkbox value={isAll} onChange={onChangeIsAll}>
              全天
            </Checkbox>
          </TimeWrap>
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
            label={<CreateFormItem label="提醒" type="alarm" />}
            name="notice"
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
                  options={relateConfig.schedule.remind_types}
                  onChange={value => onChangeNotice(value, i.id)}
                  getPopupContainer={n => n}
                  style={{ width: '92%' }}
                />
                <IconFont
                  onClick={() => onDeleteNotice(i.id)}
                  className="icon"
                  type="close"
                />
              </NoticeBox>
            ))}
          </Form.Item>
        </CreateForm>
        <ModalFooter size={16}>
          <CommonButton type="light" onClick={onToMore}>
            更多选项
          </CommonButton>
          <CommonButton type="primary" onClick={onConfirm}>
            创建
          </CommonButton>
        </ModalFooter>
      </CreateSchedule>
    </>
  )
}

export default QuickCreateScheduleModel
