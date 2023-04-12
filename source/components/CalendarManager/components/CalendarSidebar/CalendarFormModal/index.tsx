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
import AddMemberCommonModal from '@/components/AddUser/CommonModal'
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

interface PermissionDropProps {
  onUpdateShare(item: Model.Calendar.MemberItem, type: string): void
  item: Model.Calendar.MemberItem
}

const PermissionDrop = (props: PermissionDropProps) => {
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
    // 调用转让日历接口并更新
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
      <PermissionDropItem onClick={() => setIsTransferVisible(true)}>
        转让日历
      </PermissionDropItem>
      <PermissionDropItem
        onClick={() => setIsDeleteVisible(true)}
        style={{ color: 'var(--function-error)' }}
      >
        移除成员
      </PermissionDropItem>
    </PermissionDropBox>
  )

  return (
    <>
      <DeleteConfirm
        isVisible={isDeleteVisible}
        title="移除成员"
        onConfirm={onDeleteMember}
        onChangeVisible={() => setIsDeleteVisible(false)}
        text="确认移除成员"
      />

      <CommonModal
        isVisible={isTransferVisible}
        onClose={() => setIsTransferVisible(false)}
        onConfirm={onTransferCalendar}
        title="转让日历"
      >
        <TransferContent>
          <Radio.Group
            onChange={(e: RadioChangeEvent) => setTransferValue(e.target.value)}
            value={transferValue}
          >
            <Radio value={1}>转让我退出该日历</Radio>
            <Radio value={2}>转让我变为管理员</Radio>
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
  const [currentPermission, setCurrentPermission] = useState<number>()

  // 关闭创建日历弹窗
  const onClose = () => {
    setNormalColor(0)
    setIsActiveKey(null)
    setCurrentKey('')
    setShareList([])
    setSubscribedList([])
    setCurrentPermission(relateConfig.calendar.permission_types[0].value)
    dispatch(setCalendarModal({ visible: false, params: {} }))
    form.resetFields()
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
    let obj: any = {}
    const result: Model.Calendar.MemberItem[] = newList.reduce(
      (cur: Model.Calendar.MemberItem[], next: Model.Calendar.MemberItem) => {
        obj[next.id] ? '' : (obj[next.id] = true && cur.push(next))
        return cur
      },
      [],
    )
    currentKey === 'share' ? setShareList(result) : setSubscribedList(result)
    setIsChooseVisible(false)
  }

  // 订阅人群选择的key
  const onChooseKeys = (key: number) => {
    setIsAddVisible(false)
    setIsActiveKey(key as Model.Calendar.ChooseAddType)
    switch (key) {
      case 1:
        setSubscribedList([
          ...[
            {
              id: -1,
              name: '全员',
              type: 1 as Model.Calendar.ChooseAddType,
            },
          ],
          ...subscribedList,
        ])
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
    }))
    setSubscribedList([...new Set([...subscribedList, ...resultList])])
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
        object_id: i.id,
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
    message.success(calendarModal?.params?.id ? '编辑成功!' : '创建成功!')
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
    setShareList(resultList)
  }

  // 获取日历详情
  const getCalendarInfoData = async () => {
    const response = await getCalendarInfo({
      id: calendarModal?.params?.id,
    })
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
        name: i.object.name,
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
    setPath(relateConfig.calendar.icon_path?.[0])
    setCurrentPermission(relateConfig.calendar.permission_types[0]?.value)
  }, [relateConfig])

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
      {isChooseVisible && (
        <AddMemberCommonModal
          isVisible={isChooseVisible}
          title="添加成员"
          onClose={() => setIsChooseVisible(false)}
          onConfirm={onAddConfirm}
          {...addMemberProps}
        />
      )}
      <AddDepartmentOrTeamModal
        isVisible={isChooseOtherVisible}
        onClose={() => setIsChooseOtherVisible(false)}
        onConfirm={onAddOtherConfirm}
        type={isActiveKey}
      />
      <CommonModal
        isVisible={calendarModal.visible}
        title={calendarModal?.params?.id ? '编辑日历' : '创建日历'}
        width={528}
        onClose={onClose}
        onConfirm={onCreateConfirm}
        confirmText={calendarModal?.params?.id ? '确认' : '创建'}
      >
        <FormWrap layout="vertical" form={form}>
          <Form.Item
            label="日历名称"
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
              placeholder="请输入日历名称"
              allowClear
              maxLength={30}
              autoFocus
            />
          </Form.Item>
          <Form.Item label="日历描述" name="describe">
            <Input
              autoComplete="off"
              placeholder="请输入日历描述"
              allowClear
              maxLength={200}
              autoFocus
            />
          </Form.Item>
          <Form.Item label={<FormTitleSmall text="权限" />}>
            <PermissionBox>
              <div className="select">
                <CustomSelect
                  onChange={setCurrentPermission}
                  placeholder="请选择权限"
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
          {currentPermission !== 1 && (
            <>
              <Form.Item label="共享日历成员">
                <CommonButton
                  icon="plus"
                  type="primaryText"
                  iconPlacement="left"
                  onClick={() => onAddMember('share')}
                >
                  添加成员
                </CommonButton>
                {shareList.map((i: Model.Calendar.MemberItem) => (
                  <ShareMemberItem key={i.id}>
                    <CommonUserAvatar avatar={i.avatar} name={i.name} />
                    {i.is_owner === 1 && (
                      <div className="notCanOperation">管理员</div>
                    )}
                    {i.is_owner !== 1 && (
                      <PermissionDrop onUpdateShare={onUpdateShare} item={i} />
                    )}
                  </ShareMemberItem>
                ))}
              </Form.Item>
              <Form.Item label="可订阅人群">
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
                      添加成员
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
            </>
          )}

          <Form.Item label="选择图标">
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
