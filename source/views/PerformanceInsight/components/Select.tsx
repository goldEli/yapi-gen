import { Select } from 'antd'
import { useState } from 'react'
import CommonUserAvatar from '@/components/CommonUserAvatar'
import { Segm } from './style'
import CommonIconFont from '@/components/CommonIconFont'

interface ItemProps {
  label: string
  value: string
  id: string
  avatar: string | undefined
}
interface Props {
  onChange: (data: string[]) => void
  onShowAll: () => void
  onSearch: (value: string) => void
  options: Array<ItemProps>
  more: boolean
}
const SelectMain = (props: Props) => {
  const [value, setValue] = useState<string[]>([])
  const [searchValue, setSearchValue] = useState<string>('')
  const onSearch = (e: string) => {
    setSearchValue(e)
    props.onSearch(e)
  }
  const changeValue = (newValue: string[]) => {
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
        suffixIcon={<CommonIconFont type="down" />}
        onSearch={onSearch}
        onChange={changeValue}
        showSearch
        allowClear
        getPopupContainer={node => node}
        searchValue={searchValue}
        value={value}
        placeholder="请选择"
        showArrow={true}
        autoClearSearchValue
        filterOption={false}
        dropdownStyle={{ minWidth: 184 }}
        dropdownMatchSelectWidth={false}
        dropdownRender={menu => (
          <>
            {menu}
            {!props.more && (
              <Segm onClick={() => props.onShowAll()}>查看更多</Segm>
            )}
          </>
        )}
      >
        {props.options?.map((item: any) => {
          return (
            <>
              <Select.Option key={`${item.id}`} value={`${item.value}`}>
                <CommonUserAvatar
                  name={item.value}
                  fontSize={14}
                  avatar={item.avatar}
                />
              </Select.Option>
            </>
          )
        })}
      </Select>
    </>
  )
}
export default SelectMain
