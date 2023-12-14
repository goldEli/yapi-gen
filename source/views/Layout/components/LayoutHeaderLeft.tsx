import { useSelector } from '@store/index'
import { LayoutHeaderLeftWrap } from '../style'
import CommonIconFont from '@/components/CommonIconFont'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { setLayoutSecondaryMenuLeftWidth } from '@store/global'

const LayoutHeaderLeft = () => {
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const { currentMenu, menuIconList, isRefresh } = useSelector(
    store => store.user,
  )
  useEffect(() => {
    if (currentMenu?.id) {
      dispatch(
        setLayoutSecondaryMenuLeftWidth(
          document.getElementById('LayoutHeaderLeftWrap')?.clientWidth || 0,
        ),
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
        {currentMenu?.url === '/Trends' &&
        currentMenu?.name === 'container.dynamics'
          ? t('history')
          : null}
        {currentMenu?.url === '/AdminManagement'
          ? t('managementBackend')
          : currentMenu?.isRegular
          ? t(currentMenu?.name)
          : currentMenu?.name}
      </div>
    </LayoutHeaderLeftWrap>
  )
}

export default LayoutHeaderLeft
