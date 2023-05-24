import { Select } from 'antd'
import { useState } from 'react'
import { Segm } from './style'
import CommonIconFont from '@/components/CommonIconFont'

interface ItemProps {
  label: string
  value: string
  id: string
  avatar: string | undefined
}
interface Props {
  onChange: (data: number[]) => void
  onShowAll?: () => void
  onSearch?: (value: string) => void
  options: Array<ItemProps>
  more: boolean
  placeholder: string
}
const SelectMain = (props: Props) => {
  const [value, setValue] = useState<number[]>([])
  const [searchValue, setSearchValue] = useState<string>('')
  const onSearch = (e: string) => {
    setSearchValue(e)
    props.onSearch?.(e)
  }
  const changeValue = (newValue: number[]) => {
    console.log(newValue, 'newValue')
    setValue(newValue)
    props.onChange(newValue)
  }
  return (
    <>
      <Select
        style={{ width: 184 }}
        maxTagCount={1}
        mode="multiple"
        options={props.options}
        suffixIcon={<CommonIconFont type="down" />}
        onChange={changeValue}
        showSearch
        optionFilterProp="label"
        allowClear
        getPopupContainer={(node: any) => node}
        value={value}
        placeholder={props.placeholder}
        showArrow={true}
        autoClearSearchValue
        dropdownStyle={{ minWidth: 184 }}
        dropdownMatchSelectWidth={false}
        dropdownRender={(menu: any) => (
          <>
            {menu}
            {!props.more && (
              <Segm onClick={() => props.onShowAll?.()}>查看更多</Segm>
            )}
          </>
        )}
      ></Select>
    </>
  )
}
export default SelectMain
