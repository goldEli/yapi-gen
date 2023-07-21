import { useSelector } from '@store/index'
import { Select } from 'antd'
import CommonIconFont from '../CommonIconFont'

const CustomSelect = ({ children, ...props }: any) => {
  const { fullScreen } = useSelector(store => store.kanBan)
  return fullScreen ? (
    <Select
      {...props}
      menuItemSelectedIcon={
        <CommonIconFont type="check" color="var(--primary-d1)" />
      }
      suffixIcon={<CommonIconFont type="down" />}
      ref={props.onRef}
      getPopupContainer={() =>
        document.getElementById('kanBanFullScreenBox') as any
      }
    >
      {children}
    </Select>
  ) : (
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
