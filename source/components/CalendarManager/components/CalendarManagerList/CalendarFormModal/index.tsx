import ChooseIconOrUpload from '@/components/ChooseIconOrUpload'
import CommonButton from '@/components/CommonButton'
import CommonModal from '@/components/CommonModal'
import CustomSelect from '@/components/CustomSelect'
import FormTitleSmall from '@/components/FormTitleSmall'
import MoreOptions from '@/components/MoreOptions'
import { ModalFooter } from '@/components/StyleCommon'
import { getCalendarIconList } from '@/services/calendar'
import styled from '@emotion/styled'
import { Form, Input, Popover, Select } from 'antd'
import { useEffect, useRef, useState } from 'react'
import CalendarColor from '../../CalendarColor'
import AddMemberCommonModal from '@/components/AddUser/CommonModal'
import CommonUserAvatar from '@/components/CommonUserAvatar'
import IconFont from '@/components/IconFont'

const FormWrap = styled(Form)`
  height: 60vh;
  overflow: auto;
  padding: 0 16px 0 24px;
`

const PermissionBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  .select {
    width: 92%;
  }
  .color {
    width: 24px;
    height: 24px;
    border-radius: 4px;
  }
`

const ColorWrap = styled.div`
  padding: 16px;
  width: 192px;
`

const ShareMemberItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
  height: 32px;
  border-radius: 6px;
  padding: 0 16px;
  background: var(--neutral-n8);
  &:hover {
    background: var(--hover-d2);
  }
  .notCanOperation {
    font-size: 12px;
    color: var(--neutral-n3);
  }
  .canOperation {
    display: flex;
    align-items: center;
    color: var(--neutral-n1-d1);
    font-size: 12px;
    cursor: pointer;
    .icon {
      margin-left: 4px;
      font-size: 14px;
    }
    &:hover {
      color: var(--primary-d2);
    }
  }
`

const PermissionDropBox = styled.div`
  border-radius: 6px;
  box-shadow: 0px 0px 15px 6px rgba(0, 0, 0, 0.12);
  padding: 4px 0;
  background: var(--neutral-white-d6);
  position: relative;
`

const PermissionDropItem = styled.div`
  padding: 5px 16px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  .title {
    font-size: 14px;
    color: var(--neutral-n1-d1);
  }
  .sub {
    font-size: 12px;
    color: var(--neutral-n4);
  }
  &:hover {
    background: var(--hover-d3);
  }
`

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
  const [isChooseVisible, setIsChooseVisible] = useState(false)
  const [currentKey, setCurrentKey] = useState('')
  const [shareList, setShareList] = useState<MemberItem[]>([])

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
        hasFooter={
          <ModalFooter size={16}>
            <CommonButton type="light" onClick={props.onCancel}>
              取消
            </CommonButton>
            <CommonButton type="primary">创建</CommonButton>
          </ModalFooter>
        }
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
                trigger={['click', 'hover']}
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
            <CommonButton
              icon="plus"
              type="primaryText"
              iconPlacement="left"
              onClick={() => onAddMember('subscribeable')}
            >
              添加成员
            </CommonButton>
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
