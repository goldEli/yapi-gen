import { useSelector } from '@store/index'
import PermissionWrap from '@/components/PermissionWrap'
import { useTranslation } from 'react-i18next'
import useSetTitle from '@/hooks/useSetTitle'
import CalendarManager from '@/components/CalendarManager'
import styled from '@emotion/styled'

const Wrap = styled.div`
  background-color: var(--neutral-white-d2);
  height: 100%;
  width: 100%;
`

const CalendarPage = () => {
  const asyncSetTtile = useSetTitle()
  const [t] = useTranslation()
  asyncSetTtile(t('calendarManager.calendar'))
  const { menuPermission } = useSelector(store => store.user)

  return (
    <Wrap>
      <PermissionWrap
        auth="/CalendarManager"
        permission={menuPermission?.menus?.map((i: any) => i.url)}
      >
        <CalendarManager />
      </PermissionWrap>
    </Wrap>
  )
}

export default CalendarPage
