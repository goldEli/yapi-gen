/* eslint-disable no-constant-condition */
// 项目二级菜单

import CommonIconFont from '@/components/CommonIconFont'
import IconFont from '@/components/IconFont'
import MoreDropdown from '@/components/MoreDropdown'
import { Menu } from 'antd'
import { useRef, useState } from 'react'
import {
  AllWrap,
  MenuBox,
  MenuItem,
  Provider,
  SideFooter,
  SideInfo,
  SideTop,
  WrapSet,
  WrapDetail,
  GroupBox,
  CloseWrap,
  TitleBox,
  NoDataCreateWrap,
  GroupItems,
} from './style'

const MoreProjectSide = (props: { leftWidth: number }) => {
  const projectSide: any = useRef<HTMLInputElement>(null)
  const [isMoreVisible, setIsMoreVisible] = useState(false)
  const onClickMenu = (type: any, item: any, e: any) => {
    e.stopPropagation()
    setIsMoreVisible(false)
  }
  const menu = (item: any) => {
    const menuItems = [
      {
        key: '1',
        label: <div onClick={e => onClickMenu('edit', item, e)}>编辑</div>,
      },
      {
        key: '2',
        label: <div onClick={e => onClickMenu('del', item, e)}>删除</div>,
      },
    ]

    return <Menu items={menuItems} />
  }

  return (
    <AllWrap>
      <WrapDetail ref={projectSide}>
        <MenuBox>
          <MenuItem>
            <CommonIconFont
              type="settings"
              color="var(--neutral-n3)"
              size={18}
            />
            <div>我参与的（12）</div>
          </MenuItem>
          <MenuItem>
            <CommonIconFont
              type="settings"
              color="var(--neutral-n3)"
              size={18}
            />
            <div>企业全部（30）</div>
          </MenuItem>
        </MenuBox>

        <GroupBox>
          <div>项目分组</div>
          <CloseWrap
            width={24}
            height={24}
            onClick={() => {
              // setIsVisible(true)
              setTimeout(() => {
                // inputRefDom.current?.focus()
              }, 100)
            }}
          >
            <IconFont
              type="plus"
              style={{ fontSize: 16, color: '#646566', cursor: 'pointer' }}
            />
          </CloseWrap>
        </GroupBox>
        <GroupItems>
          {[] ? (
            [1, 2].length > 0 ? (
              <>
                {[1, 2].map((item: any) => (
                  <TitleBox isSpace key={item}>
                    {item}
                    <MoreDropdown
                      onChangeVisible={setIsMoreVisible}
                      menu={menu(item)}
                      isMoreVisible={isMoreVisible}
                      color="#969799"
                    />
                  </TitleBox>
                ))}
              </>
            ) : (
              <div style={{ padding: '0 16px' }}>
                <NoDataCreateWrap>
                  <div className="top">
                    <IconFont type="Warning" />
                    <div>暂无分组，创建一个吧~</div>
                  </div>
                  <div className="bottom">
                    <div className="bottom" style={{ cursor: 'pointer' }}>
                      <IconFont type="plus" />
                      <div>添加分组</div>
                    </div>
                  </div>
                </NoDataCreateWrap>
              </div>
            )
          ) : null}
        </GroupItems>
      </WrapDetail>
    </AllWrap>
  )
}

export default MoreProjectSide
