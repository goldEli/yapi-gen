import CommonIconFont from '@/components/CommonIconFont'
import CustomSelect from '@/components/CustomSelect'
import { Select } from 'antd'
interface Props {
  onChange: (key: number) => void
}
const TimeMain = (props: Props) => {
  const list = [
    {
      name: '近7天',
      key: 7,
    },
    {
      name: '近15天',
      key: 15,
    },
    {
      name: '近1月',
      key: 1,
    },
    {
      name: '近3个月',
      key: 3,
    },
    {
      name: '自定义',
      key: 0,
    },
  ]
  return (
    <CustomSelect
      style={{ width: '184px' }}
      showArrow
      showSearch
      suffixIcon={<CommonIconFont type="down" />}
      placeholder={'按周期'}
      onChange={(e: number) => {
        console.log(e, 'oo'), props.onChange(e)
      }}
      getPopupContainer={(node: any) => node}
      allowClear
    >
      {list?.map((i: any) => {
        return (
          <Select.Option value={i.key} key={i.key} label={i.name}>
            {i.name}
          </Select.Option>
        )
      })}
    </CustomSelect>
  )
}
export default TimeMain
