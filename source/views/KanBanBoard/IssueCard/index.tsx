import { useRef } from 'react'
import { Draggable } from 'react-beautiful-dnd'
import MultipleAvatar from '@/components/MultipleAvatar'
import PriorityIcon from '@/components/PriorityIcon'
import IconFont from '@/components/IconFont'
import { Tooltip } from 'antd'
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
import ChildDemandTable from '@/components/ChildDemandTable'
import { useSelector } from '@store/index'

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
  const childRef = useRef<any>(null)
  const [openDemandDetail] = useOpenDemandDetail()
  const { ids } = useStoryIds()
  const { projectInfo } = useSelector(store => store.project)
  console.log(item, 'item')
  const cardContent = (
    <IssueCardBoxContainer hidden={props.hidden}>
      <Top>
        <TopLeft>
          <Tooltip title={item.project_category.name}>
            <TopProjectIcon src={item.project_category.attachment_path} />
          </Tooltip>
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
          <Tooltip title={'123'} placement={'top'} trigger="click">
            <IconFont
              type="target"
              style={{
                fontSize: 16,
                paddingTop: '3px',
                color: 'var(--neutral-n1)',
              }}
            />
          </Tooltip>
          {projectInfo.projectType === 1 && (
            <PercentageBox>{`${item.schedule}%`}</PercentageBox>
          )}
          <Sub
            onClick={(e: any) => {
              e.stopPropagation()
              if (childRef.current) {
                childRef.current!.click()
              }
            }}
          >
            <WrapIcon type="apartment" />
            <ChildDemandTable
              ref={childRef}
              value={item.children_count}
              row={{ id: item.id }}
            />
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
