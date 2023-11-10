import styled from '@emotion/styled'
import { Badge } from 'antd'
import { useState } from 'react'
import frnIcon from '/iconfrn.png'
import { useSelector, useDispatch } from '@store/index'
import { setProjectWarningModal } from '@store/project'

const Tag = styled.div<{ width: boolean }>`
  z-index: 9;
  display: flex;
  align-items: center;
  gap: 12px;
  padding-left: 8px;
  position: fixed;
  bottom: 30%;
  right: 0;
  top: 50%;
  width: ${props => (props.width ? '96px' : '48px')};
  height: 48px;
  border-radius: 24px 0 0 24px;
  background: linear-gradient(
      225deg,
      #fff8e5 36%,
      rgba(253, 193, 153, 0.11) 100%
    ),
    linear-gradient(180deg, #ffecda 12%, rgba(248, 180, 139, 0.39) 100%);
  transition: all 0.5s;
  cursor: pointer;
  .ff {
    position: absolute;
    left: 20px;
    ${props => (props.width ? 'left: 60px ;top:6px;' : '48px')};
  }
`

const RightWran = () => {
  const [first, setFirst] = useState(false)
  const { projectInfo } = useSelector(store => store.project)
  const dispatch = useDispatch()
  const handleMouseEnter = () => {
    setFirst(true)
  }
  const handleMouseLeave = () => {
    setFirst(false)
  }

  const Right = (
    <Tag
      onClick={() => {
        dispatch(setProjectWarningModal({ visible: true }))
      }}
      width={first}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {first ? (
        <img
          style={{ width: '40px', height: '40px', marginLeft: 20 }}
          src={frnIcon}
          alt=""
        />
      ) : null}
      <Badge
        className="ff"
        size="small"
        count={projectInfo?.project_warring_info?.warring_count ?? 0}
        showZero
      />
    </Tag>
  )

  return Right
}

export default RightWran
