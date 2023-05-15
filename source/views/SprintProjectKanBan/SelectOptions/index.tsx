import React, { useMemo, useState } from 'react'
import styled from '@emotion/styled'
import { Menu, Popover } from 'antd'
import IconFont from '@/components/IconFont'
import DropDownMenu from '@/components/DropDownMenu'
import { HasIconMenu } from '@/components/StyleCommon'
import { getMessage } from '@/components/Message'

interface SelectBoxProps {
  title: string
}

const SelectOptionsBox = styled.div`
  display: flex;
  align-items: center;
  height: 32px;
  border-radius: 6px;
  /* padding: 0 16px; */
  font-size: 14px;
  width: 100%;
  box-sizing: border-box;
  cursor: pointer;
  color: var(--neutral-n2);
  background-color: var(--hover-d2);
  &:hover {
    color: var(--auxiliary-text-t1-d2);
  }
`

const MoreItem = styled.div`
  display: 'flex';
  align-items: 'center';
  width: 100%;
  box-sizing: border-box;
  height: 32px;
  color: 'var(--neutral-n2)';
  font-size: 14px;
  cursor: pointer;
  padding: 0 16px;
  &:hover {
    color: var(--neutral-n1-d1) !important;
    background: var(--hover-d3);
  }
`

const SelectOptions: React.FC<SelectBoxProps> = props => {
  const [isVisibleMore, setIsVisibleMore] = useState(false)
  const [isVisibleFormat, setIsVisibleFormat] = useState(false)
  const moreOperation = (
    <div
      style={{
        padding: '4px 0',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <MoreItem>
        <span style={{ marginLeft: 8 }}>{123}</span>
      </MoreItem>
      <MoreItem>
        <span style={{ marginLeft: 8 }}>{111}</span>
      </MoreItem>
    </div>
  )

  // 切换显示类型
  const onClickMenuFormat = (type: boolean) => {
    // getMessage({ msg: t('version2.reviewModeChangeSuccess'), type: 'success' })
    // props.onChangeFormat(type)
    setIsVisibleFormat(false)
  }

  const menuFormat = (
    <Menu
      items={[
        {
          key: 'list',
          label: (
            <HasIconMenu onClick={() => onClickMenuFormat(true)} isCheck={true}>
              <span className="label">123</span>
              <IconFont className="checked" type={'check'} />
            </HasIconMenu>
          ),
        },
        {
          key: 'thumbnail',
          label: (
            <HasIconMenu onClick={() => onClickMenuFormat(true)} isCheck={true}>
              <span className="label">333</span>
              <IconFont className="checked" type={'check'} />
            </HasIconMenu>
          ),
        },
      ]}
    />
  )
  const title = useMemo(() => {
    return `${props.title}：按人员`
  }, [props.title])

  return (
    <DropDownMenu
      isVisible={isVisibleFormat}
      onChangeVisible={setIsVisibleFormat}
      menu={menuFormat}
      isActive={true}
      // icon={props.isGrid ? 'app-store' : 'unorderedlist'}
      // icon={'app-store'}
    >
      {/* <div>{1111}</div> */}
      <SelectOptionsBox>
        <span>{title}</span>
        <IconFont
          style={{ fontSize: 16, marginLeft: 8 }}
          type={isVisibleMore ? 'up' : 'down'}
        />
      </SelectOptionsBox>
    </DropDownMenu>
  )
}

export default SelectOptions
