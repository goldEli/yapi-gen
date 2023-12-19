import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ActionTabsWrap,
  ActionTabsMenuWrap,
  ActionTabsContent,
  MoreButton,
  AddItemModal,
} from '../style'
import LabelEditor from './LabelEditor'
import CommonIconFont from '@/components/CommonIconFont'
import { Form, Input, Popover, Space, Tooltip } from 'antd'
import CommonButton from '@/components/CommonButton'
import { useTranslation } from 'react-i18next'

type ActionTabs = {
  activeKey: number
  items: Array<{ label: string; id: number; children: any }>
  onChange(key: number): void
}

const ActionTabs = (props: ActionTabs) => {
  const { activeKey, items, onChange } = props
  const [showMore, setShowMore] = useState(false)
  const [showLength, setShowLength] = useState(0)
  const [addModalVisible, setAddModalVisible] = useState(false)
  const actionRef = useRef<any>()
  const [t] = useTranslation()
  const [form] = Form.useForm()

  useEffect(() => {
    if (actionRef.current && items?.length) {
      const wd = items.length * 92 + 150
      const width = actionRef.current?.getBoundingClientRect?.()?.width
      if (wd > width) {
        setShowMore(true)
        setShowLength(Math.floor((width - 150) / 92))
      }
    }
  }, [])

  const list = useMemo(() => {
    if (showLength) {
      return items
    }
    return items
  }, [showLength])

  useEffect(() => {
    if (!addModalVisible) {
      form.resetFields()
    }
  }, [addModalVisible])

  const addItems = async () => {
    const value = await form.validateFields()
  }

  const addContent = (
    <AddItemModal>
      <Form form={form} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
        <Form.Item
          label={<div className="titles">分类名称</div>}
          rules={[{ required: true, message: '请输入分类名称' }]}
          name="name"
        >
          <Input
            placeholder="请输入分类名称（最多12个字）"
            autoComplete="off"
            maxLength={12}
            autoFocus
          />
        </Form.Item>
        <div className="footer">
          <Space size={16}>
            <CommonButton
              type="light"
              onClick={() => {
                setAddModalVisible(false)
              }}
            >
              {t('common.cancel')}
            </CommonButton>
            <CommonButton onClick={addItems} type="primary">
              {t('common.confirm2')}
            </CommonButton>
          </Space>
        </div>
      </Form>
    </AddItemModal>
  )

  return (
    <ActionTabsWrap>
      <ActionTabsMenuWrap ref={actionRef}>
        {list.map((s: any) => (
          <LabelEditor
            onChange={onChange}
            item={s}
            activeKey={activeKey}
            key={s.id}
          />
        ))}
        {showMore ? (
          <MoreButton style={{ marginRight: 12 }}>
            <CommonIconFont type="down" color="var(--neutral-n2)" size={24} />
          </MoreButton>
        ) : null}
        {items.length < 20 ? (
          <Tooltip title="添加项目分类">
            <Popover
              placement="bottom"
              content={addContent}
              trigger="click"
              open={addModalVisible}
              onOpenChange={(val: boolean) => {
                setAddModalVisible(val)
              }}
            >
              <MoreButton>
                <CommonIconFont
                  type="plus"
                  color="var(--neutral-n2)"
                  size={24}
                />
              </MoreButton>
            </Popover>
          </Tooltip>
        ) : null}
      </ActionTabsMenuWrap>
      <ActionTabsContent>
        {items.find((i: any) => i.id === activeKey)?.children}
      </ActionTabsContent>
    </ActionTabsWrap>
  )
}
export default ActionTabs
