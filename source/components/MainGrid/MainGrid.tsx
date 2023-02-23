// 项目列表卡片模式

/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable no-undefined */
/* eslint-disable @typescript-eslint/naming-convention */
import ProjectCard from '@/components/ProjectCard'
import styled from '@emotion/styled'
import { Space } from 'antd'
import { useNavigate } from 'react-router-dom'
import IconFont from '@/components/IconFont'
import { getIsPermission } from '@/tools'
import { useTranslation } from 'react-i18next'
import NoData from '@/components/NoData'
import { encryptPhp } from '@/tools/cryptoPhp'
import { SecondButton } from '@/components/StyleCommon'
import { useDispatch, useSelector } from '@store/index'
import { AddProject, DataWrap, SpaceWrap } from './style'
import { changeCreateVisible } from '@store/create-propject'

import { HoverIcon } from '../ProjectCard/style'

interface Props {
  onChangeOperation(type: string, id: number, e?: any): void
  onChangeVisible(): void
  projectList: any
  onAddClear?(): void
  // 是否有筛选条件
  hasFilter?: boolean
}

const MainGrid = (props: Props) => {
  const dispatch = useDispatch()
  const [t] = useTranslation()
  const navigate = useNavigate()
  const { userInfo } = useSelector(store => store.user)
  const isPermission = getIsPermission(
    userInfo?.company_permissions,
    'b/project/save',
  )

  const onToDetail = (item: any) => {
    const params = encryptPhp(JSON.stringify({ id: item.id }))
    navigate(`/Detail/Demand?data=${params}`)
  }

  const onAddClick = () => {
    props.onChangeVisible()
    props.onAddClear?.()
  }

  return (
    <DataWrap>
      {!!props.projectList?.list &&
        (props.projectList?.list?.length > 0 ? (
          <SpaceWrap size={24}>
            {props.projectList.list?.map((item: any) => (
              <div key={item.id}>
                <ProjectCard
                  onChangeOperation={props.onChangeOperation}
                  item={item}
                  key={item.id}
                ></ProjectCard>
              </div>
            ))}
          </SpaceWrap>
        ) : isPermission ? (
          <NoData />
        ) : (
          <NoData
            subText={isPermission ? '' : t('version2.noDataCreateProject')}
            haveFilter={props?.hasFilter}
          >
            {!isPermission && (
              <SecondButton onClick={onAddClick} style={{ marginTop: 24 }}>
                {t('common.createProject')}
              </SecondButton>
            )}
          </NoData>
        ))}
    </DataWrap>
  )
}

export default MainGrid
