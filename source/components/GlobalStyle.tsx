import { css, Global } from '@emotion/react'

const customCss = css`
  .ant-form-item {
    padding-top: 2px !important;
  }
  .ant-progress-inner {
    background-color: #ecedef;
  }

  .ant-btn-default:hover {
    background: #f0f4fa !important;
    color: #2877ff !important;
  }

  .ant-btn-default:focus {
    background: #dbeaff !important;
    color: #2877ff !important;
  }

  .ant-progress-status-success .ant-progress-text {
    color: #43ba9a;
  }

  .ant-checkbox-inner {
    border-radius: 4px !important;
  }

  .react-viewer-transition {
    transition: inherit !important;
  }
  [data-w-e-textarea] {
    overflow: visible;
  }
  .vertical-center-modal {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .vertical-center-modal .ant-modal {
    top: 0;
  }

  .ant-spin-nested-loading,
  .ant-spin-container {
    height: 100%;
  }

  //table样式 --- start
  .ant-table-thead > tr > th {
    height: 44px;
  }

  .ant-table-tbody > tr > td {
    border-bottom: none;
  }

  .ant-table-tbody > tr > td,
  .ant-table-thead > tr > th {
    padding: 0 16px;
  }

  .ant-table-row {
    height: 52px;
  }

  .ant-table-column-sorters {
    justify-content: inherit;
  }

  .ant-table-column-title {
    flex: initial;
  }

  .ant-table-column-sorter {
    margin-left: 12px;
  }

  //table样式 --- end

  .ant-dropdown-menu-item {
    color: #646566;
    .ant-dropdown-menu-title-content div {
      min-width: 80px;
    }
  }
  .ant-dropdown-menu-item:hover {
    background: #f4f5f5;
    color: #323233;
  }
  .ant-dropdown-menu-item:active {
    background: #f0f4fa;
    color: #2877ff;
  }

  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  ::-webkit-scrollbar-thumb {
    background: #dadada;
    border-radius: 6px;
  }

  .rc-virtual-list-scrollbar-thumb {
    background: #dadada !important;
    border-radius: 6px;
    width: 6px !important;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #adadad;
  }

  body,
  html {
    margin: 0;
    box-sizing: border-box;
  }
  // .ant-checkbox-wrapper {
  //   margin: 0 !important;
  // }
  input:-webkit-autofill {
    box-shadow: 0 0 0 1000px #fff inset !important;
  }

  input:-internal-autofill-previewed,
  input.ant-input:-internal-autofill-previewed {
    -webkit-text-fill-color: #333 !important;
    transition: background-color 5000s ease-in-out 0s !important;
  }

  .ant-btn-link:hover,
  .ant-btn-link:focus {
    background: #f2f2f4;
  }
  .ant-popover-inner-content {
    padding: 0;
  }
  .ant-modal-title {
    font-weight: bold;
  }
  textarea {
    resize: none;
  }
  .ant-modal-header {
    border: none;
  }
  .highcharts-tick {
    stroke: transparent;
  }
  .highcharts-axis-line {
    stroke: transparent;
  }
  .highcharts-grid-line {
    stroke: transparent;
  }
  .ant-upload-list-item:hover .ant-upload-list-item-info {
    background-color: transparent;
  }
  .ant-empty {
    // visibility: hidden;
  }

  .ant-select-item-option {
    font-weight: inherit;

    color: #646566;
  }
  .ant-select-item-option:hover {
    font-weight: inherit;

    background: #f4f5f5;
    color: #323233;
  }
  .ant-select-item-option-selected:not(.ant-select-item-option-disabled) {
    background-color: transparent;
    font-weight: inherit;
    color: #2877ff;
  }
  .ant-select-item-option-selected:not(.ant-select-item-option-disabled):hover {
    background-color: #f0f4fa;
  }

  .ant-btn-default,
  .ant-btn-default:hover,
  .ant-btn-default:active {
    color: #646566;
    background: #f2f2f4;
    border: none;
  }

  .ant-popover-arrow,
  .ant-picker-range-arrow {
    display: none !important;
  }

  .ant-popover-placement-bottom,
  .ant-popover-placement-bottomLeft,
  .ant-popover-placement-bottomRight {
    padding-top: 0;
  }

  .ant-popover-placement-rightTop {
    padding-left: 0 !important;
  }
  .ant-picker-range .ant-picker-active-bar {
    background: none;
  }

  .ant-input-affix-wrapper:focus,
  .ant-input-affix-wrapper-focused {
    box-shadow: initial !important;
    border-color: #2877ff !important;
    border: 1px solid #2877ff !important;
  }

  .ant-table-sticky-scroll {
    display: none;
  }

  .ant-tooltip-inner span {
    color: white !important;
  }

  .ant-progress-circle.ant-progress-status-success .ant-progress-text {
    color: black !important;
  }
  .ant-tree .ant-tree-node-content-wrapper:hover {
    background-color: transparent;
  }
  .ant-tree .ant-tree-treenode {
    padding-right: 20px;
    box-sizing: border-box;
    width: 100%;
    &:hover {
      cursor: grab;
      background-color: #f4f5f5;
      [data-tree] {
        visibility: visible;
      }
    }
  }
  .ant-tree-switcher {
    display: flex;
    align-items: center;
  }
  .ant-tree .ant-tree-treenode {
    align-items: center;
  }
  .ant-tree .ant-tree-node-content-wrapper.ant-tree-node-selected {
    background-color: transparent;
    width: 100%;
  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  .ant-form-item-label
    > label.ant-form-item-required:not(.ant-form-item-required-mark-optional)::after {
    display: inline-block;
    margin-right: 4px;
    color: #ff4d4f;
    font-size: 14px;
    font-family: SimSun, sans-serif;
    line-height: 1;
    content: '*';
  }
  .ant-form-item-label
    > label.ant-form-item-required:not(.ant-form-item-required-mark-optional)::before {
    display: none;
    margin-right: 4px;
    color: #ff4d4f;
    font-size: 14px;
    font-family: SimSun, sans-serif;
    line-height: 1;
    content: '*';
  }
  .ant-form-item-label > label::after {
    display: none;
  }
  .ant-tree-treenode-selected {
    background-color: #f0f4f9 !important;
  }
  .ant-tree .ant-tree-treenode-draggable .ant-tree-draggable-icon {
    opacity: 1;
  }

  .row-dragging {
    display: flex;
    align-items: center;
    background: #ffffff;
    box-shadow: 0px 0px 15px 6px rgba(0, 0, 0, 0.12);
    border-radius: 6px 6px 6px 6px;
    z-index: 10000 !important;
  }
  .ant-switch {
    background-color: #d5d6d9 !important;
  }
  .ant-switch-checked {
    background-color: #2877ff !important;
  }
  .row-dragging td {
    padding: 16px;
  }
  .row-dragging li {
    padding: 6px;
  }

  .row-dragging .drag-visible {
    visibility: visible;
  }
  .resize_save {
    position: absolute;
    top: 0;
    right: 5px;
    bottom: 0;
    left: 0;
    padding-left: 5px;
    overflow-x: hidden;
  }
  .resize_save2 {
    position: absolute;
    top: 0;
    right: 5px;
    bottom: 0;
    left: 0;
    padding-right: 0px;
  }
  .resize_bar {
    width: 240px;
    max-width: 700px;
    min-width: 240px;
    height: inherit;
    resize: horizontal;
    cursor: ew-resize;
    cursor: col-resize;
    opacity: 0;
    overflow: scroll;
  }
  .resize_bar2 {
    max-width: 65vw;
    width: 65vw;
    min-width: 30vw;
    height: inherit;
    resize: horizontal;
    cursor: ew-resize;
    cursor: col-resize;
    opacity: 0;
    overflow: scroll;
  }
  /* 拖拽线 */
  .resize_line {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    border-right: 1px solid #f0f0f0;
    border-left: 1px solid #f0f0f0;
    pointer-events: none;
  }
  .resize_bar:hover ~ .resize_line,
  .resize_bar:active ~ .resize_line {
    border-left: 1px dashed skyblue;
  }
  .resize_bar::-webkit-scrollbar {
    width: 200px;
    height: inherit;
  }
  .resize_bar2:hover ~ .resize_line,
  .resize_bar2:active ~ .resize_line {
    border-left: 1px dashed skyblue;
  }
  .resize_bar2::-webkit-scrollbar {
    width: 200px;
    height: inherit;
  }

  .ant-picker,
  .ant-select:not(.ant-select-customize-input) .ant-select-selector,
  .ant-input,
  .ant-input-number {
    border: 1px solid #ebedf0;
  }
  .ant-tree .ant-tree-node-content-wrapper.ant-tree-node-selected {
    width: 0;
  }

  .ant-table table {
    padding-bottom: 0 !important;
  }

  .ant-tooltip-inner {
    white-space: pre-wrap;
    min-width: 45px;
  }
  .ant-collapse-content {
    border-top: 1px solid #ecedef;
  }

  .ant-table-cell .ant-popover {
    z-index: 2 !important;
  }

  .ant-modal {
    padding-bottom: 0;
  }

  // 树下拉
  .ant-tree-select-dropdown {
    padding: 2px 0 !important;
  }
  .ant-select-tree-treenode {
    padding: 0 !important;
  }
  .ant-select-tree-treenode:hover {
    background: #f4f5f5 !important;
  }
  .ant-select-tree-treenode-selected {
    background: #f0f4fa !important;
  }
  .ant-select-tree-node-content-wrapper:hover,
  .ant-select-tree-node-content-wrapper.ant-select-tree-node-selected {
    background-color: transparent !important;
  }
  .ant-select-tree-switcher,
  .ant-select-tree-node-content-wrapper {
    line-height: 32px !important;
    height: 32px !important;
  }

  .ant-dropdown-menu-item,
  .ant-dropdown-menu-submenu-title {
    padding: 5px 0;
    text-align: center;
    min-width: 60px;
  }

  .ant-dropdown-menu-title-content div {
    padding: 0 12px;
    white-space: pre;
  }

  .ant-tree-node-content-wrapper-normal,
  .ant-tree-node-content-wrapper,
  .ant-tree-node-selected {
    width: 100% !important ;
    display: inline-block;
  }

  .ant-collapse-content-box {
    max-height: 300px;
    overflow-y: auto;
  }

  .ant-picker-range-separator svg {
    margin: 0 !important;
  }

  .w-e-bar-divider {
    height: 20px !important;
    margin: 10px 5px !important;
  }
`
const GlobalStyle = () => {
  return <Global styles={customCss} />
}

export default GlobalStyle
