/* eslint-disable no-constant-binary-expression */
/* eslint-disable react/jsx-no-leaked-render */
import CommonButton from '@/components/CommonButton'
import CommonModal from '@/components/CommonModal'
import { CloseWrap, ModalFooter } from '@/components/StyleCommon'
import {
  setIsShowScheduleVisible,
  setShowScheduleParams,
} from '@store/calendar'
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
} from 'antd'
import {
  CreateContent,
  CreateForm,
  CreateFormItemWrap,
  CreateScheduleChecks,
  CreateVisualization,
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
import RepeatModal from './RepeatModal'
import UploadAttach from '@/components/UploadAttach'

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
  const { isShowScheduleVisible, showScheduleParams, partialDayTimeOption } =
    useSelector(store => store.calendar)
  const [form] = Form.useForm()
  const [isVisible, setIsVisible] = useState(false)
  // 创建日历默认主题色
  const [normalColor, setNormalColor] = useState(0)
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
  //   附件
  const [attachList, setAttachList] = useState<any>([])

  // 日程时间是否重复
  const repeatOption = [
    { label: '不重复', value: 0 },
    { label: '每天重复', value: 1 },
    { label: '每周重复', value: 2 },
    { label: '每月重复', value: 3 },
    { label: '每年重复', value: 4 },
  ]

  // 参与者的权限
  const checkboxOptions = [
    { label: '可修改日程', value: 0 },
    { label: '邀请参与者', value: 1 },
  ]

  const publicOptions = [
    { label: '默认的公开范围', value: 0 },
    { label: '公开', value: 1 },
    { label: '私密', value: 2 },
  ]

  // 关闭弹窗
  const onClose = () => {
    dispatch(setShowScheduleParams({}))
    dispatch(setIsShowScheduleVisible(false))
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

  // 修改日程时间
  const onChangeTime = (
    value: DatePickerProps['value'] | RangePickerProps['value'],
    _dateString: [string, string] | string,
  ) => {
    setTime(value)
  }

  // 是否是全天
  const onChangeIsAll = (e: CheckboxChangeEvent) => {
    setIsAll(e.target.checked)
    form.setFieldsValue({
      isAll: e.target.checked,
      time,
    })
  }

  //   修改重复
  const onChangeRepeat = (value: number) => {
    setIsRepeatVisible(true)
    setCurrentRepeat(value)
  }

  // 重复小弹窗确认事件
  const onRepeatConfirm = (params: any) => {
    //
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

  //   修改附件
  const onChangeAttachment = (result: any) => {
    console.log(result)
    setAttachList(result)
  }

  useEffect(() => {
    if (isShowScheduleVisible) {
      setTimeout(() => {
        inputDom.current.focus()
      }, 100)
    }
  }, [isShowScheduleVisible])

  return (
    <>
      <RepeatModal
        isVisible={isRepeatVisible}
        title={repeatOption[currentRepeat].label}
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
        isVisible={isShowScheduleVisible}
        title={showScheduleParams.id ? '编辑日程' : '创建日程'}
        width={showScheduleParams.width || 420}
        onClose={onClose}
        hasFooter={
          <>
            {showScheduleParams.hasRight && (
              <ModalFooter>
                <CommonButton type="light" onClick={onClose}>
                  取消
                </CommonButton>
                <CommonButton type="secondary">完成并创建下一个</CommonButton>
                <CommonButton type="primary" onClick={onConfirm}>
                  创建
                </CommonButton>
              </ModalFooter>
            )}
            {!showScheduleParams.hasRight && (
              <ModalFooter>
                <CommonButton type="light">更多选项</CommonButton>
                <CommonButton type="primary">创建</CommonButton>
              </ModalFooter>
            )}
          </>
        }
      >
        <CreateContent>
          <CreateForm
            ref={leftDom}
            scrollToFirstError
            form={form}
            layout="vertical"
            className={showScheduleParams.hasRight ? 'haveRight' : 'notRight'}
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
                <DatePicker
                  style={{ width: '100%' }}
                  showTime
                  onChange={onChangeTime}
                  allowClear={false}
                />
              </Form.Item>
              <Checkbox value={isAll} onChange={onChangeIsAll}>
                全天
              </Checkbox>
            </TimeWrap>
            {showScheduleParams.hasRight && (
              <Form.Item style={{ width: '80%', marginTop: 8 }}>
                <Select
                  className="select"
                  value={repeatValue.value}
                  options={repeatOption}
                  onChange={onChangeRepeat}
                  getPopupContainer={n => n}
                />
              </Form.Item>
            )}
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
            {showScheduleParams.hasRight && (
              <>
                <Form.Item
                  label={<CreateFormItem label="公开范围" type="lock" />}
                  name="public"
                  style={{ margin: 0 }}
                >
                  <Select options={publicOptions} getPopupContainer={n => n} />
                </Form.Item>
                <Form.Item>
                  <Radio.Group
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                  >
                    <Radio value={1}>忙碌</Radio>
                    <Radio value={2}>空闲</Radio>
                  </Radio.Group>
                </Form.Item>
              </>
            )}
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
                    options={partialDayTimeOption}
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
            {showScheduleParams.hasRight && (
              <Form.Item
                label={<CreateFormItem label="附件" type="attachment" />}
                name="attachment"
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
            )}
          </CreateForm>
          {showScheduleParams.hasRight && <CreateVisualization />}
        </CreateContent>
      </CommonModal>
    </>
  )
}

export default CreateSchedule
