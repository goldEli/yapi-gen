// 项目列表卡片模式

/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable no-undefined */
/* eslint-disable @typescript-eslint/naming-convention */
import ProjectCard from '@/components/ProjectCard'
import { useNavigate } from 'react-router-dom'
import { getIsPermission } from '@/tools'
import { useTranslation } from 'react-i18next'
import NoData from '@/components/NoData'
import { encryptPhp } from '@/tools/cryptoPhp'
import { useDispatch, useSelector } from '@store/index'
import { DataWrap, SpaceWrap, SpaceWrapItem } from './style'
import { changeCreateVisible, setProjectType } from '@store/create-propject'
import CommonButton from '../CommonButton'

interface Props {
  onChangeOperation(type: string, id: number, e?: any): void
  projectList: any
  onAddClick(): void
  // 是否有筛选条件
  hasFilter?: boolean
  // 关注与取消关注
  onChangeStar(type: number, row: any): void
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

  // 点击跳转项目详情
  const onClickItem = (row: any) => {
    dispatch(setProjectType(row.prefix))
    const params = encryptPhp(
      JSON.stringify({
        id: row.id,
      }),
    )

    navigate(
      `${
        row.defaultHomeMenu
          ? row.defaultHomeMenu
          : `/ProjectDetail/${row.projectType === 2 ? 'Affair' : 'Demand'}`
      }?data=${params}`,
    )
  }

  const onAddClick = () => {
    dispatch(changeCreateVisible(true))
  }

  return (
    <DataWrap>
      {!!props.projectList?.list &&
        (props.projectList?.list?.length > 0 ? (
          <SpaceWrap>
            {props.projectList.list?.map((item: any, index: any) => (
              <SpaceWrapItem key={item.id} onClick={() => onClickItem(item)}>
                <div className={`app-${index}`}>
                  <ProjectCard
                    onChangeOperation={props.onChangeOperation}
                    item={item}
                    key={item.id}
                  ></ProjectCard>
                </div>
              </SpaceWrapItem>
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
              <CommonButton
                type="light"
                onClick={onAddClick}
                style={{ marginTop: 24 }}
              >
                {t('common.createProject')}
              </CommonButton>
            )}
          </NoData>
        ))}
    </DataWrap>
  )
}

export default MainGrid
