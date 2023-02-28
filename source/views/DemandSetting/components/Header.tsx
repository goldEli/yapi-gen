import CommonIconFont from '@/components/CommonIconFont'
import styled from '@emotion/styled'
import { Switch } from 'antd'

const HeaderWrap = styled.div`
  height: 66px;
  display: flex;
  margin: 0 24px;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--neutral-n6-d1);
`
const LeftMsg = styled.div`
  display: flex;
  align-items: flex-start;
`
const RightOperate = styled.div`
  display: flex;
  align-items: center;
`
const MsgContent = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 8px;
  div:nth-child(1) {
    color: var(--neutral-n1-d1);
    font-size: 14px;
  }
  div:nth-child(2) {
    color: var(--neutral-n3);
    font-size: 12px;
  }
`
const SwitchStyle = styled.div`
  display: flex;
  align-items: center;
  color: var(--neutral-n3);
  font-size: 14px;
`
const BtnStyle = styled.div`
  display: inline-block;
  width: auto;
  height: 32px;
  border-radius: 6px;
  background: var(--hover-d2);
  color: var(--neutral-n2);
  padding: 0 16px;
  margin-left: 16px;
  line-height: 32px;
  text-align: center;
  &:hover {
    cursor: pointer;
  }
`
const Header = () => {
  return (
    <HeaderWrap>
      <LeftMsg>
        <CommonIconFont type="left" size={24} />
        <MsgContent>
          <div>策划需求</div>
          <div>
            需求描述需求描述需求描述需求描述需求描述需求描述需求描述需求描述
          </div>
        </MsgContent>
      </LeftMsg>
      <RightOperate>
        <SwitchStyle>
          <span style={{ marginRight: '8px' }}>启用状态</span>
          <Switch checked={false} />
        </SwitchStyle>
        <BtnStyle>配置工作流</BtnStyle>
        <BtnStyle>编辑</BtnStyle>
        <BtnStyle>删除</BtnStyle>
      </RightOperate>
    </HeaderWrap>
  )
}
export default Header
