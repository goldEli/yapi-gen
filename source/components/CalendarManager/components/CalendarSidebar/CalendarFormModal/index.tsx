/* eslint-disable no-constant-binary-expression */
/* eslint-disable react/jsx-no-leaked-render */
import ChooseIconOrUpload from '@/components/ChooseIconOrUpload'
import CommonButton from '@/components/CommonButton'
import CommonModal from '@/components/CommonModal'
import CustomSelect from '@/components/CustomSelect'
import FormTitleSmall from '@/components/FormTitleSmall'
import MoreOptions from '@/components/MoreOptions'
import {
  Form,
  Input,
  Popover,
  Radio,
  type RadioChangeEvent,
  Select,
  message,
} from 'antd'
import { useEffect, useRef, useState } from 'react'
import CalendarColor from '../../CalendarColor'
import NewAddUserModalForTandD from '@/components/NewAddUserModal/NewAddUserModalForTandD/NewAddUserModalForTandD'
import CommonUserAvatar from '@/components/CommonUserAvatar'
import IconFont from '@/components/IconFont'
import {
  ColorWrap,
  DepartmentIcon,
  FormWrap,
  ItemProvider,
  MenuItem,
  PermissionBox,
  PermissionDropBox,
  PermissionDropItem,
  ShareMemberItem,
  SubscribedItem,
  SubscribedItems,
  TeamIcon,
  TransferContent,
} from './style'
import AddDepartmentOrTeamModal from '@/components/AddDepartmentOrTeamModal'
import DeleteConfirm from '@/components/DeleteConfirm'
import { colorMap } from '@/components/CalendarManager/config'
import { useDispatch, useSelector } from '@store/index'
import { setCalendarModal } from '@store/calendar'
import { addCalendar, editCalendar, getCalendarInfo } from '@/services/calendar'
import { getCalendarList } from '@store/calendar/calendar.thunk'
import { useTranslation } from 'react-i18next'

interface PermissionDropProps {
  onUpdateShare(item: Model.Calendar.MemberItem, type: string): void
  item: Model.Calendar.MemberItem
  onTransfer(id: number | string, value: number): void
  calendarInfo?: Model.Calendar.CalendarInfo
}

const PermissionDrop = (props: PermissionDropProps) => {
  const [t] = useTranslation()
  const { relateConfig } = useSelector(store => store.calendar)
  const [isVisible, setIsVisible] = useState(false)
  // 移除成员
  const [isDeleteVisible, setIsDeleteVisible] = useState(false)
  // 转让日历
  const [isTransferVisible, setIsTransferVisible] = useState(false)
  // 转让日历选中的值
  const [transferValue, setTransferValue] = useState(1)

  // 转让日历
  const onTransferCalendar = () => {
    props.onTransfer(props.item.id, transferValue)
    setIsTransferVisible(false)
  }

  //  移除成员
  const onDeleteMember = () => {
    props.onUpdateShare(props.item, 'delete')
    setIsDeleteVisible(false)
  }

  // 改变权限
  const onChangePermission = (i: Model.Calendar.GetRelateConfigCommonInfo) => {
    const newItem = { ...props.item, permission: i.value }
    props.onUpdateShare(newItem, 'update')
    setIsVisible(false)
  }

  const operation = (
    <PermissionDropBox>
      {relateConfig.calendar.user_group_ids.map(
        (i: Model.Calendar.GetRelateConfigCommonInfo) => (
          <PermissionDropItem
            key={i.value}
            onClick={() => onChangePermission(i)}
          >
            <span className="title">{i.label}</span>
            <span className="sub">{i.describe}</span>
          </PermissionDropItem>
        ),
      )}
      <ItemProvider />
      {props?.calendarInfo?.is_owner === 1 && (
        <PermissionDropItem onClick={() => setIsTransferVisible(true)}>
          {t('calendarManager.transfer_calendar')}
        </PermissionDropItem>
      )}
      <PermissionDropItem
        onClick={() => setIsDeleteVisible(true)}
        style={{ color: 'var(--function-error)' }}
      >
        {t('calendarManager.remove_members')}
      </PermissionDropItem>
    </PermissionDropBox>
  )

  return (
    <>
      <DeleteConfirm
        isVisible={isDeleteVisible}
        title={t('calendarManager.remove_members')}
        onConfirm={onDeleteMember}
        onChangeVisible={() => setIsDeleteVisible(false)}
        text={t('calendarManager.confirm_remove_member')}
      />

      <CommonModal
        isVisible={isTransferVisible}
        onClose={() => setIsTransferVisible(false)}
        onConfirm={onTransferCalendar}
        title={t('calendarManager.transfer_calendar')}
      >
        <TransferContent>
          <Radio.Group
            onChange={(e: RadioChangeEvent) => setTransferValue(e.target.value)}
            value={transferValue}
          >
            <Radio value={1}>
              {t('calendarManager.transfer_me_to_become_an_administrator')}
            </Radio>
            <Radio value={2}>
              {t('calendarManager.transfer_me_to_exit_this_calendar')}
            </Radio>
          </Radio.Group>
        </TransferContent>
      </CommonModal>
      <Popover
        open={isVisible}
        onOpenChange={setIsVisible}
        trigger={['click', 'hover']}
        placement="bottomRight"
        content={operation}
        getPopupContainer={n => n}
      >
        <div className="canOperation">
          <span className="name">
            {
              relateConfig.calendar.user_group_ids.filter(
                (i: Model.Calendar.GetRelateConfigCommonInfo) =>
                  i.value === props.item.permission,
              )[0]?.label
            }
          </span>
          <IconFont className="icon" type={isVisible ? 'up' : 'down'} />
        </div>
      </Popover>
    </>
  )
}

