import React, { useEffect, useMemo, useRef, useState } from 'react'
import styled from '@emotion/styled'
import { Droppable } from 'react-beautiful-dnd'
import IssueCard from '../IssueCard'
import { handleId } from '../utils'
import DropCardList from '../DropCardList'
import useDropData from '../hooks/useDropData'
import DropCard from '../DropCard'
import { store, useDispatch, useSelector } from '@store/index'
import useGroupType from '../hooks/useGroupType'
import { FixedSizeList } from 'react-window'
import InfiniteScroll from 'react-infinite-scroll-component'
import { getNewkanbanStoriesOfPaginate } from '@/services/kanban'
import { setKanbanInfoByGroup } from '@store/kanBan'
import { json } from 'stream/consumers'
import _ from 'lodash'
import NoData from '@/components/NoData'
interface IssuesProps {
  issues: Model.KanBan.Column
  groupId: Model.KanbanConfig.Column['id']
}

export const DropArea = styled.div<{ active?: boolean; minHeight?: number }>`
  min-height: ${props => props.minHeight}px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  background: ${props => (props.active ? 'red' : 'var(--neutral-n8)')};
  width: 302px;
  box-sizing: border-box;
  padding: 16px;
  padding-right: 0px;
  gap: 8px;
  position: relative;
`

const DropStatusArea = styled.div`
  width: 100%;
  height: 100px;
  box-sizing: border-box;
  border: 1px solid purple;
  &:hover {
    border: 1px solid green;
  }
`
const Issues: React.FC<IssuesProps> = props => {
  const { issues, groupId } = props

  const droppableId = useMemo(() => {
    return handleId(groupId, issues.id)
  }, [groupId, issues.id])
  const mockDataCopy = useRef<any>()
  mockDataCopy.current = issues.stories
  const { movingStory, kanbanInfoByGroup, fullScreen } = useSelector(
    store => store.kanBan,
  )

  const { groupType } = useGroupType()
  const columnId = issues.id
  const { projectInfo } = useSelector(store => store.project)
  const { data } = useDropData(issues.id)
  const showStateTransitionList = React.useMemo(() => {
    // 人员分组和类别分组，只有同组才能转换状态
    // if (groupType === 'users' || groupType === 'category') {
    const ret =
      !!movingStory &&
      movingStory?.groupId === groupId &&
      movingStory?.columnId !== columnId
    return ret
    // }

    // 跨分组可拖
    // return !!movingStory && movingStory?.columnId !== columnId
  }, [movingStory, columnId, data, groupId, groupType])

  // const showStateTransitionList = true
  const dropCardListContent = (
    <DropCardList
      hidden={!showStateTransitionList}
      list={data}
      groupId={groupId}
      columnId={issues.id}
    />
  )
  const [page, setPage] = useState(1)
  const dispatch = useDispatch()
  const checkGroup = () => {
    let obj
    switch (groupType) {
      case 'users':
        obj = {
          kanban_group_id: groupId,
        }
        break
      case 'category':
        obj = {
          category_id: groupId,
        }
        break

      default:
        // eslint-disable-next-line no-undefined
        obj = undefined
        break
    }
    return obj
  }

  function findAndReplace(
    groupId: any,
    issuesId: any,
    newStories: any,
    data1: any,
  ) {
    const cc = JSON.parse(JSON.stringify(newStories))
    let data: any
    data = cc.map((item: any) => {
      if (item.id === groupId) {
        item.columns = item.columns.map((column: any) => {
          if (column.id === issuesId) {
            column.stories = data1
          }
          return column
        })
      }
      return item
    })
    return data
  }

  // const issueCardListContent = issues.stories?.map((story, index) => {
  //   const uuid = `${groupId}-${issues.id}-${story.id}`
  //   // 如果是 人员或者类型分组 不能跨组拖动，需要隐藏卡片
  //   const hidden1 =
  //     !!movingStory &&
  //     (groupType === 'users' || groupType === 'category') &&
  //     movingStory?.groupId !== groupId
  //   // 如果当前展示状态转换释放区域，需要隐藏卡片
  //   const hidden2 = showStateTransitionList
  //   return (
  //     <IssueCard
  //       hidden={hidden1 || hidden2}
  //       uuid={uuid}
  //       key={uuid}
  //       item={story}
  //       index={index}
  //       stories={issues.stories}
  //     />
  //   )
  // })
  function bbh(data: any) {
    const filteredData: any = {}

    for (const key in data) {
      if (key.includes('custom')) {
        filteredData[key] = data[key]
      }
    }
    return filteredData
  }

  const fetchMoreData = async () => {
    const { valueKey, inputKey } = store.getState().view
    const newPage = page + 1
    setPage(newPage)
    const params2 = {
      search: {
        ...valueKey,
        user_id: valueKey.user_name,
        category_id: valueKey.category,
        iterate_id: valueKey.iterate_name,
        custom_field: bbh(valueKey),
        keyword: inputKey,
        schedule_start: valueKey?.schedule?.start,
        schedule_end: valueKey?.schedule?.end,
        ...{ ...checkGroup() },
      },
      kanban_column_id: issues.id,
      project_id: projectInfo.id,
      pagesize: 20,
      page: newPage,
    }

    const res = await getNewkanbanStoriesOfPaginate({
      ...params2,
    })
    dispatch(
      setKanbanInfoByGroup(
        findAndReplace(
          groupId,
          issues.id,
          kanbanInfoByGroup,
          issues.stories.concat(res.list),
        ),
      ),
    )
  }

  const issueCardListContent = (
    <InfiniteScroll
      loader={null}
      style={{
        overflowY: 'auto',
        overflowX: 'hidden',
        height:
          groupType === 'none'
            ? `calc( 100vh - ${fullScreen ? '130px' : '300px'})`
            : '700px',
      }}
      height={
        groupType === 'none'
          ? `calc( 100vh - ${fullScreen ? '130px' : '300px'})`
          : '700px'
      }
      dataLength={issues.stories?.length}
      next={fetchMoreData}
      hasMore
    >
      {issues.stories?.map((story, index) => {
        const uuid = `${groupId}-${issues.id}-${story.id}`
        // 如果是 人员或者类型分组 不能跨组拖动，需要隐藏卡片
        const hidden1 =
          !!movingStory &&
          (groupType === 'users' || groupType === 'category') &&
          movingStory?.groupId !== groupId
        // 如果当前展示状态转换释放区域，需要隐藏卡片
        const hidden2 = showStateTransitionList
        return (
          <IssueCard
            cid={issues.id}
            groupId={groupId}
            hidden={hidden1 || hidden2}
            uuid={uuid}
            key={uuid}
            item={story}
            index={index}
            stories={issues.stories}
          />
        )
      })}
      {issues.stories.length < 1 && <NoData />}
    </InfiniteScroll>
  )

  const minHeight =
    showStateTransitionList && data.length > 0 ? data.length * 156 + 20 : 100
  return (
    <Droppable
      key={droppableId}
      droppableId={droppableId}
      type="drop-status"
      // isDropDisabled={false}
    >
      {(provided, snapshot) => {
        return (
          <DropArea
            minHeight={minHeight}
            // active={snapshot.isDraggingOver}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {dropCardListContent}
            {issueCardListContent}

            {provided.placeholder}
          </DropArea>
        )
      }}
    </Droppable>
  )
}

export default Issues
