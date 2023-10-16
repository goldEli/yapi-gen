import styled from '@emotion/styled'
import { ReactNode, useState } from 'react'

interface CollapseProps {
  isExpand: boolean
  header: ReactNode
  children: ReactNode
  expandIcon: ReactNode
  shrinkIcon: ReactNode
}

const CollapseWrap = styled.div`
  padding: 12px 12px 0px 12px;
  background: #ffffff;
  margin-bottom: 12px;
  border-radius: 6px;
  .ant-table-pagination.ant-pagination {
    margin: 0px;
  }
`
const CollapseHead = styled.div`
  display: flex;
  .icons {
    margin-right: 5px;
    cursor: pointer;
  }
  .headerContent {
    flex: 1;
  }
`

const CollapseCustom = (props: CollapseProps) => {
  const { isExpand, header, children, expandIcon, shrinkIcon } = props
  const [expand, setExpand] = useState(isExpand)
  return (
    <CollapseWrap>
      <CollapseHead>
        <div className="icons" onClick={() => setExpand(!expand)}>
          {expand ? expandIcon : shrinkIcon}
        </div>
        <div className="headerContent"> {header}</div>
      </CollapseHead>
      <div className="content">{expand ? children : null}</div>
    </CollapseWrap>
  )
}
export default CollapseCustom
