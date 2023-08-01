import IconFont from '@/components/IconFont'
import styled from '@emotion/styled'
import InputSearch from '@/components/InputSearch'
import { useSelector } from '@store/index'
import { useTranslation } from 'react-i18next'
import { DividerWrap, HoverWrap } from '@/components/StyleCommon'
import ScreenMinHover from '@/components/ScreenMinHover'
import { Space } from 'antd'
import CommonButton from '@/components/CommonButton'

const HeaderWrap = styled.div`
  width: 100%;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--neutral-n6-d1);
  margin-bottom: 20px;
`
const TitleWrap = styled.div`
  font-size: var(--font14);
  font-family: siyuanmedium;
  color: var(--neutral-n1-d1);
  display: flex;
  align-items: center;
`
const SearchBox = styled.div`
  display: flex;
`
const ButtonStyle = styled.div`
  white-space: nowrap;
  /* min-width: 88px; */
  height: 32px;
  font-size: var(--font14);
  color: var(--neutral-white-d7);
  background: var(--auxiliary-b1);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 24px;
  padding: 0 16px;
  &:hover {
    cursor: pointer;
  }
`

const HeaderSearch = (props: {
  onSetSearchVal: any
  onRefresh(): void
  onShowAddMemberModal(): void
}) => {
  const { activeTeam } = useSelector(s => s.teams)
  const [t] = useTranslation()
  return (
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
      <SearchBox>
        <Space size={24}>
          <InputSearch
            width={202}
            bgColor="var(--neutral-white-d4)"
            length={12}
            placeholder={t(
              'please_enter_your_nickname_name_email_phone_number',
            )}
            onChangeSearch={(value: string) => props.onSetSearchVal(value)}
            leftIcon
          />
          <CommonButton type="primary" onClick={props.onShowAddMemberModal}>
            {t('add_a_member') as string}
          </CommonButton>
        </Space>

        <ScreenMinHover
          label={t('common.refresh')}
          icon="sync"
          style={{ marginLeft: 24 }}
          onClick={props.onRefresh}
        />
      </SearchBox>
    </HeaderWrap>
  )
}

export default HeaderSearch
