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
import { useSelector } from '@store/index'

interface Props {
  item: any
  onChangeEdit?(e: any, item: any): void
  onChangeDelete?(item: any): void
  onClickItem(): void
  indexVal?: any
  onUpdate(state: any): void
}

const Wrap = styled.div({
  width: '100%',
  height: 126,
  background: 'white',
  borderRadius: 6,
  border: '1px solid #EBEDF0',
  borderLeft: 'none',
  position: 'relative',
  marginTop: 16,
  overflow: 'hidden',
  '.dropdownIcon': {
    position: 'absolute',
    top: 16,
    right: 0,
  },
  '&: hover': {
    border: '1px solid #2877ff',
    borderLeft: 'none',
  },
})

const WrapBorder = styled.div({
  position: 'absolute',
  left: 0,
  height: '100%',
  width: 4,
  background: '#BBBDBF',
})

const MainWrap = styled.div({
  display: 'flex',
  flexDirection: 'column',
  padding: 16,
})

const AvatarWrap = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: 12,
})

const NameGroup = styled.div({
  display: 'flex',
  alignItems: 'center',
  '.item': {
    width: 32,
    height: 32,
    borderRadius: '50%',
    overflow: 'hidden',
    boxSizing: 'border-box',
    background: '#619BFF',
    border: '1px solid white',
    color: 'white',
    fontSize: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    whiteSpace: 'nowrap',
  },
  '.more': {
    width: 32,
    height: 32,
    borderRadius: '50%',
    border: '1px solid white',
    background: '#B9BAC7',
    fontSize: 16,
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -10,
    zIndex: 4,
  },
})

const DemandCard = (props: Props) => {
  const [t] = useTranslation()
  const { userInfo } = useSelector(store => store.user)
  const [isMoreVisible, setIsMoreVisible] = useState(false)
  // 控制移入移除显示三个点
  const [isHoverVisible, setIsHoverVisible] = useState(false)
  const { projectInfo, colorList } = useSelector(store => store.project)
  const hasEdit =
    projectInfo.projectPermissions?.length > 0 &&
    projectInfo.projectPermissions?.filter((i: any) => i.name === '编辑需求')
      ?.length > 0
  const hasDel = getIsPermission(
    projectInfo?.projectPermissions,
    'b/story/delete',
  )

  const onClickMenu = (type: any, e?: any) => {
    setIsMoreVisible(false)
    if (type === 'edit') {
      props.onChangeEdit?.(e, props?.item)
    } else {
      props.onChangeDelete?.(props?.item)
    }
  }

  const menu = () => {
    let menuItems = [
      {
        key: '1',
        label: (
          <div onClick={e => onClickMenu('edit', e)}>{t('common.edit')}</div>
        ),
      },
      {
        key: '2',
        label: <div onClick={() => onClickMenu('del')}>{t('common.del')}</div>,
      },
    ]

    if (getIsPermission(projectInfo?.projectPermissions, 'b/story/update')) {
      menuItems = menuItems.filter((i: any) => i.key !== '1')
    }

    if (getIsPermission(projectInfo?.projectPermissions, 'b/story/delete')) {
      menuItems = menuItems.filter((i: any) => i.key !== '2')
    }

    return <Menu items={menuItems} />
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
          style={{ color: '#969799', fontSize: 16, marginRight: 8 }}
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
        <WrapBorder style={{ background: props.item?.priority?.color }} />
        <MainWrap>
          <CategoryWrap
            color={props?.item?.categoryColor}
            bgColor={
              colorList?.filter(
                (i: any) => i.key === props?.item?.categoryColor,
              )[0]?.bgColor
            }
            style={{ margin: '0 0 8px 0', width: 'fit-content' }}
          >
            {props?.item?.category}
          </CategoryWrap>
          <HiddenText>
            <ClickWrap onClick={props.onClickItem}>
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
          </HiddenText>
          <AvatarWrap>
            <NameGroup>
              {props.item?.userName
                ?.slice(0, 3)
                ?.map((item: any, index: number) => (
                  <div
                    className="box"
                    key={item}
                    style={{ marginLeft: index ? -10 : 0, zIndex: index }}
                  >
                    <div className="item" style={{ background: '#A4ACF5' }}>
                      {String(item?.trim().slice(0, 1)).toLocaleUpperCase()}
                    </div>
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
              ) && (
                <Progress
                  strokeColor="#43BA9A"
                  style={{ color: '#43BA9A', cursor: 'not-allowed' }}
                  width={38}
                  type="circle"
                  percent={props.item.schedule}
                  format={percent => (percent === 100 ? '100%' : `${percent}%`)}
                  strokeWidth={8}
                />
              )}
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
            </Space>
          </AvatarWrap>
        </MainWrap>
        {!(hasDel && hasEdit) && isHoverVisible && (
          <MoreDropdown
            isMoreVisible={isMoreVisible}
            menu={menu()}
            onChangeVisible={setIsMoreVisible}
            isDemandCard
          />
        )}
      </Wrap>
    </div>
  )
}

export default DemandCard
