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
  stories?: any
}

const IssueCard = (props: IssueCardProps) => {
  const [t] = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const { item, index, stories } = props
  const isDragDisabled = props.item.verify_lock === 1
  const childRef = useRef<any>(null)
  const [openDemandDetail] = useOpenDemandDetail()
  const { projectInfo } = useSelector(store => store.project)
  const { fullScreen } = useSelector(store => store.kanBan)

  const getElementsAroundIndex = (arr: any, index: number) => {
    const startIndex = Math.max(0, index - 200)
    const endIndex = Math.min(arr.length - 1, index + 200)
    return arr.slice(startIndex, endIndex + 1)
  }

  const cardContent = (dragOver: any) => (
    <IssueCardBoxContainer isDragOver={dragOver} hidden={props.hidden}>
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

            let type = 0
            if (props.item.project_type === 2) {
              type = 1
            }
            if (props.item.project_type === 1 && props.item.is_bug === 1) {
              type = 2
            }
            // return
            const findId = stories?.findIndex((i: any) => i.id === item.id)
            const ids = stories?.map((i: any) => i.id)
            const maxIds = getElementsAroundIndex(ids, findId)
            openDemandDetail(
              {
                ...props.item,
                demandIds: stories?.length > 400 ? maxIds : ids,
                projectId: getProjectIdByUrl(),
              },
              getProjectIdByUrl(),
              props.item.id,
              type,
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
              getPopupContainer={
                fullScreen
                  ? () => document.querySelector('.kanBanFullScreenBox') as any
                  : // eslint-disable-next-line no-undefined
                    undefined
              }
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
                row={{ id: item.id, project_type: item.project_type }}
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
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <IssueCardBox>{cardContent(snapshot?.draggingOver)}</IssueCardBox>
        </div>
      )}
    </Draggable>
  )
}

export default IssueCard
