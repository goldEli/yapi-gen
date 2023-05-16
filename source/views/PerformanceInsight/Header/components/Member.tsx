import { Select } from 'antd'
import { useState } from 'react'
import CommonUserAvatar from '@/components/CommonUserAvatar'

interface ItemProps {
  label: string
  value: string
  id: string
  avatar: string | undefined
}
interface Props {
  onChange: (data: string[]) => void
}

const options: ItemProps[] = []

for (let i = 10; i < 36; i++) {
  const value = i.toString(36) + i
  options.push({
    label: `Long Label: ${value}`,
    value,
    id: value,
    avatar: '',
  })
}
const Member = (props: Props) => {
  const [value, setValue] = useState<string[]>([])
  const changeValue = (newValue: string[]) => {
    setValue(newValue)
    props.onChange(newValue)
  }
  return (
    <>
      <Select
        style={{ width: 184 }}
        notFoundContent={null}
        maxTagCount={1}
        mode="multiple"
        onChange={changeValue}
        showSearch
        allowClear
        getPopupContainer={node => node}
        value={value}
        defaultActiveFirstOption={false}
        placeholder="全员"
        showArrow={false}
        autoClearSearchValue
        filterOption={false}
        dropdownStyle={{ minWidth: 184 }}
        dropdownMatchSelectWidth={false}
      >
        {options?.map((item: any) => {
          return (
            <Select.Option key={`${item.id}`} value={`${item.value}`}>
              <CommonUserAvatar
                name={item.value}
                fontSize={14}
                avatar={item.avatar}
              />
            </Select.Option>
          )
        })}
      </Select>
    </>
  )
}
export default Member
