import { Input } from 'antd'
import { useEffect, useState, useRef } from 'react'
import { TabMenuItem } from '../style'

type LabelEditorProps = {
  item: any
  activeKey: string
  onChange(key: string): void
}

const LabelEditor = (props: LabelEditorProps) => {
  const { item, activeKey, onChange } = props
  const [isEdit, setIsEdit] = useState(false)
  const [isShow, setIsShow] = useState(false)
  const [value, setValue] = useState('')
  const labelRef = useRef<any>()

  useEffect(() => {
    setValue(item?.label)
  }, [item?.label])

  useEffect(() => {
    if (
      labelRef.current &&
      item.label &&
      labelRef.current.getBoundingClientRect().width === 80
    ) {
      setIsShow(true)
    }
  }, [])

  return (
    <TabMenuItem
      isActive={activeKey === item.key}
      key={item.key}
      onClick={() => onChange(item.key)}
    >
      {isShow ? (
        <img
          width={28}
          height={28}
          src="https://mj-system-1308485183.cos.accelerate.myqcloud.com/public/light.png"
        />
      ) : isEdit ? (
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
          <div>
            <span
              className="label"
              onClick={() => {
                setIsEdit(true)
              }}
            >
              {item?.label}
            </span>
          </div>
          <div className="number">
            <span>1个项目</span>
          </div>
        </>
      )}
    </TabMenuItem>
  )
}
export default LabelEditor
