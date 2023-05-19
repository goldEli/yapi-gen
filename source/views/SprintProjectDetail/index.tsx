import React from 'react'
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
interface IProps {}
const SprintProjectDetail: React.FC<IProps> = props => {
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
          <CommonButton type="icon" icon="share" />
          <CommonButton type="icon" icon="more" />
        </ButtonGroup>
      </DetailTop>
      <DetailTitle>
        <Img
          src="https://dev.staryuntech.com/dev-agile/attachment/category_icon/settings.png"
          alt=""
        />
        <DetailText>
          <span className="name">
            事务名称事务名称事务名称事务名称事务名称事务名称事务名称事务名称事务名称事务名称名称事务名称事务名称事事务名称事务名称事务名称事务名称事务名称事务名称事务名称事务名称事务名称事务名称名称事务名称事务名称事务名称事务名称事务名称事务名称事务名称事务名称事务名称事务名称事务名称事务名称事
          </span>
          <span className="icon">
            <CommonIconFont type="copy" color="var(--neutral-n3)" />
          </span>
          <ChangeStatusPopover>
            <StateTag name="待办" state={1} />
          </ChangeStatusPopover>
        </DetailText>
      </DetailTitle>
      <DetailMain>
        <SprintDetailInfo />
        <SprintDetailBasic />
      </DetailMain>
    </Wrap>
  )
}
export default SprintProjectDetail
