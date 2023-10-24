import React, { useEffect, useMemo, useRef, useState } from 'react'
import styled from '@emotion/styled'
import { Droppable } from 'react-beautiful-dnd'
import IssueCard from '../IssueCard'
import { handleId } from '../utils'
import DropCardList from '../DropCardList'
import useDropData from '../hooks/useDropData'
import DropCard from '../DropCard'
import { useSelector } from '@store/index'
import useGroupType from '../hooks/useGroupType'
import { FixedSizeList } from 'react-window'
import InfiniteScroll from 'react-infinite-scroll-component'
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
  // const mockData = useRef(Array.from({ length: 10 }))

  const droppableId = useMemo(() => {
    return handleId(groupId, issues.id)
  }, [groupId, issues.id])
  const mockDataCopy = useRef<any>()
  mockDataCopy.current = issues.stories
  const { movingStory } = useSelector(store => store.kanBan)
  const { groupType } = useGroupType()
  const columnId = issues.id

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
  const [mockData, setMockData] = useState<any>([])
  const pageSize = 5
  const currentPage = 1
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = currentPage * pageSize
  const fetchData = () => {
    setMockData(issues.stories.slice(startIndex, endIndex))
  }
  useEffect(() => {
    fetchData()
  }, [])

  const dropCardListContent = (
    <DropCardList
      hidden={!showStateTransitionList}
      list={data}
      groupId={groupId}
      columnId={issues.id}
    />
  )

  const issueCardListContent = issues.stories?.map((story, index) => {
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
        stories={issues.stories}
      />
    )
  })
  const fetchMoreData = () => {
    const newPage = currentPage + 1
    const newStartIndex = (newPage - 1) * pageSize
    const newEndIndex = newPage * pageSize
    const newPaginatedData = issues.stories.slice(newStartIndex, newEndIndex)
    console.log(newPaginatedData, 'newPaginatedData')

    setTimeout(() => {
      setMockData((arr: any) => {
        return arr.concat(newPaginatedData)
      })
    }, 500)
  }
  // const issueCardListContent = (
  //   <InfiniteScroll
  //     loader={null}
  //     endMessage={
  //       <p style={{ textAlign: 'center' }}>
  //         <b>Yay! You have seen it all</b>
  //       </p>
  //     }
  //     style={{
  //       overflowY: 'auto',
  //       overflowX: 'hidden',
  //       height: '500px',
  //     }}
  //     height="500px"
  //     dataLength={mockData.length}
  //     next={fetchMoreData}
  //     hasMore={mockData?.length < issues.stories?.length}
  //   >
  //     {mockData?.map((story: any, index: any) => {
  //       const uuid = `${groupId}-${issues.id}-${story.id}`
  //       // 如果是 人员或者类型分组 不能跨组拖动，需要隐藏卡片
  //       const hidden1 =
  //         !!movingStory &&
  //         (groupType === 'users' || groupType === 'category') &&
  //         movingStory?.groupId !== groupId
  //       // 如果当前展示状态转换释放区域，需要隐藏卡片
  //       const hidden2 = showStateTransitionList
  //       return (
  //         <IssueCard
  //           hidden={hidden1 || hidden2}
  //           uuid={uuid}
  //           key={uuid}
  //           item={story}
  //           index={index}
  //           stories={issues.stories}
  //         />
  //       )
  //     })}
  //   </InfiniteScroll>
  // )

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
            {/* <FixedSizeList
              height={600}
              width={300}
              itemSize={140}
              itemCount={issues.stories?.length}
            >
              {({ index, style }: any) => {
                const newStyle = { ...style, zIndex: 1000 }
                const story = issues.stories[index]
                const hidden1 =
                  !!movingStory &&
                  (groupType === 'users' || groupType === 'category') &&
                  movingStory?.groupId !== groupId
                // 如果当前展示状态转换释放区域，需要隐藏卡片
                const hidden2 = showStateTransitionList
                const uuid = `${groupId}-${issues.id}-${story.id}`
                return (
                  <div style={newStyle}>
                    <IssueCard
                      hidden={hidden1 || hidden2}
                      uuid={uuid}
                      key={uuid}
                      item={story}
                      index={index}
                      stories={issues.stories}
                    />
                  </div>
                )
              }}
            </FixedSizeList> */}
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

export default Issues
