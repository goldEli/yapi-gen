import { Select } from 'antd'
import { Segm } from './style'
import CommonIconFont from '@/components/CommonIconFont'

interface ItemProps {
  label: string
  value: string
  id: string
  avatar?: string | undefined
}
interface Props {
  onChange: (data: number[]) => void
  onShowAll?: () => void
  onSearch?: (value: string) => void
  onAllProject?: (type: string) => void
  options: Array<ItemProps>
  more: boolean
  placeholder: string
  value: number[] | [] | undefined
  type: string
}
const SelectMain = (props: Props) => {
  const changeValue = (newValue: number[]) => {
    props.onChange(newValue)
  }
  return (
    <>
      <Select
        style={{ minWidth: 184 }}
        maxTagCount={1}
        mode="multiple"
        value={props.value}
        options={props.options}
        suffixIcon={<CommonIconFont type="down" />}
        onChange={changeValue}
        showSearch
        optionFilterProp="label"
        allowClear={true}
        getPopupContainer={(node: any) => node}
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
            {props.type === 'iteration' && (
              <Segm onClick={() => props.onAllProject?.(props.type)}>
                全部工作项
              </Segm>
            )}
            {props.type === 'sprint' && (
              <Segm onClick={() => props.onAllProject?.(props.type)}>
                全部冲刺
              </Segm>
            )}
          </>
        )}
      ></Select>
    </>
  )
}
export default SelectMain
