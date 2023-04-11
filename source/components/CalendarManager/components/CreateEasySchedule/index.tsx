/* eslint-disable no-constant-binary-expression */
/* eslint-disable react/jsx-no-leaked-render */
import CommonButton from '@/components/CommonButton'
import CommonModal from '@/components/CommonModal'
import { CloseWrap, ModalFooter } from '@/components/StyleCommon'
import {
  setIsShowScheduleEasyVisible,
  setShowScheduleEasyParams,
} from '@store/calendar'
import { useDispatch, useSelector } from '@store/index'
import {
  Checkbox,
  DatePicker,
  DatePickerProps,
  Form,
  Input,
  Popover,
  Select,
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
import { ColorWrap } from '../CalendarManagerList/CalendarFormModal/style'
import { colorMap } from '../../config'
import AddMemberCommonModal from '@/components/AddUser/CommonModal'
import CommonUserAvatar from '@/components/CommonUserAvatar'
import { CheckboxValueType } from 'antd/lib/checkbox/Group'
import { RangePickerProps } from 'antd/lib/date-picker'
import { CheckboxChangeEvent } from 'antd/lib/checkbox'
import { Moment } from 'moment'

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

const CreateEasySchedule = () => {
  const dispatch = useDispatch()
  const leftDom: any = useRef<HTMLDivElement>(null)
  const inputDom: any = useRef<HTMLInputElement>(null)
  const { isShowScheduleEasyVisible, showScheduleEasyParams, relateConfig } =
    useSelector(store => store.calendar)
  const [form] = Form.useForm()
  const [isVisible, setIsVisible] = useState(false)
  // 创建日历默认主题色
  const [normalColor, setNormalColor] = useState(0)
  // 选择成员显示
  const [isChooseVisible, setIsChooseVisible] = useState(false)

  // 是否是全天
  const [isAll, setIsAll] = useState(false)
  const [time, setTime] = useState<
    Moment | undefined | DatePickerProps['value'] | RangePickerProps['value']
  >()
  // 参与者
  const [participant, setParticipant] = useState<{
    list: Model.Calendar.MemberItem[]
    permission: CheckboxValueType[]
  }>({
    list: [],
    permission: [],
  })
  // 提醒
  const [noticeList, setNoticeList] = useState<{ id: number; value: number }[]>(
    [],
  )

  // 参与者的权限
  const checkboxOptions = [
    { label: '可修改日程', value: 0 },
    { label: '邀请参与者', value: 1 },
  ]

  // 关闭弹窗
  const onClose = () => {
    console.log(1111)
    dispatch(setShowScheduleEasyParams({}))
    dispatch(setIsShowScheduleEasyVisible(false))
  }

  // 保存
  const onConfirm = async () => {
    await form.validateFields()
    console.log(form.getFieldsValue())
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
    form.setFieldsValue({
      isAll: e.target.checked,
      time,
    })
  }

  // 添加提醒
  const onAddNotice = () => {
    const list = [...[{ id: new Date().getTime(), value: 2 }], ...noticeList]
    setNoticeList(list)
  }

  // 删除添加的提醒
  const onDeleteNotice = (id: number) => {
    const result = noticeList.filter(
      (i: { id: number; value: number }) => i.id !== id,
    )
    setNoticeList(result)
  }

  // 修改提醒
  const onChangeNotice = (value: number, id: number) => {
    const result = noticeList.map((i: { id: number; value: number }) => ({
      ...i,
      value: i.id === id ? value : i.value,
    }))
    setNoticeList(result)
  }

  useEffect(() => {
    if (isShowScheduleEasyVisible) {
      setTimeout(() => {
        inputDom.current.focus()
      }, 100)
    }
  }, [isShowScheduleEasyVisible])

  return (
    <>
      <AddMemberCommonModal
        isVisible={isChooseVisible}
        title="添加成员"
        onClose={() => setIsChooseVisible(false)}
        onConfirm={onAddConfirm}
      />
      <CommonModal
        isShowMask={false}
        isVisible={isShowScheduleEasyVisible}
        title={showScheduleEasyParams.id ? '编辑日程' : '创建日程'}
        width={480}
        onClose={onClose}
        hasFooter={
          <ModalFooter>
            <CommonButton type="light">更多选项</CommonButton>
            <CommonButton type="primary">创建</CommonButton>
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
              name="name"
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
                  <Select style={{ width: '90%' }} getPopupContainer={n => n} />
                  <Popover
                    trigger={['hover']}
                    placement="bottomRight"
                    open={isVisible}
                    onOpenChange={setIsVisible}
                    overlayStyle={{ width: 192 }}
                    content={
                      <ColorWrap>
                        <CalendarColor
                          color={normalColor}
                          onChangeColor={setNormalColor}
                        />
                      </ColorWrap>
                    }
                  >
                    <div
                      className="color"
                      style={{ background: colorMap[normalColor] }}
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
              {noticeList.map((i: { id: number; value: number }) => (
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
        </CreateContent>
      </CommonModal>
    </>
  )
}

export default CreateEasySchedule
