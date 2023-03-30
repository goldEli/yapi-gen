import ChooseIconOrUpload from '@/components/ChooseIconOrUpload'
import CommonButton from '@/components/CommonButton'
import CommonModal from '@/components/CommonModal'
import CustomSelect from '@/components/CustomSelect'
import FormTitleSmall from '@/components/FormTitleSmall'
import MoreOptions from '@/components/MoreOptions'
import { ModalFooter } from '@/components/StyleCommon'
import styled from '@emotion/styled'
import { Form, Input, Popover, Select, Space } from 'antd'
import { useRef, useState } from 'react'
import CalendarColor from '../../CalendarColor'

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

interface CalendarFormModalProps {
  visible: boolean
  onCancel(): void
}

const CalendarFormModal = (props: CalendarFormModalProps) => {
  const [form] = Form.useForm()
  const inputRefDom = useRef<HTMLInputElement>(null)
  // 创建日历默认主题色
  const [normalColor, setNormalColor] = useState('#6688FF')
  // 是否显示选择颜色
  const [isVisible, setIsVisible] = useState(false)
  const [hiddenUpload, setHiddenUpload] = useState(false)
  const [path, setPath] = useState<any>('')
  const [pathList, setPathList] = useState<any>()

  const permissionList = [
    { id: 0, name: '私密', dec: '仅共享成员可访问' },
    { id: 1, name: '公开', dec: '可被搜索到，显示日程详情' },
    {
      id: 3,
      name: '仅显示忙碌状态',
      dec: '可被搜索到，仅向他人显示日程忙碌空闲',
    },
  ]

  const onChangePath = (val: { id: number; path: string }, state: any) => {
    setPath(val.path)
    state === 1 ? setHiddenUpload(true) : setHiddenUpload(false)
  }

  return (
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
        <Form.Item label="共享日历成员"></Form.Item>
        <Form.Item label="可订阅人群"></Form.Item>
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
  )
}

export default CalendarFormModal
