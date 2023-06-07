// 迭代主页对应左侧迭代卡片

/* eslint-disable react/jsx-no-literals */
/* eslint-disable @typescript-eslint/naming-convention */
import { useState } from 'react'
import styled from '@emotion/styled'
import { Menu, Progress } from 'antd'
import { getIsPermission } from '@/tools'
import { useDispatch, useSelector } from '@store/index'
import { useTranslation } from 'react-i18next'
import CommonIconFont from '@/components/CommonIconFont'
import MoreDropdown from '@/components/MoreDropdown'
import {
  setCreateIterationParams,
  setIsCreateIterationVisible,
} from '@store/iterate'
import IterationStatus from '@/components/IterationStatus'

const DetailWrap = styled.div`
  font-size: var(--font12);
  color: var(--neutral-n4);
  cursor: pointer;
`

const CardWrap = styled.div<{ active?: boolean }>`
  height: 104px;
  border-radius: 6px;
  box-sizing: border-box;
  border: ${props =>
    props.active
      ? '1px solid var(--primary-d1)'
      : '1px solid var(--neutral-n6-d1)'};
  background: var(--neutral-white-d4);
  padding: 16px 0;
  position: relative;
  margin-top: 16px;
  cursor: pointer;
  .ant-progress-text {
    font-size: var(--font12);
    color: var(--neutral-n2);
  }
  .dropdownicon {
    position: absolute;
    top: 10;
    right: 6;
  }
  &:hover {
    border: 1px solid var(--primary-d1);
    .dropdownIcon {
      visibility: visible;
    }
    .info {
      color: var(--primary-d1);
    }
  }
`

const InfoContent = styled.div`
  display: flex;
  flex-direction: column;
`

const TitleWrap = styled.div`
  font-size: var(--font14);
  color: var(--neutral-n1-d1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 6px 0 16px;
  .name {
    max-width: 130px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    font-family: SiYuanMedium;
  }
`

const TimeWrap = styled.div`
  font-size: var(--font12);
  color: var(--neutral-n4);
`

const ToDetailBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 4px 0;
  padding: 0 16px;
`

const StatusBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
`

interface Props {
  item: any
  onClickInfo(): void
  onClickItem?(): void
  isActive?: boolean
  onChangeEdit(e: any, item: any): void
  onChangeDelete(e: any, item: any): void
  onChangeStatus(value: any, e: any): void
  onCompleteIteration(id: number): void
}

const IterationCard = (props: Props) => {
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const [isVisible, setIsVisible] = useState(false)
  const { projectInfo } = useSelector(store => store.project)

  const hasEdit = getIsPermission(
    projectInfo?.projectPermissions,
    'b/iterate/update',
  )
  const hasDel = getIsPermission(
    projectInfo?.projectPermissions,
    'b/iterate/del',
  )
  const hasChangeStatus = getIsPermission(
    projectInfo?.projectPermissions,
    'b/iterate/status',
  )

  const onClickMenu = (e: any, type: any) => {
    e.stopPropagation()
    setIsVisible(false)
    if (type === 'edit') {
      dispatch(setIsCreateIterationVisible(true))
      dispatch(
        setCreateIterationParams({
          ...props?.item,
          ...{ projectId: projectInfo?.id },
        }),
      )
    } else if (type === 'del') {
      props?.onChangeDelete(e, props?.item)
    }
  }

  const menu = () => {
    let menuItems = [
      {
        key: '1',
        label: (
          <div onClick={e => onClickMenu(e, 'edit')}>{t('common.edit')}</div>
        ),
      },
      {
        key: '2',
        label: (
          <div onClick={e => onClickMenu(e, 'del')}>{t('common.del')} </div>
        ),
      },
    ]
    if (hasEdit) {
      menuItems = menuItems.filter((i: any) => i.key !== '1')
    }

    if (hasDel) {
      menuItems = menuItems.filter((i: any) => i.key !== '2')
    }

    return <Menu items={menuItems} />
  }

  return (
    <CardWrap onClick={props.onClickItem} active={props.isActive}>
      <div style={{ display: 'flex', alignItems: 'center' }}></div>
      <InfoContent>
        <TitleWrap>
          <span className="name">{props.item.name}</span>
          {!(hasDel && hasEdit && hasChangeStatus) && (
            <MoreDropdown
              isMoreVisible={isVisible}
              menu={menu()}
              onChangeVisible={setIsVisible}
            />
          )}
        </TitleWrap>
        <ToDetailBox>
          <TimeWrap>
            {props.item.createdTime}-{props.item.endTime}
          </TimeWrap>
          <DetailWrap className="info" onClick={props.onClickInfo}>
            <span>{t('common.info')}</span>
            <CommonIconFont type="right" size={12} />
          </DetailWrap>
        </ToDetailBox>
        <StatusBox>
          <IterationStatus
            iterateInfo={props.item}
            hasChangeStatus={hasChangeStatus}
            onChangeStatus={props.onChangeStatus}
            onCompleteIteration={props.onCompleteIteration}
          />
          <div style={{ width: '45%' }}>
            <Progress
              strokeColor="#43BA9A"
              style={{ color: '#43BA9A' }}
              width={48}
              type="line"
              percent={Math.trunc(
                (props.item.finishCount / props.item.storyCount) * 100,
              )}
              format={percent => (percent === 100 ? '100%' : `${percent}%`)}
              strokeWidth={4}
            />
          </div>
        </StatusBox>
      </InfoContent>
    </CardWrap>
  )
}

export default IterationCard
