import React, { useEffect, useMemo, useState } from 'react'
import styled from '@emotion/styled'
import { Droppable } from 'react-beautiful-dnd'
import IssueCard from '../IssueCard'
import { handleId } from '../utils'
import DropCardList from '../DropCardList'
import useDropData from '../hooks/useDropData'
import DropCard from '../DropCard'
import { useSelector } from '@store/index'
import useGroupType from '../hooks/useGroupType'
import { DropArea } from '../Issues'
import { getNewkanbanStoriesOfPaginate } from '@/services/kanban'
import InfiniteScroll from 'react-infinite-scroll-component'

interface IssuesProps {
  issues: Model.KanBan.Column
  groupId: Model.KanbanConfig.Column['id']
  index: number
}

const IssuesForPriority: React.FC<IssuesProps> = props => {
  const { issues, groupId } = props
  const droppableId = useMemo(() => {
    return handleId(groupId, issues.id)
  }, [groupId, issues.id])
  const { movingStory, kanbanInfoByGroup } = useSelector(store => store.kanBan)
  const { groupType } = useGroupType()
  const { projectInfo } = useSelector(store => store.project)
  const { data } = useDropData(issues.id)
  const columnId = issues?.id

  const movingStoryIssuesIndex = useMemo(() => {
    const ret = kanbanInfoByGroup.find(item => item.id === groupId)
    return ret?.columns.findIndex(item => item.id === movingStory?.columnId)
  }, [kanbanInfoByGroup, groupId, movingStory])

  const showStateTransitionList = React.useMemo(() => {
    if (movingStoryIssuesIndex === props.index) {
      return false
    }
    const ret = !!movingStory && movingStory?.columnId !== columnId
    return ret
    // }

    // 跨分组可拖
    // return !!movingStory && movingStory?.columnId !== columnId
  }, [movingStory, columnId, movingStoryIssuesIndex, props.index])

  const dropCardListContent = (
    <DropCardList
      hidden={!showStateTransitionList}
      list={data}
      groupId={groupId}
      columnId={issues.id}
    />
  )
  const [mockData, setMockData] = useState<any>([])
  const [page, setPage] = useState(1)
  const fetchData = async () => {
    const res = await getNewkanbanStoriesOfPaginate({
      project_id: projectInfo.id,
      kanban_column_id: issues.id,

      pagesize: 10,
      page: page,
    })

    setMockData(res.list)
  }

  useEffect(() => {
    fetchData()
  }, [groupType, groupId])
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
  const fetchMoreData = async () => {
    const newPage = page + 1
    setPage(newPage)
    const res = await getNewkanbanStoriesOfPaginate({
      project_id: projectInfo.id,
      kanban_column_id: issues.id,
      pagesize: 5,
      page: newPage,
    })
    setTimeout(() => {
      setMockData((k: any) => k.concat(res.list))
    }, 500)
  }
  const issueCardListContent = (
    <InfiniteScroll
      loader={null}
      endMessage={
        <p style={{ textAlign: 'center' }}>
          <b>Yay! You have seen it all</b>
        </p>
      }
      style={{
        overflowY: 'auto',
        overflowX: 'hidden',
        height: '500px',
      }}
      height="500px"
      dataLength={mockData.length}
      next={fetchMoreData}
      hasMore={mockData?.length < issues.story_count}
    >
      {mockData?.map((story: any, index: any) => {
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
            hidden={hidden1 || hidden2}
            uuid={uuid}
            key={uuid}
            item={story}
            index={index}
            stories={mockData}
          />
        )
      })}
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
            key={droppableId}
            // active={snapshot.isDraggingOver}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {dropCardListContent}
            {issueCardListContent}
            {/* {snapshot.isDraggingOver ? (
              // 用空div占位来触发滚动条刷新页面
              <div style={{ height: '100vh' }}></div>
            ) : null} */}
            {provided.placeholder}
          </DropArea>
        )
      }}
    </Droppable>
  )
}

export default IssuesForPriority
