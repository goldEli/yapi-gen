import { getParamsData } from '@/tools'
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import CommonIconFont from '../CommonIconFont'
import InputSearch from '../InputSearch'
import Member from './Member'
import { MemberIcon, SearchBox, SearchOrProjectMember } from './style'
import MyBreadcrumb from '../MyBreadcrumb'

interface Props {
  onInputSearch(value: string): void
}

const ProjectCommonOperation = (props: Props) => {
  const [memberVisible, setMemberVisible] = useState(false)
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData.id

  return (
    <>
      <SearchBox>
        <div>
          <MyBreadcrumb />
        </div>
        <SearchOrProjectMember size={16}>
          <InputSearch
            leftIcon
            placeholder="请输入"
            onChangeSearch={props.onInputSearch}
          />
          <MemberIcon onClick={() => setMemberVisible(true)}>
            <CommonIconFont type="team" color="var(--neutral-n2)" size={20} />
          </MemberIcon>
        </SearchOrProjectMember>
      </SearchBox>
      <Member
        visible={memberVisible}
        onChangeVisible={() => setMemberVisible(!memberVisible)}
        projectId={projectId}
      />
    </>
  )
}

export default ProjectCommonOperation
