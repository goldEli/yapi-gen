/* eslint-disable react/jsx-no-leaked-render */
import ChooseIconOrUpload from '@/components/ChooseIconOrUpload'
import CommonButton from '@/components/CommonButton'
import CommonModal from '@/components/CommonModal'
import CustomSelect from '@/components/CustomSelect'
import FormTitleSmall from '@/components/FormTitleSmall'
import MoreOptions from '@/components/MoreOptions'
import { getCalendarIconList } from '@/services/calendar'
import {
  Form,
  Input,
  Popover,
  Radio,
  type RadioChangeEvent,
  Select,
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

interface PermissionDropProps {
  onUpdateShare(item: Model.Calendar.MemberItem): void
  item: Model.Calendar.MemberItem
}

const PermissionDrop = (props: PermissionDropProps) => {
  const [isVisible, setIsVisible] = useState(false)
  // 移除成员
  const [isDeleteVisible, setIsDeleteVisible] = useState(false)
  // 转让日历
  const [isTransferVisible, setIsTransferVisible] = useState(false)
  // 转让日历选中的值
  const [transferValue, setTransferValue] = useState(1)

  const permissionList = [
    { name: '管理员', sub: '管理日历及共享设置', id: 1 },
    { name: '编辑者', sub: '创建及修改日程', id: 2 },
    { name: '订阅者', sub: '查看所有日程详情', id: 3 },
    { name: '游客', sub: '只能查看日程忙碌空闲状态', id: 4 },
  ]

  // 转让日历
  const onTransferCalendar = () => {
    // 调用转让日历接口并更新
  }

  //  移除成员
  const onDeleteMember = () => {
    // 删除成员并更新
    setIsDeleteVisible(false)
  }

  // 改变权限
  const onChangePermission = (i: { id: number; name: string; sub: string }) => {
    const newItem = { ...props.item, permission: i.id }
    props.onUpdateShare(newItem)
    setIsVisible(false)
  }

  const operation = (
    <PermissionDropBox>
      {permissionList.map((i: { id: number; name: string; sub: string }) => (
        <PermissionDropItem key={i.id} onClick={() => onChangePermission(i)}>
          <span className="title">{i.name}</span>
          <span className="sub">{i.sub}</span>
        </PermissionDropItem>
      ))}
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
              permissionList.filter(
                (i: Model.Calendar.MemberItem) =>
                  i.id === props.item.permission,
              )[0]?.name
            }
          </span>
          <IconFont className="icon" type={isVisible ? 'up' : 'down'} />
        </div>
      </Popover>
    </>
  )
}

interface CalendarFormModalProps {
  visible: boolean
  onCancel(): void
}

