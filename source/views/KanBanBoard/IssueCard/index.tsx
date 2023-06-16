import React from 'react'
import { Draggable } from 'react-beautiful-dnd'
import styled from '@emotion/styled'
import { handleId } from '../utils'
import IconFont from '@/components/IconFont'
import MultipleAvatar from '@/components/MultipleAvatar'
import PriorityIcon from '@/components/PriorityIcon'
import {
  Bottom,
  BottomLeft,
  BottomRight,
  IssueCardBox,
  IssueCardBoxContainer,
  Middle,
  PercentageBox,
  StoryText,
  Sub,
  Top,
  TopLeft,
  TopProjectIcon,
  TopRight,
  TopText,
  WrapIcon,
} from './styled'
import ThreeDot from '../ThreeDot'
import useOpenDemandDetail from '@/hooks/useOpenDemandDetail'
import { getProjectIdByUrl } from '@/tools'
import useStoryIds from '../hooks/useStoryIds'

interface IssueCardProps {
  item: Model.KanBan.Story
  index: number
  // groupId-columnId-storyId
  uuid: string
  hidden?: boolean
}

const IssueCard = (props: IssueCardProps) => {
  const { item, index } = props
  const isDragDisabled = props.item.verify_lock === 1

  const [openDemandDetail] = useOpenDemandDetail()
  const { ids } = useStoryIds()

  const cardContent = (
    <IssueCardBoxContainer hidden={props.hidden}>
      <Top>
        <TopLeft>
          <TopProjectIcon src={item.project_category.attachment_path} />
          <TopText>{item.story_prefix_key}</TopText>
        </TopLeft>
        <TopRight>
          <ThreeDot story={item} />
        </TopRight>
      </Top>
      <Middle>
        <StoryText
          onClick={e => {
            e.stopPropagation()
            openDemandDetail(
              { ...props.item, demandIds: ids, projectId: getProjectIdByUrl() },
              getProjectIdByUrl(),
              props.item.id,
              1,
            )
          }}
        >
          {item.name}
        </StoryText>
      </Middle>
      <Bottom>
        <BottomLeft>
          <MultipleAvatar max={3} list={item.handlers} />
        </BottomLeft>
        <BottomRight>
          <PercentageBox>{`${item.schedule}%`}</PercentageBox>
          <Sub>
            <WrapIcon type="apartment" />
            {item.children_count}
          </Sub>
          <PriorityIcon
            icon={item.story_config_priority.icon}
            color={item.story_config_priority.color ?? ''}
          />
        </BottomRight>
      </Bottom>
    </IssueCardBoxContainer>
  )

  return (
    <Draggable
      isDragDisabled={isDragDisabled}
      key={item.id}
      draggableId={props.uuid}
      index={index}
    >
      {provided => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <IssueCardBox>{cardContent}</IssueCardBox>
        </div>
      )}
    </Draggable>
  )
}

export default IssueCard
