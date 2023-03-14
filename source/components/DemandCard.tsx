// 需求卡片
/* eslint-disable complexity */
/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable no-undefined */
/* eslint-disable camelcase */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/jsx-no-literals */
/* eslint-disable @typescript-eslint/naming-convention */
import styled from '@emotion/styled'
import { Menu, Progress, Space } from 'antd'
import { OmitText } from '@star-yun/ui'
import { useState } from 'react'
import { getIsPermission } from '@/tools'
import { CategoryWrap, ClickWrap, HiddenText } from './StyleCommon'
import { useTranslation } from 'react-i18next'
import ChildDemandTable from '@/components/ChildDemandTable'
import DemandProgress from './DemandProgress'
import MoreDropdown from './MoreDropdown'
import IconFont from './IconFont'
import { useDispatch, useSelector } from '@store/index'
import { DemandOperationDropdownMenu } from './DemandComponent/DemandOperationDropdownMenu'
import { setCreateDemandProps, setIsCreateDemandVisible } from '@store/demand'
import CommonUserAvatar from './CommonUserAvatar'
import CommonIconFont from './CommonIconFont'

interface Props {
  item: any
  onChangeEdit?(item: any): void
  onChangeDelete?(item: any): void
  onClickItem(): void
  indexVal?: any
  onUpdate(state: any): void
}

const Wrap = styled.div`
  height: 90px;
  background: var(--neutral-white-d2);
  border-radius: 6px;
  margin-bottom: 8px;
`

const DemandNameBox = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  padding: 0 8px 0 16px;
  .dropdownIcon {
    position: absolute;
    right: 4px;
    z-index: 9;
  }
  img {
    width: 16px;
    height: 16px;
    margin-right: 8px;
  }
`

const MainWrap = styled.div({
  display: 'flex',
  flexDirection: 'column',
  padding: '16px 0',
})

const AvatarWrap = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: 12,
  padding: '0 16px 0 16px',
})

const NameGroup = styled.div({
  display: 'flex',
  alignItems: 'center',
  '.more': {
    width: 26,
    height: 26,
    borderRadius: '50%',
    border: '1px solid white',
    background: 'var(--neutral-n7)',
    fontSize: 12,
    color: 'var(--neutral-n2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -7,
    zIndex: 4,
  },
})

const IconBox = styled.div<{ backgroundColor: string }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => `var(${props.backgroundColor})`};
`

const DemandCard = (props: Props) => {
  const [t] = useTranslation()
  const { userInfo } = useSelector(store => store.user)
  const { tagOrPriority } = useSelector(store => store.global)
  const [isMoreVisible, setIsMoreVisible] = useState(false)
  // 控制移入移除显示三个点
  const [isHoverVisible, setIsHoverVisible] = useState(false)
  const { projectInfo } = useSelector(store => store.project)
  const dispatch = useDispatch()

  const hasEdit = getIsPermission(
    projectInfo?.projectPermissions,
    'b/story/update',
  )
  const hasDel = getIsPermission(
    projectInfo?.projectPermissions,
    'b/story/delete',
  )

  // 点击编辑
  const onEditChange = (item: any) => {
    setIsMoreVisible(false)
    dispatch(setIsCreateDemandVisible(true))
    dispatch(
      setCreateDemandProps({ demandId: item.id, projectId: item.project_id }),
    )
  }

  // 点击删除
  const onDeleteChange = (item: any) => {
    setIsMoreVisible(false)
    props.onChangeDelete?.(item)
  }

  // 点击创建子需求
  const onCreateChild = (item: any) => {
    setIsMoreVisible(false)
    dispatch(setIsCreateDemandVisible(true))
    dispatch(
      setCreateDemandProps({
        projectId: item.project_id,
        isChild: true,
        parentId: item.id,
      }),
    )
  }

  const childrenIcon = () => {
    return (
      <ClickWrap
        style={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
        }}
      >
        <IconFont
          type="apartment"
          style={{ color: 'var(--neutral-n3)', fontSize: 16, marginRight: 8 }}
        />
        {props.item?.childCount}
      </ClickWrap>
    )
  }

  return (
    <div>
      <Wrap
        onMouseEnter={() => setIsHoverVisible(true)}
        onMouseLeave={() => {
          setIsHoverVisible(false)
          setIsMoreVisible(false)
        }}
      >
        <MainWrap>
          <DemandNameBox>
            <img src={props.item?.category_attachment} alt="" />
            <ClickWrap className="canClickDetail" onClick={props.onClickItem}>
              <OmitText
                width={200}
                tipProps={{
                  placement: 'topLeft',
                  getPopupContainer: node => node,
                }}
              >
                {props.item.name}
              </OmitText>
            </ClickWrap>
            {!(hasDel && hasEdit) && isHoverVisible && (
              <MoreDropdown
                isMoreVisible={isMoreVisible}
                menu={
                  <DemandOperationDropdownMenu
                    onEditChange={onEditChange}
                    onDeleteChange={onDeleteChange}
                    onCreateChild={onCreateChild}
                    record={props.item}
                  />
                }
                onChangeVisible={setIsMoreVisible}
                isDemandCard
              />
            )}
          </DemandNameBox>
          <AvatarWrap>
            <NameGroup>
              {props.item?.userName
                ?.slice(0, 3)
                ?.map((item: any, index: number) => (
                  <div
                    key={item}
                    style={{
                      marginLeft: index ? -7 : 0,
                      zIndex: index,
                      border: '1px solid var(--neutral-white-d2)',
                      borderRadius: '50%',
                    }}
                  >
                    <CommonUserAvatar />
                  </div>
                ))}
              <div
                className="more"
                hidden={props.item?.userName?.length - 3 <= 0}
              >
                +{props.item?.userName?.length - 3}
              </div>
            </NameGroup>
            <Space size={16} style={{ display: 'flex', alignItems: 'center' }}>
              {!(
                hasEdit &&
                props.item?.usersNameIds?.includes(userInfo?.id) &&
                props.item.status.is_start !== 1 &&
                props.item.status.is_end !== 1 &&
                isHoverVisible
              ) && <div>{props.item?.schedule}%</div>}
              {hasEdit &&
                props.item?.usersNameIds?.includes(userInfo?.id) &&
                props.item.status.is_start !== 1 &&
                props.item.status.is_end !== 1 &&
                isHoverVisible && (
                  <div style={{ cursor: 'pointer' }}>
                    <DemandProgress
                      value={props.item?.schedule}
                      row={props.item}
                      onUpdate={() => props?.onUpdate(true)}
                      index={props?.indexVal}
                      isCard
                    />
                  </div>
                )}
              {isHoverVisible ? (
                <ChildDemandTable
                  value={props.item?.childCount}
                  row={props.item}
                  hasIcon
                />
              ) : (
                childrenIcon()
              )}
              {props.item.priority !== 0 && (
                <IconBox
                  backgroundColor={
                    tagOrPriority?.filter(
                      (i: any) => i.key === props.item.priority.icon,
                    )[0].backgroundColor
                  }
                >
                  <CommonIconFont
                    color={props.item.priority.color}
                    type={props.item.priority.icon}
                  />
                </IconBox>
              )}
              {!props.item.priority && <span>--</span>}
            </Space>
          </AvatarWrap>
        </MainWrap>
      </Wrap>
    </div>
  )
}

export default DemandCard
