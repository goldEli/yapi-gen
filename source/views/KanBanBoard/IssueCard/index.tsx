import React from 'react'
import { Draggable } from 'react-beautiful-dnd'
import styled from '@emotion/styled'
import { handleId } from '../utils'
import IconFont from '@/components/IconFont'
import MultipleAvatar from '@/components/MultipleAvatar'
import { priorityIconBgColor } from '../constant'

const IssueCardBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 270px;
  height: 144px;
  border-radius: 6px 6px 6px 6px;
  background: var(--neutral-white-d2);
  padding: 16px;
  box-sizing: border-box;
  gap: 12px;

  /* .secondary-details {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    font-size: 12px;
  } */
`
const Top = styled.div`
  width: 100%;
  height: 20px;
  display: flex;
  gap: 8px;
`
const TopProjectIcon = styled.img`
  height: 18px;
  width: 18px;
`
const TopText = styled.div`
  font-size: 12px;
  color: var(--neutral-n3);
`

const Middle = styled.div`
  flex: 1;
  width: 100%;
  font-size: 14px;
  color: var(--neutral-n1-d2);
  line-height: 22px;
  word-break: break-all;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2; /* 这里是超出几行省略 */
  overflow: hidden;
`
const Bottom = styled.div`
  height: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const BottomLeft = styled.div``
const BottomRight = styled.div`
  font-size: 12px;
  color: var(--neutral-n2);
  display: flex;
  gap: 16px;
`
const PercentageBox = styled.div`
  width: 31px;
  display: flex;
  align-items: center;
`
const Sub = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`
const WrapIcon = styled(IconFont)`
  font-size: 16px;
  color: var(--neutral-n3);
`

const PriorityIcon = styled(IconFont)<{
  color: string
  iconType?: Model.KanBan.StoryConfigPriority['icon']
}>`
  font-size: 16px;
  color: ${props => props.color};
  background: ${props =>
    props.iconType ? priorityIconBgColor[props.iconType] : ''};
  border-radius: 50%;
`

interface IssueCardProps {
  item: Model.KanBan.Story
  index: number
  groupId: Model.SprintKanBan.IssuesGroup['groupId']
}

const IssueCard = (props: IssueCardProps) => {
  const { item, index } = props
  return (
    <Draggable
      key={item.id}
      draggableId={handleId(props.groupId, item.id)}
      index={index}
    >
      {provided => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <IssueCardBox>
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
                  type={item.story_config_priority.icon ?? ''}
                  iconType={item.story_config_priority.icon}
                  color={item.story_config_priority.color ?? ''}
                />
              </BottomRight>
            </Bottom>
          </IssueCardBox>
        </div>
      )}
    </Draggable>
  )
}

export default IssueCard
