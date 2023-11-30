import IconFont from '@/components/IconFont'
import styled from '@emotion/styled'
import InputSearch from '@/components/InputSearch'
import { useSelector } from '@store/index'
import { useTranslation } from 'react-i18next'
import ScreenMinHover from '@/components/ScreenMinHover'
import CommonButton from '@/components/CommonButton'

const HeaderWrap = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
`
const TitleWrap = styled.div`
  font-size: var(--font14);
  font-family: siyuanmedium;
  color: var(--neutral-n1-d1);
  display: flex;
  align-items: center;
`
const HeaderSearch = (props: {
  onSetSearchVal: any
  onRefresh(): void
  onShowAddMemberModal(): void
}) => {
  const { activeTeam } = useSelector(s => s.teams)
  const [t] = useTranslation()
  return (
    <div>
      <HeaderWrap>
        <TitleWrap>
          {activeTeam?.logo_info?.path ? (
            <img
              src={activeTeam?.logo_info?.path}
              style={{ width: 16, height: 16, marginRight: 8 }}
            />
          ) : (
            <IconFont
              type="team-8a8gio2p"
              style={{ fontSize: 16, color: ' #98ACE0', marginRight: 8 }}
            />
          )}
          <span>{activeTeam?.name}</span>
        </TitleWrap>
        <CommonButton
          type="secondaryText1"
          onClick={props.onShowAddMemberModal}
        >
          {t('add_a_member') as string}
        </CommonButton>
      </HeaderWrap>
      <HeaderWrap>
        <InputSearch
          width={210}
          bgColor="var(--neutral-white-d4)"
          length={12}
          placeholder={t('please_enter_your_nickname_name_email_phone_number')}
          onChangeSearch={(value: string) => props.onSetSearchVal(value)}
          leftIcon
        />
        <ScreenMinHover
          label={t('common.refresh')}
          icon="sync"
          style={{ marginLeft: 24 }}
          onClick={props.onRefresh}
        />
      </HeaderWrap>
    </div>
  )
}

export default HeaderSearch
