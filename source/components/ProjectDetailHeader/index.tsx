import { getParamsData } from '@/tools'
import styled from '@emotion/styled'
import { useDispatch, useSelector } from '@store/index'
import { setFilterKeys } from '@store/project'
import { Space } from 'antd'
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import CommonIconFont from '../CommonIconFont'
import InputSearch from '../InputSearch'
import Member from './Member'

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

interface Props {
  searchGroups: any
  onSearch(params: any): void
}

const ProjectDetailHeader = (props: Props) => {
  const [memberVisible, setMemberVisible] = useState(false)
  const [searchVal, setSearchVal] = useState('')
  const { filterKeys } = useSelector(store => store.project)
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData.id

  const onChangeSearch = (value: string) => {
    if (searchVal !== value) {
      setSearchVal(value)
      const params = props.searchGroups
      params.searchValue = value
      props.onSearch(params)
      // 添加搜索项 计数
      const keys = value
        ? [...filterKeys, ...['searchVal']]
        : filterKeys?.filter((i: any) => i !== 'searchVal')
      dispatch(setFilterKeys([...new Set(keys)]))
    }
  }

  return (
    <>
      <Header>
        <div>面包屑</div>
        <SearchOrProjectMember size={16}>
          <InputSearch
            onChangeSearch={onChangeSearch}
            placeholder="搜索需求名称或编号"
            leftIcon
          />
          <MemberIcon onClick={() => setMemberVisible(true)}>
            <CommonIconFont type="team" color="var(--neutral-n2)" size={20} />
          </MemberIcon>
        </SearchOrProjectMember>
      </Header>
      <Member
        visible={memberVisible}
        onChangeVisible={() => setMemberVisible(!memberVisible)}
        projectId={projectId}
      />
    </>
  )
}

export default ProjectDetailHeader
