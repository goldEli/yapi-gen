import { useSelector } from '@store/index'
import { LayoutHeaderLeftWrap } from '../style'
import CommonIconFont from '@/components/CommonIconFont'

const LayoutHeaderLeft = () => {
  const { currentMenu, menuIconList } = useSelector(store => store.user)
  return (
    <LayoutHeaderLeftWrap>
      <CommonIconFont
        type={
          menuIconList?.filter((k: any) =>
            String(currentMenu?.url).includes(k.key),
          )[0]?.normal
        }
        size={24}
        color="var(--neutral-n2)"
      />
      <div>{currentMenu?.name}</div>
    </LayoutHeaderLeftWrap>
  )
}

export default LayoutHeaderLeft
