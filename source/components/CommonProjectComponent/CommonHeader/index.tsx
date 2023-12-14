import { getParamsData } from '@/tools'
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import CommonIconFont from '../../CommonIconFont'
import InputSearch from '../../InputSearch'
import { MemberIcon, SearchBox, SearchOrProjectMember } from './style'
import MyBreadcrumb from '../../MyBreadcrumb'
import { t } from 'i18next'
import CommonMember from '../CommonMember'

interface Props {
  onInputSearch(value: string): void
  title?: string
}

const ProjectCommonOperation = (props: Props) => {
  const [memberVisible, setMemberVisible] = useState(false)
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData.id

  return (
    <>
      <SearchBox>
        <div
          style={{
            paddingLeft: '24px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <MyBreadcrumb headerParmas />
        </div>
        <SearchOrProjectMember size={16}>
          <InputSearch
            isDemand
            leftIcon
            placeholder={
              props?.title ??
              (t('search_for_the_requirement_name_or_number') as string)
            }
            onChangeSearch={props.onInputSearch}
          />
          <MemberIcon onClick={() => setMemberVisible(true)}>
            <CommonIconFont type="team" color="var(--neutral-n2)" size={20} />
          </MemberIcon>
        </SearchOrProjectMember>
      </SearchBox>
      <CommonMember
        visible={memberVisible}
        onChangeVisible={() => setMemberVisible(!memberVisible)}
        projectId={projectId}
      />
    </>
  )
}

export default ProjectCommonOperation
