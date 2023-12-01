import React from 'react'
import styled from '@emotion/styled'
import ProjectCommonOperation from '@/components/CommonProjectComponent/CommonHeader'
import { useDispatch } from '@store/index'
import { onFilter } from '@store/kanBan/kanBan.thunk'
import useProjectType from '../hooks/useProjectType'
import useI18n from '@/hooks/useI18n'

interface TopAreaProps {}

const TopArea: React.FC<TopAreaProps> = props => {
  const dispatch = useDispatch()
  const { t } = useI18n()
  const { projectType } = useProjectType()
  const keyword = projectType === 1 ? t('need') : t('affairs')
  const title = t('search_keywords_or_numbers', {
    keyword,
  })
  return (
    <ProjectCommonOperation
      title={title}
      onInputSearch={async val => {
        dispatch(onFilter())
      }}
      showSearchInput={false}
    />
  )
}

export default TopArea
