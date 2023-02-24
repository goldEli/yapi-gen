import styled from '@emotion/styled'
import { Space } from 'antd'
import CommonIconFont from '../CommonIconFont'
import InputSearch from '../InputSearch'

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 32px;
`

const SearchOrProjectMember = styled(Space)`
  display: flex;
  align-items: center;
`

const MemberIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--neutral-n6-d1);
  cursor: pointer;
  background: var(--neutral-white-d4);
`

const ProjectDetailHeader = () => {
  return (
    <Header>
      <div>面包屑</div>
      <SearchOrProjectMember size={16}>
        <InputSearch placeholder="搜索需求名称或编号" leftIcon />
        <MemberIcon>
          <CommonIconFont type="team" color="var(--neutral-n2)" size={20} />
        </MemberIcon>
      </SearchOrProjectMember>
    </Header>
  )
}

export default ProjectDetailHeader
