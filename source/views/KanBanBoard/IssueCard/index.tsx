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
  Sub,
  Top,
  TopProjectIcon,
  TopText,
  WrapIcon,
} from './styled'

interface IssueCardProps {
  item: Model.KanBan.Story
  index: number
  // groupId-columnId-storyId
  uuid: string
  hidden?: boolean
}

const IssueCard = (props: IssueCardProps) => {
  const { item, index } = props
  return (
    <Draggable key={item.id} draggableId={props.uuid} index={index}>
      {provided => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <IssueCardBox>
            <IssueCardBoxContainer hidden={props.hidden}>
              <Top>
                <TopProjectIcon src={item.project_category.attachment_path} />
                <TopText>{item.story_prefix_key}</TopText>
              </Top>
              <Middle>{item.name}</Middle>
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
          </IssueCardBox>
        </div>
      )}
    </Draggable>
  )
}

export default IssueCard
