import ChooseIconOrUpload from '@/components/ChooseIconOrUpload'
import CommonButton from '@/components/CommonButton'
import CommonModal from '@/components/CommonModal'
import CustomSelect from '@/components/CustomSelect'
import FormTitleSmall from '@/components/FormTitleSmall'
import MoreOptions from '@/components/MoreOptions'
import { getCalendarIconList } from '@/services/calendar'
import { Form, Input, Popover, Select } from 'antd'
import { useEffect, useRef, useState } from 'react'
import CalendarColor from '../../CalendarColor'
import AddMemberCommonModal from '@/components/AddUser/CommonModal'
import CommonUserAvatar from '@/components/CommonUserAvatar'
import IconFont from '@/components/IconFont'
import {
  ColorWrap,
  FormWrap,
  MenuItem,
  PermissionBox,
  PermissionDropBox,
  PermissionDropItem,
  ShareMemberItem,
} from './style'

interface PermissionDropProps {
  //
}

const PermissionDrop = (props: PermissionDropProps) => {
  const [isVisible, setIsVisible] = useState(false)
  const permissionList = [
    { name: '管理员', sub: '管理日历及共享设置', id: 1 },
    { name: '编辑者', sub: '创建及修改日程', id: 2 },
    { name: '订阅者', sub: '查看所有日程详情', id: 3 },
    { name: '游客', sub: '只能查看日程忙碌空闲状态', id: 4 },
  ]

  const operation = (
    <PermissionDropBox>
      {permissionList.map((i: { id: number; name: string; sub: string }) => (
        <PermissionDropItem key={i.id}>
          <span className="title">{i.name}</span>
          <span className="sub">{i.sub}</span>
        </PermissionDropItem>
      ))}
    </PermissionDropBox>
  )

  return (
    <Popover
      open={isVisible}
      onOpenChange={setIsVisible}
      trigger={['click', 'hover']}
      placement="bottomRight"
      content={operation}
      getPopupContainer={n => n}
    >
      <div className="canOperation">
        <span className="name">参与者</span>
        <IconFont className="icon" type={isVisible ? 'up' : 'down'} />
      </div>
    </Popover>
  )
}

interface CalendarFormModalProps {
  visible: boolean
  onCancel(): void
}

interface MemberItem {
  id: number
  name: string
  avatar: string
}

const CalendarFormModal = (props: CalendarFormModalProps) => {
  const [form] = Form.useForm()
  const inputRefDom = useRef<HTMLInputElement>(null)
  // 创建日历默认主题色
  const [normalColor, setNormalColor] = useState('#6688FF')
  // 是否显示选择颜色
  const [isVisible, setIsVisible] = useState(false)
  const [hiddenUpload, setHiddenUpload] = useState(false)
  const [path, setPath] = useState<string>('')
  const [pathList, setPathList] = useState<any>()
  // 选择成员显示
  const [isChooseVisible, setIsChooseVisible] = useState(false)
  // 选择部门显示
  const [isChooseDepartmentVisible, setIsChooseDepartmentVisible] =
    useState(false)
  // 选择团队显示
  const [isChooseTeamVisible, setIsChooseTeamVisible] = useState(false)
  // 选择是否全员
  const [isAll, setIsAll] = useState(false)
  // 当前是哪个key添加人员
  const [currentKey, setCurrentKey] = useState('')
  // 共享成员数组
  const [shareList, setShareList] = useState<MemberItem[]>([])
  // 订阅成员数组
  const [subscribeableList, setSubscribeableList] = useState<MemberItem[]>([])
  // 可订阅人群下拉选择
  const [isAddVisible, setIsAddVisible] = useState(false)

  const permissionList = [
    { id: 0, name: '私密', dec: '仅共享成员可访问' },
    { id: 1, name: '公开', dec: '可被搜索到，显示日程详情' },
    {
      id: 3,
      name: '仅显示忙碌状态',
      dec: '可被搜索到，仅向他人显示日程忙碌空闲',
    },
  ]

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
  const onAddConfirm = (list: MemberItem[]) => {
    setShareList(list)
    setIsChooseVisible(false)
  }

  // 订阅人群选择的key
  const onChooseKeys = (key: string) => {
    setIsAddVisible(false)
    switch (key) {
      case 'all':
        setIsAll(true)
        break
      case 'member':
        onAddMember('subscribeable')
        break
      case 'department':
        setIsChooseDepartmentVisible(true)
        break
      case 'team':
        setIsChooseTeamVisible(true)
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
        key: '添加团队',
        label: '团队',
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
      <CommonModal
        isVisible={props.visible}
        title="创建日历"
        width={528}
        onClose={props.onCancel}
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
          <Form.Item label={<FormTitleSmall text="权限" />} name="permission">
            <PermissionBox>
              <div className="select">
                <CustomSelect placeholder="请选择权限" optionLabelProp="label">
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
                <div className="color" style={{ background: normalColor }} />
              </Popover>
            </PermissionBox>
          </Form.Item>
          <Form.Item label="共享日历成员">
            <CommonButton
              icon="plus"
              type="primaryText"
              iconPlacement="left"
              onClick={() => onAddMember('share')}
            >
              添加成员
            </CommonButton>
            {shareList.map((i: MemberItem) => (
              <ShareMemberItem key={i.id}>
                <CommonUserAvatar avatar={i.avatar} name={i.name} />
                {/* <div className="notCanOperation">管理员</div> */}
                <PermissionDrop />
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
          </Form.Item>
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
