import styled from '@emotion/styled'
import { EditorContent } from '@tiptap/react'

export const Wrap = styled.div<{
  focus: boolean
  read?: boolean
  color?: string
  height?: string
}>`
  min-height: ${props => (props.read ? '0px' : '150px')};
  height: ${props => (props.height ? props.height : 'inherit')};
  margin: 1px;

  position: relative;
  border-radius: 8px;
  outline: 1px solid
    ${props => (props.focus && !props.read ? '#7598ff' : 'transparent')};
  background: ${props => (props.color ? props.color : '#fff')};
  display: flex;
  flex-direction: column;
  border: 1px solid ${props => (props.read ? 'transparent' : '#ecedef')};
`

export const StyledEditorContent = styled(EditorContent)<{
  maxHeight?: string
  minHeight?: string
}>`
  max-height: ${props => (props.maxHeight ? props.maxHeight : '')};
  min-height: ${props => (props.minHeight ? props.minHeight : '')};
  .ProseMirror p.is-editor-empty:first-child::before {
    color: #bbbdbf;
    content: attr(data-placeholder);
    float: left;
    height: 0;
    pointer-events: none;
  }
  *::selection {
    color: #fff !important;
    background: #1890ff !important;
  }
  flex: 1;
  box-sizing: border-box;
  padding: 8px;
  overflow: auto;

  .ProseMirror {
    min-height: 100%;
    p,
    ul,
    ol,
    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    img {
      margin: 0;
    }
    &:focus-visible {
      outline: 0;
    }
    ul,
    ol {
      padding-inline-start: 30px;
    }
    ul[data-type='taskList'] {
      list-style: none;
      padding: 0;
      li {
        display: flex;

        & > label {
          flex: 0 0 auto;
          margin-right: 0.5rem;
          user-select: none;
        }

        & > div {
          flex: 1 1 auto;
        }
      }
    }
    img {
      max-width: 100%;
      height: auto;
      vertical-align: bottom;

      &.ProseMirror-selectednode {
        outline: 3px solid #68cef8;
      }
    }
    video {
      width: 100%;
    }
    table {
      position: relative;
      table-layout: fixed;
      border-collapse: collapse;
      border-spacing: 0;
      border: 0;
      margin: 0;
      overflow: hidden;
      width: 100%;
      tbody > div {
        display: contents;
      }

      td,
      th {
        position: relative;
        min-width: 1em;
        vertical-align: top;
        border: 1px solid #333;
        box-sizing: border-box;
        padding: 2px 4px;
        > * {
          margin-bottom: 0;
        }
      }

      th {
        background-color: #f3f3f5;
        font-weight: 400;
        text-align: left;
      }

      .selectedCell:after {
        background: rgba(200, 200, 255, 0.4);
        content: '';
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        pointer-events: none;
        position: absolute;
        z-index: 2;
      }

      .column-resize-handle {
        background-color: #adf;
        bottom: -2px;
        position: absolute;
        right: -2px;
        pointer-events: none;
        top: 0;
        width: 4px;
      }

      p {
        margin: 0;
      }
    }
    blockquote {
      border-left: 4px solid #aaa;
      padding: 4px;
      box-sizing: border-box;
      margin: 0;
      background: #eee;
    }
    [data-type='mention'] {
      border: 1px solid #6688ff;
      border-radius: 6px;
      padding: 0 0.5em;
      color: #6688ff;
    }
  }
`
