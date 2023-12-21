import {
  NodeViewWrapper,
  NodeViewContent,
  type NodeViewRenderer,
} from '@tiptap/react'
import { Dropdown } from 'antd'

const View: NodeViewRenderer = props => {
  return (
    <NodeViewWrapper>
      <table>
        <NodeViewContent as="tbody" />
      </table>
    </NodeViewWrapper>
  )
}

export default View
