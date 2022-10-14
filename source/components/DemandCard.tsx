/* eslint-disable no-undefined */
/* eslint-disable camelcase */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/jsx-no-literals */
/* eslint-disable @typescript-eslint/naming-convention */
import styled from '@emotion/styled'
import IconFont from './IconFont'
import { Dropdown } from 'antd'
import { OmitText } from '@star-yun/ui'
import { useModel } from '@/models'
import { useState } from 'react'
import { getIsPermission } from '@/tools'
import { CategoryWrap, ClickWrap } from './StyleCommon'
import { useTranslation } from 'react-i18next'
import ChildDemandTable from '@/components/ChildDemandTable'

interface Props {
  item: any
  onChangeEdit?(): void
  onChangeDelete?(): void
  menu: React.ReactElement
  onClickItem(): void
}

const MoreWrap = styled(IconFont)({
  display: 'none',
  position: 'absolute',
  top: 16,
  right: 16,
  cursor: 'pointer',
  color: '#BBBDBF',
})

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
  '&: hover': {
    border: '1px solid #2877ff',
    borderLeft: 'none',
    [MoreWrap.toString()]: {
      display: 'block',
    },
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
  const [isMoreVisible, setIsMoreVisible] = useState(false)
  const { projectInfo } = useModel('project')
  const hasEdit = getIsPermission(
    projectInfo?.projectPermissions,
    'b/story/update',
  )
  const hasDel = getIsPermission(
    projectInfo?.projectPermissions,
    'b/story/delete',
  )
  return (
    <div>
      <Wrap>
        <WrapBorder style={{ background: props.item?.priority?.color }} />
        <MainWrap>
          <CategoryWrap
            color="#43BA9A"
            bgColor="#EDF7F4"
            style={{ margin: '0 0 8px 0', width: 'fit-content' }}
          >
            软件需求
          </CategoryWrap>
          <ClickWrap onClick={props.onClickItem}>
            <OmitText width={200}>{props.item.name}</OmitText>
          </ClickWrap>
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
                      {String(item.trim().slice(0, 1)).toLocaleUpperCase()}
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
            <ChildDemandTable
              value={props.item?.childCount}
              row={props.item}
              hasIcon
            />
          </AvatarWrap>
        </MainWrap>
        {hasDel && hasEdit
          ? null
          : (
              <Dropdown
                key={isMoreVisible.toString()}
                visible={isMoreVisible}
                overlay={props.menu}
                placement="bottomRight"
                trigger={['hover']}
                getPopupContainer={node => node}
                onVisibleChange={visible => setIsMoreVisible(visible)}
              >
                <MoreWrap type="more" />
              </Dropdown>
            )}
      </Wrap>
    </div>
  )
}

export default DemandCard
