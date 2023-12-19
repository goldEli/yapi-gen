import CommonIconFont from '@/components/CommonIconFont'
import { MoreItemModalItem } from '../style'
import { Input, Typography } from 'antd'
import { useEffect, useState } from 'react'
const { Text } = Typography

type EditorItemLabelProps = {
  item: any
  activeKey: number
  onChange(key: number): void
  open(val: any): void
}

const EditorItemLabel = (props: EditorItemLabelProps) => {
  const { item, open } = props
  const [isEdit, setIsEdit] = useState(false)
  const [value, setValue] = useState('')

  useEffect(() => {
    setValue(item?.label)
  }, [item?.label])
  return (
    <MoreItemModalItem>
      {isEdit ? (
        <Input
          width="100%"
          autoFocus
          value={value}
          onChange={(e: any) => {
            setValue(e.target.value)
          }}
          onBlur={() => {
            setIsEdit(false)
          }}
        />
      ) : (
        <>
          <Text style={{ width: '100%' }} ellipsis={{ tooltip: item.label }}>
            {item.label}
          </Text>
          <div className="operate">
            <div
              className="editBox"
              style={{ marginRight: 14 }}
              onClick={() => {
                setIsEdit(true)
              }}
            >
              <CommonIconFont type="edit" color="var(--neutral-n2)" size={16} />
            </div>
            <div
              className="editBox"
              onClick={() => {
                open({
                  title: '是否删除该分类',
                  text: '删除后，项目可在「所有项目」标签下找到',
                  okText: '删除',
                  cancelText: '再想想',
                  onConfirm: () => {
                    return Promise.resolve()
                  },
                })
              }}
            >
              <CommonIconFont
                type="delete"
                color="var(--neutral-n2)"
                size={16}
              />
            </div>
          </div>
        </>
      )}
    </MoreItemModalItem>
  )
}

export default EditorItemLabel
