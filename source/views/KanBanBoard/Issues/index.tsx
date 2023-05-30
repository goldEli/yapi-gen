import React, { useMemo } from 'react'
import styled from '@emotion/styled'
import { Droppable } from 'react-beautiful-dnd'
import IssueCard from '../IssueCard'
import { handleId } from '../utils'
import DropCardList from '../DropCardList'
import useDropData from '../hooks/useDropData'
import DropCard from '../DropCard'

interface IssuesProps {
  issues: Model.KanBan.Column
  groupId: Model.SprintKanBan.IssuesGroup['groupId']
}

const DropArea = styled.div`
  min-height: 100px;
  display: flex;
  flex-direction: column;
  background: var(--neutral-n9);
  width: 302px;
  box-sizing: border-box;
  padding: 16px;
  gap: 8px;
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

  const { data, showStateTransitionList } = useDropData(issues.id)
  // if (showStateTransitionList) {
  //   return (
  //     <DropArea>
  //       {data.map((item, idx) => {
  //         const { source, target } = item
  //         const key = source?.id + '-' + target?.id + '-' + groupId
  //         console.log({ key })
  //         return (
  //           <Droppable key={key} droppableId={key}>
  //             {(provided, snapshot) => {
  //               return (
  //                 <div ref={provided.innerRef} {...provided.droppableProps}>
  //                   <DropCard source={source} target={target} />
  //                 </div>
  //               )
  //             }}
  //           </Droppable>
  //         )
  //       })}
  //     </DropArea>
  //   )
  // }
  return (
    <>
      {/* <DropArea>
        {data.map((item, idx) => {
          const { source, target } = item
          const key = source?.id + '-' + target?.id + '-' + groupId
          console.log({ key })
          return (
            <Droppable key={key} droppableId={key}>
              {(provided, snapshot) => {
                return (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    <DropCard source={source} target={target} />
                  </div>
                )
              }}
            </Droppable>
          )
        })}
      </DropArea> */}
      {/* <Droppable
        key={droppableId + '-' + groupId}
        droppableId={droppableId + '-' + groupId}
        type="123"
        // droppableId={'dropCardId'}
      >
        {(provided, snapshot) => {
          console.log(123)
          return (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={{
                width: '100%',
                height: '300px',
                border: '1px solid red',
              }}
            >
              {provided.placeholder}
            </div>
          )
        }}
      </Droppable> */}
      <Droppable
        key={droppableId}
        droppableId={droppableId}
        // droppableId={'dropCardId'}
        type="drop-status"
      >
        {(provided, snapshot) => {
          return (
            <DropArea ref={provided.innerRef} {...provided.droppableProps}>
              {/* {column?.deps?.map?.((item) => {
              return <DropStatusArea>{`123 -> ${item.title}`}</DropStatusArea>;
            })} */}
              {issues.stories?.map((story, index) => (
                <IssueCard
                  groupId={groupId}
                  key={story.id}
                  item={story}
                  index={index}
                />
              ))}

              <DropCardList list={data} />
              {provided.placeholder}
            </DropArea>
          )
        }}
      </Droppable>
    </>
  )
}

export default Issues
