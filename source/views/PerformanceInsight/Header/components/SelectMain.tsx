import CommonIconFont from '@/components/CommonIconFont'
import CustomSelect from '@/components/CustomSelect'
import { Select } from 'antd'
interface Props {
  onChange: (key: number) => void
  list: Array<{ name: string; key: number }> | undefined
  placeholder: string
  value: number
  allowClear: boolean
  labelInValue?: boolean
}
const SelectMain = (props: Props) => {
  return (
    <CustomSelect
      style={{ width: '184px' }}
      showArrow
      showSearch
      value={props.value}
      suffixIcon={<CommonIconFont type="down" />}
      placeholder={props.placeholder}
      onChange={(e: number) => {
        props.onChange(e)
      }}
      labelInValue={props.labelInValue}
      getPopupContainer={(node: any) => node}
      allowClear={props?.allowClear || false}
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
