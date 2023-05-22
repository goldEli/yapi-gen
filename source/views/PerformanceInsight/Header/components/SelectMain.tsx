import CommonIconFont from '@/components/CommonIconFont'
import CustomSelect from '@/components/CustomSelect'
import { Select } from 'antd'
interface Props {
  onChange: (key: number) => void
  list: Array<{ name: string; key: number }>
  placeholder: string
}
const SelectMain = (props: Props) => {
  return (
    <CustomSelect
      style={{ width: '184px' }}
      showArrow
      showSearch
      suffixIcon={<CommonIconFont type="down" />}
      placeholder={props.placeholder}
      onChange={(e: number) => {
        console.log(e, 'oo'), props.onChange(e)
      }}
      getPopupContainer={(node: any) => node}
      allowClear
    >
      {props.list?.map((i: any) => {
        return (
          <Select.Option value={i.key} key={i.key} label={i.name}>
            {i.name}
          </Select.Option>
        )
      })}
    </CustomSelect>
  )
}
export default SelectMain
