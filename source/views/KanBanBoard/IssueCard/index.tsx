import { useRef, useState } from 'react'
import { Draggable } from 'react-beautiful-dnd'
import MultipleAvatar from '@/components/MultipleAvatar'
import PriorityIcon from '@/components/PriorityIcon'
import IconFont from '@/components/IconFont'
import { Popover, Tooltip } from 'antd'
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
import { PopoverTargetText } from '@/components/StyleCommon'
import { useTranslation } from 'react-i18next'

interface IssueCardProps {
  item: Model.KanBan.Story
  index: number
  // groupId-columnId-storyId
  uuid: string
  hidden?: boolean
}

const IssueCard = (props: IssueCardProps) => {
  const [t] = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const { item, index } = props
  const isDragDisabled = props.item.verify_lock === 1
  const childRef = useRef<any>(null)
  const [openDemandDetail] = useOpenDemandDetail()
  const { ids } = useStoryIds()
  const { projectInfo } = useSelector(store => store.project)

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
      <div style={{ width: '100%', height: '22px', position: 'relative' }}>
        <Bottom>
          <BottomLeft>
            <MultipleAvatar max={3} list={item.handlers} />
          </BottomLeft>
          <BottomRight>
            {projectInfo.projectType === 1 && (
              <PercentageBox>{`${item.schedule}%`}</PercentageBox>
            )}
            <Popover
              content={
                <PopoverTargetText>
                  {item.iterate_info || '--'}
                </PopoverTargetText>
              }
              placement="bottom"
              trigger="click"
            >
              <Tooltip
                title={t('sprint.sprintTarget')}
                placement="top"
                trigger="click"
                open={isOpen}
                onOpenChange={e => setIsOpen(e)}
              >
                <WrapIcon
                  type="target"
                  style={{
                    paddingTop: '3px',
                  }}
                />
              </Tooltip>
            </Popover>
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
            {item.story_config_priority.icon && (
              <PriorityIcon
                icon={item.story_config_priority.icon}
                color={item.story_config_priority.color ?? ''}
              />
            )}
          </BottomRight>
        </Bottom>
        {/* {isOpen && <TooltipText>{item.iterate_info || '--'}</TooltipText>} */}
      </div>
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