const CalendarFormModal = (props: CalendarFormModalProps) => {
  const [form] = Form.useForm()
  const inputRefDom = useRef<HTMLInputElement>(null)
  // 创建日历默认主题色
  const [normalColor, setNormalColor] = useState(0)
  // 是否显示选择颜色
  const [isVisible, setIsVisible] = useState(false)
  const [hiddenUpload, setHiddenUpload] = useState(false)
  const [path, setPath] = useState<string>('')
  const [pathList, setPathList] = useState<any>()
  // 选择成员显示
  const [isChooseVisible, setIsChooseVisible] = useState(false)
  // 选择其他显示
  const [isChooseOtherVisible, setIsChooseOtherVisible] = useState(false)
  // 当前选中的下拉key
  const [isActiveKey, setIsActiveKey] = useState<Model.Calendar.ChooseAddType>()
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
  const [currentPermission, setCurrentPermission] = useState(null)

  const permissionList = [
    { id: 0, name: '私密', dec: '仅共享成员可访问' },
    { id: 1, name: '公开', dec: '可被搜索到，显示日程详情' },
    {
      id: 3,
      name: '仅显示忙碌状态',
      dec: '可被搜索到，仅向他人显示日程忙碌空闲',
    },
  ]

  // 关闭创建日历弹窗
  const onClose = () => {
    setNormalColor(0)
    setIsActiveKey('')
    setCurrentKey('')
    setShareList([])
    setSubscribedList([])
    setCurrentPermission(null)
    props.onCancel()
  }

  // 切换图标
  const onChangePath = (val: { id: number; path: string }, state: number) => {
    setPath(val.path)
    state === 1 ? setHiddenUpload(true) : setHiddenUpload(false)
  }

  // 获取日历图标列表
  const getPathList = async () => {
    const response = await getCalendarIconList()
    setPathList(response.data.list)
    setPath(response.data.list[0].path)
  }

  // 点击添加成员
  const onAddMember = (key: string) => {
    setCurrentKey(key)
    setIsChooseVisible(true)
  }

  // 选中的共享成员
  const onAddConfirm = (list: Model.Calendar.MemberItem[]) => {
    const resultList = list.map((i: Model.Calendar.MemberItem) => ({
      ...i,
      type: isActiveKey,
      permission: 4,
    }))
    currentKey === 'share'
      ? setShareList([...new Set([...shareList, ...resultList])])
      : setSubscribedList([...new Set([...subscribedList, ...resultList])])
    setIsChooseVisible(false)
  }

  // 订阅人群选择的key
  const onChooseKeys = (key: string) => {
    setIsAddVisible(false)
    setIsActiveKey(key as 'member' | 'team' | 'department')
    switch (key) {
      case 'all':
        setSubscribedList([
          ...[
            {
              id: -1,
              name: '全员',
              type: 'all' as Model.Calendar.ChooseAddType,
            },
          ],
          ...subscribedList,
        ])
        break
      case 'member':
        onAddMember('subscribeable')
        break
      default:
        setIsChooseOtherVisible(true)
        break
    }
  }

  // 订阅成员下拉
  const chooseMemberType = () => {
    const menuItems = [
      {
        key: 'all',
        label: '全员',
      },
      {
        key: 'member',
        label: '添加成员',
      },
      {
        key: 'department',
        label: '添加部门',
      },
      {
        key: 'team',
        label: '添加团队',
      },
    ]
    return (
      <div style={{ padding: '4px 0' }}>
        {menuItems.map((i: { key: string; label: string }) => (
          <MenuItem key={i.key} onClick={() => onChooseKeys(i.key)}>
            {i.label}
          </MenuItem>
        ))}
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
    values.shareIds = shareList.map((i: Model.Calendar.MemberItem) => ({
      id: i.id,
      permission: i.permission,
    }))
    values.subscribedIds = subscribedList.map(
      (i: Model.Calendar.MemberItem) => i.id,
    )
    values.path = path
    values.permission = currentPermission
    // console.log(values)
  }

  // 修改共享成员的权限
  const onUpdateShare = (item: Model.Calendar.MemberItem) => {
    const resultList = shareList.map((i: Model.Calendar.MemberItem) => ({
      ...i,
      permission: i.id === item.id ? item.permission : i.permission,
    }))
    setShareList(resultList)
  }

  useEffect(() => {
    if (props.visible) {
      getPathList()
    }
  }, [props.visible])

  return (
    <>
      {isChooseVisible && (
        <AddMemberCommonModal
          isVisible={isChooseVisible}
          title="添加成员"
          onClose={() => setIsChooseVisible(false)}
          onConfirm={onAddConfirm}
        />
      )}
      <AddDepartmentOrTeamModal
        isVisible={isChooseOtherVisible}
        onClose={() => setIsChooseOtherVisible(false)}
        onConfirm={onAddOtherConfirm}
        type={isActiveKey}
      />
      <CommonModal
        isVisible={props.visible}
        title="创建日历"
        width={528}
        onClose={onClose}
        onConfirm={onCreateConfirm}
        confirmText="创建"
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
                >
                  {permissionList.map((i: any) => (
                    <Select.Option value={i.id} key={i.id} label={i.name}>
                      <MoreOptions type="promise" name={i.name} dec={i.dec} />
                    </Select.Option>
                  ))}
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
            </PermissionBox>
          </Form.Item>
          {currentPermission !== 0 && (
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
                    {/* <div className="notCanOperation">管理员</div> */}
                    <PermissionDrop onUpdateShare={onUpdateShare} item={i} />
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
                      {i.type === 'member' && (
                        <CommonUserAvatar size="small" avatar={i.avatar} />
                      )}
                      {i.type === 'department' && (
                        <DepartmentIcon>
                          <IconFont type="branch" />
                        </DepartmentIcon>
                      )}
                      {i.type === 'team' && (
                        <TeamIcon>
                          <IconFont type="team-2" />
                        </TeamIcon>
                      )}
                      {i.type === 'all' && (
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
              colorList={pathList}
              onChangeValue={(val: any, state) => onChangePath(val, state)}
            />
          </Form.Item>
        </FormWrap>
      </CommonModal>
    </>
  )
}

export default CalendarFormModal
