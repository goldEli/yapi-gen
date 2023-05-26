import React, { useEffect } from 'react'
import {
  ButtonGroup,
  ChangeIconGroup,
  DetailMain,
  DetailText,
  DetailTitle,
  DetailTop,
  DownWrap,
  Img,
  UpWrap,
  Wrap,
} from './style'
import MyBreadcrumb from '@/components/MyBreadcrumb'
import CommonButton from '@/components/CommonButton'
import CommonIconFont from '@/components/CommonIconFont'
import StateTag from '@/components/StateTag'
import ChangeStatusPopover from '@/components/ChangeStatusPopover/index'
import SprintDetailInfo from './components/SprintDetailInfo'
import SprintDetailBasic from './components/SprintDetailBasic'
import { useDispatch, useSelector } from '@store/index'
import { getSprintCommentList, getSprintInfo } from '@store/sprint/sprint.thunk'
import { useSearchParams } from 'react-router-dom'
import { getParamsData, copyLink } from '@/tools'
import useShareModal from '@/hooks/useShareModal'

interface IProps {}
const SprintProjectDetail: React.FC<IProps> = props => {
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const { id, sprintId } = paramsData
  const { sprintInfo } = useSelector(store => store.sprint)
  const { open, ShareModal } = useShareModal()

  // 复制标题
  const onCopy = () => {
    //
  }

  useEffect(() => {
    dispatch(getSprintInfo({ projectId: id, sprintId }))
    dispatch(
      getSprintCommentList({
        projectId: id,
        sprintId,
        page: 1,
        pageSize: 999,
      }),
    )
  }, [])

  return (
    <Wrap>
      <DetailTop>
        <MyBreadcrumb />
        <ButtonGroup size={16}>
          <CommonButton type="icon" icon="left-md" />
          <ChangeIconGroup>
            {/* {currentIndex > 0 && ( */}
            <UpWrap
              // onClick={onUpDemand}
              id="upIcon"
              // isOnly={
              //   demandIds?.length === 0 ||
              //   currentIndex === demandIds?.length - 1
              // }
            >
              <CommonIconFont
                type="up"
                size={20}
                color="var(--neutral-n1-d1)"
              />
            </UpWrap>
            {/* )} */}
            {/* {!(
                demandIds?.length === 0 ||
                currentIndex === demandIds?.length - 1
              ) &&  ( */}
            <DownWrap
              // onClick={onDownDemand}
              id="downIcon"
              // isOnly={currentIndex <= 0}
            >
              <CommonIconFont
                type="down"
                size={20}
                color="var(--neutral-n1-d1)"
              />
            </DownWrap>
            {/* )} */}
          </ChangeIconGroup>
          <CommonButton
            type="icon"
            icon="share"
            onClick={() => {
              open({ onOk: async () => {} })
            }}
          />
          <CommonButton type="icon" icon="more" />
        </ButtonGroup>
      </DetailTop>
      <DetailTitle>
        <Img src={sprintInfo.category_attachment} alt="" />
        <DetailText>
          <span className="name">{sprintInfo.name}</span>
          <span className="icon" onClick={onCopy}>
            <CommonIconFont type="copy" color="var(--neutral-n3)" />
          </span>
          <ChangeStatusPopover>
            <StateTag
              name={sprintInfo.status?.status.content}
              state={
                sprintInfo.status?.is_start === 1 &&
                sprintInfo.status?.is_end === 2
                  ? 1
                  : sprintInfo.status?.is_end === 1 &&
                    sprintInfo.status?.is_start === 2
                  ? 2
                  : sprintInfo.status?.is_start === 2 &&
                    sprintInfo.status?.is_end === 2
                  ? 3
                  : 0
              }
            />
          </ChangeStatusPopover>
        </DetailText>
      </DetailTitle>
      <DetailMain>
        <SprintDetailInfo />
        <SprintDetailBasic />
      </DetailMain>
      <ShareModal copyLink={() => copyLink(window.origin, '复制成功', '1')} />
    </Wrap>
  )
}
export default SprintProjectDetail
