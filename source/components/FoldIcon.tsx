import { useState } from 'react'
import { Tooltip } from 'antd'
import styled from '@emotion/styled'
import { useDispatch, useSelector } from '@/../store'
import { useTranslation } from 'react-i18next'
import IconFont from './IconFont'

const RectangleIcon = styled.div`
  width: 6px;
  height: 36px;
  background: #ccc;
  border-radius: 40px;
`
const IconFontWrap = styled(IconFont)`
  font-size: 36px;
  display: none;
  transform: translate(-20px);
`

const FoldBar = styled.div`
  width: 20px;
  height: 36px;
  position: absolute;
  cursor: pointer;
  left: 8px;
  top: 50%;
  z-index: 2;
  &:hover ${RectangleIcon} {
    display: none;
  }
  &:hover ${IconFontWrap} {
    display: block;
  }
`

const FoldIcon = () => {
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false)
  const { firstMenuCollapse, secondaryMenuCollapse } = useSelector(
    state => state.global,
  )

  const onOpenMenu = () => {
    setOpen(false)
    dispatch({
      type: 'global/setFirstMenuCollapse',
      payload: !firstMenuCollapse,
    })
  }

  const iconType = firstMenuCollapse ? 'right' : 'left'
  const title = firstMenuCollapse ? '展开' : '收起'
  const visible = !secondaryMenuCollapse

  if (!visible) {
    return <></>
  }

  return (
    <Tooltip
      open={open}
      onOpenChange={v => {
        setOpen(v)
      }}
      title={title}
    >
      <FoldBar onClick={onOpenMenu}>
        <RectangleIcon />
        <IconFontWrap type={iconType} />
      </FoldBar>
    </Tooltip>
  )
}

export default FoldIcon
