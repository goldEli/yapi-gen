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
import { DataWrap, ScrollBox, SpaceWrap, SpaceWrapItem } from './style'
import { changeCreateVisible, setProjectType } from '@store/create-propject'
import CommonButton from '../CommonButton'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Skeleton } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { getMsg_list } from '@/services/SiteNotifications'
import _ from 'lodash'
import { getProjectList } from '@/services/project'
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
  const [page, setPage] = useState(1)
  const [data, setData] = useState<any>()
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
  const _getMsg_list = async (isInit: boolean, page: number) => {
    const res = await getProjectList({
      pageSize: 30,
      page: page,
    })

    if (isInit) {
      setData(res)
    } else {
      const oldData = _.cloneDeep(data.list)
      const newData = _.cloneDeep(res.list)

      setData({
        ...res,
        list: [...oldData, ...newData],
      })
    }
  }
  const onAddClick = () => {
    dispatch(changeCreateVisible(true))
  }
  const hasMore = useMemo(() => {
    if (!data?.list) {
      return false
    }
    const allTask = data?.list
    if (allTask?.length < data?.total) {
      return true
    }
    return false
  }, [data])
  const fetchMoreData = () => {
    const pages = page + 1
    setPage(pages)
    _getMsg_list(false, pages)
  }
  useEffect(() => {
    _getMsg_list(true, 1)
  }, [])
  return (
    <DataWrap>
      {data?.list?.length > 0 ? (
        <ScrollBox id="scrollableDiv">
          <InfiniteScroll
            dataLength={data?.list?.length ? data?.list?.length : 0}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={<Skeleton paragraph={{ rows: 1 }} active />}
            scrollableTarget="scrollableDiv"
          >
            {data?.list?.map((item: any, index: any) => (
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
          </InfiniteScroll>
        </ScrollBox>
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
      )}
    </DataWrap>
  )
}

export default MainGrid
