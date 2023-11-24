import { useSelector } from '@store/index'
import { LayoutHeaderLeftWrap } from '../style'
import CommonIconFont from '@/components/CommonIconFont'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface LayoutHeaderLeftProps {
  onSetWidth(width: number): void
}

const LayoutHeaderLeft = (props: LayoutHeaderLeftProps) => {
  const [t] = useTranslation()
  const { currentMenu, menuIconList, isRefresh } = useSelector(
    store => store.user,
  )
  useEffect(() => {
    if (currentMenu?.id) {
      props.onSetWidth(
        document.getElementById('LayoutHeaderLeftWrap')?.clientWidth || 0,
      )
    }
  }, [isRefresh, currentMenu])

  return (
    <LayoutHeaderLeftWrap id="LayoutHeaderLeftWrap">
      <CommonIconFont
        type={
          menuIconList?.filter((k: any) =>
            String(currentMenu?.url).includes(k.key),
          )[0]?.normal
        }
        size={24}
        color="var(--neutral-n2)"
      />
      <div>
        {/* 单独处理后台得翻译 */}
        {currentMenu?.url === '/AdminManagement'
          ? t('managementBackend')
          : currentMenu.isRegular
          ? t(currentMenu.name)
          : currentMenu.name}
      </div>
    </LayoutHeaderLeftWrap>
  )
}

export default LayoutHeaderLeft
