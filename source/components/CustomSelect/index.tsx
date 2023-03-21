import { Select } from 'antd'
import CommonIconFont from '../CommonIconFont'

const CustomSelect = ({ children, ...props }: any) => {
  return (
    <Select
      {...props}
      menuItemSelectedIcon={
        <CommonIconFont type="check" color="var(--primary-d1)" />
      }
    >
      {children}
    </Select>
  )
}

export default CustomSelect
