/* eslint-disable no-constant-binary-expression */

import { useDispatch, useSelector } from '@store/index'
import {
  Checkbox,
  DatePicker,
  Drawer,
  Form,
  Input,
  Popover,
  Select,
  message,
} from 'antd'
import React, { useEffect, useRef, useState } from 'react'
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
  CreateContent,
} from '../../styles'
import { CloseWrap, ModalFooter } from '@/components/StyleCommon'
import CommonUserAvatar from '@/components/CommonUserAvatar'
import CommonButton from '@/components/CommonButton'
import { CheckboxChangeEvent } from 'antd/lib/checkbox'
import moment from 'moment'
import NewAddUserModalForTandD from '@/components/NewAddUserModal/NewAddUserModalForTandD/NewAddUserModalForTandD'
import { setQuickCreateScheduleModel } from '@store/calendarPanle'
import { setIsAddOrDelete } from '@store/schedule'
import { setScheduleModal } from '@store/calendar'
import { saveSchedule } from '@store/schedule/schedule.thunk'
import { EventBus } from '../../eventBus'
import useModalPosition from './useModalPosition'
import { useTranslation } from 'react-i18next'
import { getMessage } from '@/components/Message'
interface CreateScheduleBoxProps {
  containerClassName: string
}
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
  const [t] = useTranslation()
  const { relateConfig, calendarConfig, calendarData } = useSelector(
    store => store.calendar,
  )
  const { userInfo } = useSelector(store => store.user)
  const { quickCreateScheduleModel } = useSelector(store => store.calendarPanel)
  const { visible } = quickCreateScheduleModel
  const { position } = useModalPosition({
    ...quickCreateScheduleModel,
    containerClassName: props.containerClassName,
    modalInfo: {
      width: 528,
      height: 640,
    },
  })
  const dispatch = useDispatch()
  const [form] = Form.useForm()
  const leftWidth = 500
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
  const [time, setTime] = useState<any>()
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
    { label: t('calendarManager.modifiable_schedule'), value: 0 },
    // { label: t('calendarManager.invite_participants'), value: 1 },
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
    setNoticeList([])
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
    values.is_all_day = isAll ? 1 : 2
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
    resultParams.start_datetime = isAll
      ? moment(values.time[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss')
      : moment(values.time[0]).format('YYYY-MM-DD HH:mm:ss')
    resultParams.end_datetime = isAll
      ? moment(values.time[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss')
      : moment(values.time[1]).format('YYYY-MM-DD HH:mm:ss')
    delete resultParams.time

    return resultParams
  }

  // 保存
  const onConfirm = async () => {
    const params = await onGetParams()
    if (
      moment(params.start_datetime).format('x') ===
      moment(params.end_datetime).format('x')
    ) {
      getMessage({ msg: t('calendarManager.time_limit'), type: 'warning' })
      return
    }
    await dispatch(saveSchedule(params))
    message.success(t('calendarManager.createSuccess'))
    dispatch(setIsAddOrDelete(true))
    onClose()
  }

  // 跳转更多选项
  const onToMore = () => {
    const params = {
      isAll,
      participant,
      noticeList,
      startTime: moment(form.getFieldsValue().time[0]).format(
        'YYYY-MM-DD HH:mm:ss',
      ),
      endTime: moment(form.getFieldsValue().time[1]).format(
        'YYYY-MM-DD HH:mm:ss',
      ),
      subject: form.getFieldsValue().subject,
      describe: form.getFieldsValue().describe,
      normalCategory,
    }
    dispatch(setScheduleModal({ visible: true, params }))
    setTimeout(() => {
      onClose()
    }, 10)
  }

  useEffect(() => {
    if (quickCreateScheduleModel.visible) {
      // 获取日历列表，并且过滤出可创建日程的日历
      setCalendarCategory(calendarData.manager)
      // 默认日历列表第一条
      setNormalCategory(calendarData.manager[0])
      setIsAll(quickCreateScheduleModel.isAll)
      const resultTime = [
        moment(quickCreateScheduleModel.startTime),
        moment(quickCreateScheduleModel.endTime),
      ]
      setTime(resultTime)
      // 公开范围默认 为默认
      form.setFieldsValue({
        permission: 1,
        time: resultTime,
      })
      setTimeout(() => {
        inputDom?.current?.focus()
      }, 100)
    }
  }, [quickCreateScheduleModel])

  return (
    <>
      <NewAddUserModalForTandD
        title={t('calendarManager.add_a_member')}
        state={2}
        isVisible={isChooseVisible && !!position}
        onConfirm={onAddConfirm}
        onClose={() => {
          setIsChooseVisible(false)
          EventBus.getInstance().dispatch('cancelCreateSchedule')
        }}
      />
      <Drawer
        closable={false}
        placement="right"
        bodyStyle={{ padding: 0, position: 'relative' }}
        width={leftWidth}
        open={visible}
        onClose={onClose}
        destroyOnClose
        // mask={false}
        className="drawerRoot"
      >
        <EasyScheduleHeader>
          <span>{t('calendarManager.create_schedule')}</span>
          <CloseWrap onClick={onClose} width={32} height={32}>
            <IconFont
              style={{ fontSize: 20, color: 'var(--neutral-n2)' }}
              type="close"
            />
          </CloseWrap>
        </EasyScheduleHeader>
        <CreateContent>
          <CreateForm scrollToFirstError form={form} layout="vertical">
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
                  onChange={setTime}
                  allowClear={false}
                />
              </Form.Item>
              <Checkbox checked={isAll} onChange={onChangeIsAll}>
                {t('calendarManager.all_day_long')}
              </Checkbox>
            </TimeWrap>
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
                  options={calendarCategory.map((i: Model.Calendar.Info) => ({
                    label: i.is_default === 1 ? i.user.name : i.name,
                    value: i.calendar_id,
                  }))}
                />
              </ItemFlex>
            </Form.Item>
            <Form.Item
              label={
                <CreateFormItem
                  label={t('calendarManager.remind')}
                  type="alarm"
                />
              }
              name="notice"
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
                    style={{ width: '92%' }}
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
          </CreateForm>
        </CreateContent>
        <ModalFooter size={16}>
          <CommonButton type="light" onClick={onToMore}>
            {t('calendarManager.more_options')}
          </CommonButton>
          <CommonButton type="primary" onClick={onConfirm}>
            {t('calendarManager.create')}
          </CommonButton>
        </ModalFooter>
      </Drawer>
    </>
  )
}

export default QuickCreateScheduleModel
