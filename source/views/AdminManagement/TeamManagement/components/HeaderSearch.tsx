import IconFont from '@/components/IconFont'
import styled from '@emotion/styled'
import InputSearch from './InputSearch'
const HeaderWrap = styled.div`
  width: 100%;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #ecedef;
`
const TitleWrap = styled.div`
  font-size: var(--font14);
  font-weight: 500;
  color: var(--neutral-n1-d1);
  display: flex;
  align-items: center;
`
const SearchBox = styled.div`
  display: flex;
`
const ButtonStyle = styled.div`
  min-width: 88px;
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
const HeaderSearch = () => {
  return (
    <HeaderWrap>
      <TitleWrap>
        <IconFont
          type="team-8a8gio2p"
          style={{ fontSize: 16, color: ' #98ACE0', marginRight: 8 }}
        />
        <span>团队名称</span>
      </TitleWrap>
      <SearchBox>
        <InputSearch
          width="202"
          length={12}
          placeholder="请输入昵称姓名邮箱电话"
          onChange={() => 1223}
          onBlur={() => 35}
        />
        <ButtonStyle>添加成员</ButtonStyle>
      </SearchBox>
    </HeaderWrap>
  )
}
export default HeaderSearch
