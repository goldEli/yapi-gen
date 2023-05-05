import { Select } from 'antd'
import CommonIconFont from '../CommonIconFont'

const CustomSelect = ({ children, ...props }: any) => {
  return (
    <Select
      {...props}
      menuItemSelectedIcon={
        <CommonIconFont type="check" color="var(--primary-d1)" />
      }
      suffixIcon={<CommonIconFont type="down" />}
      ref={props.onRef}
    >
      {children}
    </Select>
  )
}

export default CustomSelect