const CalendarFormModal = () => {
  const [form] = Form.useForm()
  const dispatch = useDispatch()
  const [t] = useTranslation()
  const { calendarModal, relateConfig } = useSelector(store => store.calendar)
  const inputRefDom = useRef<HTMLInputElement>(null)
  // 创建日历默认主题色
  const [normalColor, setNormalColor] = useState(0)
  // 是否显示选择颜色
  const [isVisible, setIsVisible] = useState(false)
  const [hiddenUpload, setHiddenUpload] = useState(false)
  const [path, setPath] = useState<string>('')
  // 选择成员显示
  const [isChooseVisible, setIsChooseVisible] = useState(false)
  // 选择其他显示
  const [isChooseOtherVisible, setIsChooseOtherVisible] = useState(false)
  // 当前选中的下拉key
  const [isActiveKey, setIsActiveKey] =
    useState<Model.Calendar.ChooseAddType>(null)
  // 当前是哪个key添加人员 例：共享或者是可订阅
  const [currentKey, setCurrentKey] = useState('')
  // 共享成员数组
  const [shareList, setShareList] = useState<Model.Calendar.MemberItem[]>([])
  // 订阅成员数组 --- 人员数组
  const [subscribedList, setSubscribedList] = useState<
    Model.Calendar.MemberItem[]
  >([])
  // 可订阅人群下拉选择
  const [isAddVisible, setIsAddVisible] = useState(false)
  const [calendarInfo, setCalendarInfo] =
    useState<Model.Calendar.CalendarInfo>()
  const [currentPermission, setCurrentPermission] = useState<number>()

  // 关闭创建日历弹窗
  const onClose = () => {
    setNormalColor(0)
    setIsActiveKey(null)
    setCurrentKey('')
    setShareList([])
    setSubscribedList([])
    setCurrentPermission(relateConfig.calendar.permission_types[0]?.value)
    dispatch(setCalendarModal({ visible: false, params: {} }))
    form.resetFields()
    setCalendarInfo({} as Model.Calendar.CalendarInfo)
    setPath('')
  }

  // 切换图标
  const onChangePath = (val: string, state: number) => {
    setPath(val)
    state === 1 ? setHiddenUpload(true) : setHiddenUpload(false)
  }

  // 点击添加成员
  const onAddMember = (key: string) => {
    setCurrentKey(key)
    setIsChooseVisible(true)
  }

  // 对象数组去重
  const onClearMore = (list: Model.Calendar.MemberItem[]) => {
    let obj: any = {}
    const result: Model.Calendar.MemberItem[] = list.reduce(
      (cur: Model.Calendar.MemberItem[], next: Model.Calendar.MemberItem) => {
        obj[next.id] ? '' : (obj[next.id] = true && cur.push(next))
        return cur
      },
      [],
    )
    return result
  }

  // 选中的共享成员
  const onAddConfirm = (list: Model.Calendar.MemberItem[], id: number) => {
    const resultList = list.map((i: Model.Calendar.MemberItem) => ({
      ...i,
      type: isActiveKey,
      permission: id,
    }))
    const newList = [
      ...(currentKey === 'share' ? shareList : subscribedList),
      ...resultList,
    ]
    const result: Model.Calendar.MemberItem[] = onClearMore(newList)
    currentKey === 'share' ? setShareList(result) : setSubscribedList(result)
    setIsChooseVisible(false)
  }

  // 添加全员
  const onAddAllMember = () => {
    const all = {
      id: '0',
      name: t('calendarManager.calendar_all_member'),
      type: 1 as Model.Calendar.ChooseAddType,
    }
    const newList = [...subscribedList, ...[all]]
    const result: Model.Calendar.MemberItem[] = onClearMore(newList)
    setSubscribedList(result)
  }

  // 订阅人群选择的key
  const onChooseKeys = (key: number) => {
    setIsAddVisible(false)
    setIsActiveKey(key as Model.Calendar.ChooseAddType)
    switch (key) {
      case 1:
        onAddAllMember()
        break
      case 2:
        onAddMember('subscribeable')
        break
      default:
        setIsChooseOtherVisible(true)
        break
    }
  }

  // 订阅成员下拉
  const chooseMemberType = () => {
    return (
      <div style={{ padding: '4px 0' }}>
        {relateConfig.calendar.subscribe_types.map(
          (i: Model.Calendar.GetRelateConfigCommonInfo) => (
            <MenuItem key={i.value} onClick={() => onChooseKeys(i.value)}>
              {i.label}
            </MenuItem>
          ),
        )}
      </div>
    )
  }

  // 其他弹窗确认 - 部门或团队数组
  const onAddOtherConfirm = (list: Model.Calendar.MemberItem[]) => {
    const resultList = list.map((i: Model.Calendar.MemberItem) => ({
      ...i,
      type: isActiveKey,
      id: String(i.id).includes('team')
        ? Number(String(i.id).split('_')[2])
        : i.id,
    }))
    const newList = [...subscribedList, ...resultList]
    const result: Model.Calendar.MemberItem[] = onClearMore(newList)
    setSubscribedList(result)
  }

  // 删除选择的可订阅人群
  const onDeleteItem = (item: Model.Calendar.MemberItem) => {
    const resultList = subscribedList.filter(
      (i: Model.Calendar.MemberItem) => i.id !== item.id,
    )
    setSubscribedList(resultList)
  }

  // 创建日历确认事件
  const onCreateConfirm = async () => {
    await form.validateFields()
    const values = form.getFieldsValue()
    values.color = normalColor
    values.share_members = shareList.map((i: Model.Calendar.MemberItem) => ({
      user_id: i.id,
      user_group_id: i.permission,
      is_owner: i.is_owner ?? 2,
    }))
    values.subscribe_members = subscribedList.map(
      (i: Model.Calendar.MemberItem) => ({
        object_id: String(i.id),
        object_type: i.type,
      }),
    )
    values.icon = path
    values.permission = currentPermission
    if (calendarModal?.params?.id) {
      await editCalendar(values, calendarModal?.params?.id)
    } else {
      await addCalendar(values)
    }
    dispatch(getCalendarList())
    onClose()
    message.success(
      calendarModal?.params?.id
        ? t('calendarManager.editSuccess')
        : t('calendarManager.createSuccess'),
    )
  }

  // 更新共享成员
  const onUpdateShare = (item: Model.Calendar.MemberItem, type: string) => {
    let resultList
    if (type === 'update') {
      resultList = shareList.map((i: Model.Calendar.MemberItem) => ({
        ...i,
        permission: i.id === item.id ? item.permission : i.permission,
      }))
    } else {
      resultList = shareList.filter(
        (i: Model.Calendar.MemberItem) => i.id !== item.id,
      )
    }
    setShareList(resultList as Model.Calendar.MemberItem[])
  }

  // 转让日历
  const onTransferCalendar = (id: number, value: number) => {
    let resultList
    if (value === 1) {
      resultList = shareList.map((i: Model.Calendar.MemberItem) => ({
        ...i,
        is_owner: i.id === id ? 1 : 2,
        permission: i.id === id ? 1 : i.permission,
      }))
    } else {
      resultList = shareList
        .filter((i: Model.Calendar.MemberItem) => i.is_owner !== 1)
        .map((i: Model.Calendar.MemberItem) => ({
          ...i,
          is_owner: i.id === id ? 1 : 2,
          permission: i.id === id ? 1 : i.permission,
        }))
    }
    setShareList(resultList as Model.Calendar.MemberItem[])
  }

  // 获取日历详情
  const getCalendarInfoData = async () => {
    const response = await getCalendarInfo({
      id: calendarModal?.params?.id,
    })
    setCalendarInfo(response as Model.Calendar.CalendarInfo)
    if (response.is_default === 1) {
      response.name = response.user.name
    }
    form.setFieldsValue(response)
    setNormalColor(response.color)
    setPath(response.icon)
    setCurrentPermission(response.permission)
    setShareList(
      response.share_members.map((i: any) => ({
        id: i.user_id,
        name: i.user.name,
        permission: i.user_group_id,
        is_owner: i.is_owner,
      })),
    )
    setSubscribedList(
      response.subscribe_members.map((i: any) => ({
        id: i.object_id,
        name:
          i.object_id === '0'
            ? t('calendarManager.calendar_all_member')
            : i.object?.name,
        type: i.object_type,
      })),
    )
  }

  useEffect(() => {
    if (calendarModal?.params?.id) {
      getCalendarInfoData()
    }
  }, [calendarModal])

  useEffect(() => {
    if (calendarModal.visible && relateConfig) {
      setPath(relateConfig.calendar.icon_path?.[0])
      setCurrentPermission(relateConfig.calendar.permission_types[0]?.value)
    }
  }, [calendarModal.visible, relateConfig])

  // 共享成员才有权限选择
  const addMemberProps =
    currentKey === 'share'
      ? {
          isCalendar: true,
          isPermisGroup: true,
          projectPermission: relateConfig.calendar.user_group_ids,
          userGroupId: 3,
        }
      : {}

  return (
    <>
      <NewAddUserModalForTandD
        title={t('calendarManager.add_a_member')}
        state={2}
        isVisible={isChooseVisible}
        onConfirm={onAddConfirm}
        onClose={() => setIsChooseVisible(false)}
        {...addMemberProps}
      />

      <AddDepartmentOrTeamModal
        isVisible={isChooseOtherVisible}
        onClose={() => setIsChooseOtherVisible(false)}
        onConfirm={onAddOtherConfirm}
        type={isActiveKey}
      />
      <CommonModal
        isVisible={calendarModal.visible}
        title={
          calendarModal?.params?.id
            ? t('calendarManager.edit_calendar')
            : t('calendarManager.create_calendar')
        }
        width={528}
        onClose={onClose}
        onConfirm={onCreateConfirm}
        confirmText={
          calendarModal?.params?.id
            ? t('calendarManager.confirm2')
            : t('calendarManager.create')
        }
      >
        <FormWrap layout="vertical" form={form}>
          <Form.Item
            label={t('calendarManager.calendar_name_text')}
            name="name"
            rules={[{ required: true, message: '' }]}
            getValueFromEvent={event => {
              // eslint-disable-next-line require-unicode-regexp
              return event.target.value.replace(/(?<start>^\s*)/g, '')
            }}
          >
            <Input
              autoComplete="off"
              ref={inputRefDom as any}
              placeholder={t('calendarManager.please_enter_a_calendar_name')}
              allowClear
              maxLength={30}
              autoFocus
              disabled={calendarInfo?.is_default === 1}
            />
          </Form.Item>
          <Form.Item
            label={t('calendarManager.calendar_description')}
            name="describe"
          >
            <Input.TextArea
              autoComplete="off"
              placeholder={t(
                'calendarManager.please_enter_a_calendar_description',
              )}
              allowClear
              maxLength={200}
              autoFocus
              autoSize={{ maxRows: 5 }}
            />
          </Form.Item>
          <Form.Item
            label={<FormTitleSmall text={t('calendarManager.Permission')} />}
          >
            <PermissionBox>
              <div className="select">
                <CustomSelect
                  onChange={(value: number) => {
                    setCurrentPermission(value)
                    setSubscribedList(value === 1 ? [] : subscribedList)
                  }}
                  placeholder={t('calendarManager.please_select_permissions')}
                  optionLabelProp="label"
                  value={currentPermission}
                >
                  {relateConfig.calendar.permission_types.map(
                    (i: Model.Calendar.GetRelateConfigCommonInfo) => (
                      <Select.Option
                        value={i.value}
                        key={i.value}
                        label={i.label}
                      >
                        <MoreOptions
                          type="promise"
                          name={i.label}
                          dec={i.describe}
                        />
                      </Select.Option>
                    ),
                  )}
                </CustomSelect>
              </div>
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
                      onChangeColor={val => {
                        setNormalColor(val)
                        setIsVisible(false)
                      }}
                    />
                  </ColorWrap>
                }
              >
                <div
                  className="color"
                  style={{ background: colorMap[normalColor] }}
                />
              </Popover>
            </PermissionBox>
          </Form.Item>
          <Form.Item
            label={t('calendarManager.shared_calendar_members') + '111'}
          >
            <CommonButton
              icon="plus"
              type="primaryText"
              iconPlacement="left"
              onClick={() => onAddMember('share')}
            >
              {t('calendarManager.add_a_member')}
            </CommonButton>
            {shareList.map((i: Model.Calendar.MemberItem) => (
              <ShareMemberItem key={i.id}>
                <CommonUserAvatar avatar={i.avatar} name={i.name} />
                {i.is_owner === 1 && (
                  <div className="notCanOperation">
                    {t('calendarManager.administrators')}
                  </div>
                )}
                {i.is_owner !== 1 && (
                  <PermissionDrop
                    onUpdateShare={onUpdateShare}
                    onTransfer={onTransferCalendar}
                    item={i}
                    calendarInfo={calendarInfo}
                  />
                )}
              </ShareMemberItem>
            ))}
          </Form.Item>
          {currentPermission !== 1 && (
            <Form.Item label={t('calendarManager.subscribable_audience')}>
              <Popover
                trigger={['hover']}
                content={chooseMemberType}
                placement="bottomLeft"
                getPopupContainer={node => node}
                visible={isAddVisible}
                onVisibleChange={visible => setIsAddVisible(visible)}
              >
                <div style={{ width: 'max-content' }}>
                  <CommonButton
                    icon="plus"
                    type="primaryText"
                    iconPlacement="left"
                  >
                    {t('calendarManager.add_a_member')}
                  </CommonButton>
                </div>
              </Popover>
              <SubscribedItems size={16}>
                {subscribedList.map((i: Model.Calendar.MemberItem) => (
                  <SubscribedItem key={i.id} size={8}>
                    {i.type === 2 && (
                      <CommonUserAvatar size="small" avatar={i.avatar} />
                    )}
                    {i.type === 4 && (
                      <DepartmentIcon>
                        <IconFont type="branch" />
                      </DepartmentIcon>
                    )}
                    {i.type === 3 && (
                      <TeamIcon>
                        <IconFont type="team-2" />
                      </TeamIcon>
                    )}
                    {i.type === 1 && (
                      <TeamIcon>
                        <IconFont type="userAll" />
                      </TeamIcon>
                    )}
                    <span>{i.name}</span>
                    <IconFont type="close" onClick={() => onDeleteItem(i)} />
                  </SubscribedItem>
                ))}
              </SubscribedItems>
            </Form.Item>
          )}

          <Form.Item label={t('calendarManager.chooseIcon')}>
            <ChooseIconOrUpload
              color={path}
              hiddenUpload={hiddenUpload}
              colorList={relateConfig.calendar.icon_path}
              onChangeValue={(val: any, state) => onChangePath(val, state)}
            />
          </Form.Item>
        </FormWrap>
      </CommonModal>
    </>
  )
}

export default CalendarFormModal
