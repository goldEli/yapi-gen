// 修改的全局样式

import { css, Global } from '@emotion/react'
import { useSelector } from '@store/index'

const GlobalStyle = () => {
  const { theme } = useSelector(store => store.global)
  const white = css`
    :root {
      --font12: 12px;
      --font14: 14px;
      --font16: 16px;
      --font18: 18px;
      --font20: 20px;
      // 按钮 --- start
      --auxiliary-b1: #6688ff;
      --auxiliary-b2: #7a97ff;
      --auxiliary-b3: #496ef2;
      --auxiliary-b4: #f6f7f9;
      --auxiliary-b5: #f0f3ff;
      --auxiliary-b6: #e5ebff;
      --auxiliary-b7: #f8f7f7;
      --auxiliary-b8: #fff0f0;
      --auxiliary-b9: #ffe5e6;
      --auxiliary-b10: #f9f9fa;
      --auxiliary-text-t1-d1: #ffffff;
      --auxiliary-text-t1-d2: #6688ff;
      --auxiliary-text-t2-d1: #646566;
      --auxiliary-text-t2-d2: #6688ff;
      --auxiliary-text-t3: #ff5c5e;
      --auxiliary-t4: #d5d6d9;
      // 按钮 --- end
      --primary-d1: #6688ff;
      --hover-d1: #f3f3f5;
      --hover-d2: #f6f7f9;
      --hover-d3: #f6f7f9;
      --selected: #f0f3ff;
      --gradient: linear-gradient(
        180deg,
        #ebefff 0%,
        rgba(243, 246, 255, 0) 100%
      );
      --gradient-left: linear-gradient(
        90deg,
        #ebefff 0%,
        rgba(243, 246, 255, 0) 100%
      );
      --primary-d2: #6688ff;
      --active: #ebedf0;
      --neutral-black: #000000;
      --neutral-n1-d1: #323233;
      --neutral-n1-d2: #323233;
      --neutral-n2: #646566;
      --neutral-n3: #969799;
      --neutral-n4: #bbbdbf;
      --neutral-n5: #d5d6d9;
      --neutral-n6-d1: #ebeced;
      --neutral-n6-d2: #ebeced;
      --neutral-n7: #f2f2f4;
      --neutral-n8: #f5f5f7;
      --neutral-n9: #f9f9fa;
      --neutral-white-d1: #ffffff;
      --neutral-white-d2: #ffffff;
      --neutral-white-d3: #ffffff;
      --neutral-white-d4: #ffffff;
      --neutral-white-d5: #ffffff;
      --neutral-white-d6: #ffffff;
      --neutral-n10: #fafafc;
      --neutral-white-d7: #ffffff;
      --function-success: #43ba9a;
      --function-error: #ff5c5e;
      --function-warning: #fa9746;
      --neutral-transparent-n1-d1: rgba(50, 50, 51, 0.4);
      --function-tag1: rgba(161, 118, 251, 0.1);
      --function-tag2: rgba(67, 186, 154, 0.1);
      --function-tag3: rgba(255, 92, 94, 0.1);
      --function-tag4: rgba(250, 151, 70, 0.1);
      --function-tag5: rgba(102, 136, 255, 0.1);
      --function-tag6: rgba(150, 151, 153, 0.1);
      --avatar-border: #dde3f3;
    }
  `
  const black = css`
    :root {
      --font12: 12px;
      --font14: 14px;
      --font16: 16px;
      --font18: 18px;
      --font20: 20px;
      // 按钮 --- start
      --auxiliary-b1: #6688ff;
      --auxiliary-b2: #7a97ff;
      --auxiliary-b3: #496ef2;
      --auxiliary-b4: #333640;
      --auxiliary-b5: #3b3e49;
      --auxiliary-b6: #2f323c;
      --auxiliary-b7: #333640;
      --auxiliary-b8: #3b3e49;
      --auxiliary-b9: #2f323c;
      --auxiliary-b10: #2f323c;
      --auxiliary-text-t1-d1: #ffffff;
      --auxiliary-text-t1-d2: #ffffff;
      --auxiliary-text-t2-d1: #ffffff;
      --auxiliary-text-t2-d2: #ffffff;
      --auxiliary-text-t3: #ff5c5e;
      --auxiliary-t4: #3d4251;
      // 按钮 --- end
      --primary-d1: #6688ff;
      --hover-d1: #333640;
      --hover-d2: #333640;
      --hover-d3: #474a58;
      --selected: #333640;
      --gradient: linear-gradient(180deg, #3a4159 0%, rgba(58, 65, 89, 0) 100%);
      --gradient-left: linear-gradient(
        90deg,
        #3a4159 0%,
        rgba(58, 65, 89, 0) 100%
      );
      --primary-d2: #ffffff;
      --active: #3f4453;
      --neutral-black: #000000;
      --neutral-n1-d1: #cfd4e5;
      --neutral-n1-d2: #a1a5b2;
      --neutral-n2: #bcbfcc;
      --neutral-n3: #737680;
      --neutral-n4: #666975;
      --neutral-n5: #3d4251;
      --neutral-n6-d1: #353948;
      --neutral-n6-d2: #3f4453;
      --neutral-n7: #424654;
      --neutral-n8: #3b3f4a;
      --neutral-n9: #272930;
      --neutral-white-d1: #292b33;
      --neutral-white-d2: #2d2f38;
      --neutral-white-d3: #424654;
      --neutral-white-d4: #333640;
      --neutral-white-d5: #373a45;
      --neutral-white-d6: #3d404d;
      --neutral-n10: #2d2f38;
      --neutral-white-d7: #ffffff;
      --function-success: #43ba9a;
      --function-error: #ff5c5e;
      --function-warning: #fa9746;
      --neutral-transparent-n1-d1: rgba(50, 50, 51, 0.4);
      --function-tag1: rgba(161, 118, 251, 0.1);
      --function-tag2: rgba(67, 186, 154, 0.1);
      --function-tag3: rgba(255, 92, 94, 0.1);
      --function-tag4: rgba(250, 151, 70, 0.1);
      --function-tag5: rgba(102, 136, 255, 0.1);
      --function-tag6: rgba(150, 151, 153, 0.1);
      --avatar-border: #57617d;
    }
  `
  const colors = [white, black]

  const globalCss = css`
    .clickable-row {
      cursor: pointer;
    }
    ${colors[theme]}
    .ant-form-item-label > label {
      color: var(--neutral-n1-d1);
      font-size: var(--font14);
    }

    :root {
      .info_item_tab_label {
        label {
          width: 100%;
        }
      }
      .popover_yang {
        top: 49px !important;
      }
      .custom-menu .ant-dropdown-menu {
        max-height: 300px;
        overflow: auto;
        padding: 4px 0;
      }
      .progressDropdownBox_yang {
        .ant-dropdown-menu {
          max-height: 250px;
          /* overflow: auto; */
        }
      }
      .notification-my {
        height: 109px;
        background: rgba(102, 136, 255, 0.1);
        backdrop-filter: blur(100px);
        border-left: 4px solid #6688ff;
        padding: 18px;
        padding-left: 10px;
        box-shadow: 'none';
      }
      --blue: linear-gradient(
        180deg,
        rgba(183, 218, 238, 0) 0%,
        rgba(0, 163, 255, 0.4) 100%
      );
      --green: linear-gradient(
        180deg,
        rgba(194, 241, 235, 0.2) 0%,
        rgba(0, 155, 86, 0.2) 100%
      );
      --purple: linear-gradient(
        180deg,
        rgba(215, 152, 254, 0) 0%,
        rgba(66, 0, 255, 0.2) 100%
      );
      --orange: linear-gradient(
        180deg,
        rgba(238, 209, 183, 0) 0%,
        rgba(221, 80, 0, 0.2) 100%
      );
    }
    .ant-badge-multiple-words {
      padding: 0 2px;
    }
    .ant-checkbox-indeterminate .ant-checkbox-inner::after {
      background-color: #6688ff;
    }

    .ant-input {
      input {
        font-family: SiYuanRegular;
      }
      &::placeholder {
        font-family: SiYuanRegular;
      }
    }
    .ant-input:focus,
    .ant-input-focused {
      box-shadow: inherit !important;
    }

    .ant-form-item {
      padding-top: 2px !important;
    }
    .ant-progress-inner {
      background-color: var(--neutral-n6-d1);
    }
    .ant-progress-status-success .ant-progress-text {
      color: var(--function-success);
    }

    .ant-checkbox-inner {
      border-radius: 4px !important;
    }
    .ant-timeline-item-tail {
      border-left: 2px solid var(--neutral-n6-d2);
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
      overflow: inherit;
    }

    .vertical-center-modal .ant-modal {
      top: 0;
    }

    .ant-spin-nested-loading,
    .ant-spin-container {
      width: 100%;
      height: 100%;
    }
    .workItem {
      height: 100vh;
      overflow: hidden;
      .ant-spin-nested-loading,
      .ant-spin-container {
        overflow: hidden;
      }
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
      /* height: 32px; */
      color: var(--neutral-n2);
      .ant-dropdown-menu-title-content div {
        /* min-width: 80px; */
      }
    }

    .ant-dropdown-menu-submenu {
      height: 32px;
    }
    .ant-dropdown-menu-item:hover {
      background: var(--hover-d3) !important;
      color: var(--neutral-n1-d1);
    }
    .ant-dropdown-menu-item:active {
      color: var(--primary-d2);
    }

    ::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }

    ::-webkit-scrollbar-thumb {
      background: var(--neutral-n5);
      border-radius: 6px;
    }

    .rc-virtual-list-scrollbar-thumb {
      background: var(--neutral-n5) !important;
      border-radius: 6px;
      width: 6px !important;
    }

    ::-webkit-scrollbar-thumb:hover {
      background: var(--neutral-n4);
    }

    body,
    html {
      margin: 0;
      box-sizing: border-box;
      user-select: none;
    }
    // .ant-checkbox-wrapper {
    //   margin: 0 !important;
    // }
    input:-webkit-autofill {
      box-shadow: 0 0 0 1000px var(--neutral-white-d2) inset !important;
    }

    input:-internal-autofill-previewed,
    input.ant-input:-internal-autofill-previewed {
      -webkit-text-fill-color: var(--auxiliary-b4) !important;
      transition: background-color 5000s ease-in-out 0s !important;
    }
    .ant-input-affix-wrapper {
      border: 1px solid var(--neutral-n6-d1);
    }
    .ant-input-affix-wrapper:focus,
    .ant-input-affix-wrapper-focused {
      box-shadow: none;
      border: 1px solid var(--primary-d2);
    }
    .ant-popover-inner-content {
      padding: 0;
    }
    .ant-modal-title {
      font-family: siyuanmedium;
    }
    textarea {
      resize: none;
    }
    .ant-modal-header {
      border: none;
    }
    // .highcharts-tick {
    //   stroke: transparent;
    // }
    // .highcharts-axis-line {
    //   stroke: transparent;
    // }
    // .highcharts-grid-line {
    //   stroke: transparent;
    // }
    // .ant-upload-list-item:hover .ant-upload-list-item-info {
    //   background-color: transparent;
    // }
    .ant-empty {
      // visibility: hidden;
    }

    .ant-select-item {
      padding: 5px 16px !important;
    }

    .ant-select-item-option {
      font-weight: inherit;
      color: var(--neutral-n2);
      display: flex;
      align-items: center;
    }
    .ant-select-item-option:hover {
      font-weight: inherit;
      background: var(--hover-d3) !important;
      color: var(--neutral-n1-d1) !important;
    }
    .ant-select-item-option-selected:not(.ant-select-item-option-disabled) {
      background-color: transparent;
      font-weight: inherit;
      color: var(--primary-d2) !important;
      .selectText {
        color: var(--primary-d2) !important;
      }
    }
    .ant-select-item-option-selected:not(
        .ant-select-item-option-disabled
      ):hover {
      /* background-color: var(--neutral-white-d4); */
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

    input {
      &::placeholder {
        font-size: 14px;
        color: var(--neutral-n4) !important;
      }
    }
    .ant-table-sticky-scroll {
      display: none;
    }

    .ant-tooltip-inner span {
      color: white !important;
    }

    .ant-progress-circle.ant-progress-status-success .ant-progress-text {
      color: var(--neutral-black) !important;
    }
    .ant-tree .ant-tree-node-content-wrapper:hover {
      background-color: transparent;
    }
    .ant-tree .ant-tree-treenode {
      /* padding-right: 20px; */
      box-sizing: border-box;
      width: 100%;
      &:hover {
        cursor: grab;
        background-color: var(--hover-d3);
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
      > label.ant-form-item-required:not(
        .ant-form-item-required-mark-optional
      )::after {
      display: inline-block;
      margin-right: 4px;
      color: #ff4d4f;
      font-size: 14px;
      font-family: SimSun, sans-serif;
      line-height: 1;
      content: '*';
    }
    .ant-form-item-label
      > label.ant-form-item-required:not(
        .ant-form-item-required-mark-optional
      )::before {
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
      background: linear-gradient(
        90deg,
        #ebefff 0%,
        rgba(243, 246, 255, 0) 100%
      );
      .treeBox {
        color: var(--primary-d2);
      }
    }
    .ant-tree .ant-tree-treenode-draggable .ant-tree-draggable-icon {
      opacity: 1;
    }
    .ant-tree-list {
      .ant-tree-switcher {
        color: var(--neutral-n3);
      }
      .ant-tree-draggable-icon {
        color: var(--neutral-n3);
      }
    }
    .row-dragging2 {
      display: flex;
      align-items: center;
      background: var(--auxiliary-text-t1-d1);
      box-shadow: 0px 0px 15px 6px rgba(0, 0, 0, 0.12);
      border-radius: 6px 6px 6px 6px;

      z-index: 10000 !important;
    }
    .row-dragging {
      display: flex;
      align-items: center;
      background: var(--auxiliary-text-t1-d1);
      box-shadow: 0px 0px 15px 6px rgba(0, 0, 0, 0.12);
      border-radius: 6px 6px 6px 6px;
      z-index: 10000 !important;
    }
    .ant-switch {
      background-color: var(--neutral-n5) !important;
    }
    .ant-switch-checked {
      background-color: var(--primary-d2) !important;
    }
    .row-dragging td {
      padding: 16px;
    }
    .row-dragging li {
      padding: 6px;
    }

    .row-dragging2 input {
      width: 386px;
    }

    .row-dragging .drag-visible {
      visibility: visible;
    }

    .ant-picker,
    .ant-select:not(.ant-select-customize-input) .ant-select-selector,
    .ant-input,
    .ant-input-number {
      border: 1px solid var(--neutral-n6-d1);
    }
    .ant-tree .ant-tree-node-content-wrapper.ant-tree-node-selected {
      width: 0;
    }

    .ant-table table {
      padding-bottom: 0 !important;
    }
    .ant-table-row {
      &:hover .icon {
        opacity: 1;
      }
    }
    .ant-tooltip-inner {
      white-space: pre-wrap;
    }
    .ant-collapse-content {
      border-top: 1px solid var(--neutral-n6-d1);
    }

    /* 表格头部移入显示拖拽 */
    .ant-table-cell:hover {
      .react-resizable-handle {
        border-right: 1px solid var(--primary-d1);
      }
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
      background: var(--neutral-n1-d1) !important;
    }
    .ant-select-tree-treenode-selected {
      background: var(--neutral-n6-d2) !important;
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

    /* .ant-dropdown-menu-title-content div {
      white-space: pre;
    } */

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
    /* input */
    .ant-input {
      border-radius: 6px;
      font-size: 14px;
    }
    .ant-input-prefix {
      margin-right: 10px;
    }
    padding: 0 12px;
    border: 1px solid var(--neutral-n6-d1);
    &::placeholder {
      font-size: 14px;
    }
    /* checkbox */
    .ant-checkbox-checked::after {
      border: 0px solid var(--primary-d1);
    }
    .ant-checkbox-wrapper:hover .ant-checkbox-inner,
    .ant-checkbox:hover .ant-checkbox-inner,
    .ant-checkbox-input:focus + .ant-checkbox-inner {
      border-color: var(--primary-d1);
    }
    .ant-checkbox-checked .ant-checkbox-inner {
      border-color: var(--primary-d1);
    }

    .ant-checkbox-wrapper-checked .ant-checkbox-checked .ant-checkbox-inner {
      background-color: var(--primary-d1);
    }
    .ant-checkbox-wrapper-disabled .ant-checkbox-disabled .ant-checkbox-inner {
      background-color: var(--neutral-n7);
    }
    .ant-pagination {
      width: 100%;
      height: 48px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      .anticon {
        color: var(--neutral-n4);
      }
    }
    .ant-pagination-total-text {
      font-size: 12px;
      font-weight: 400;
      color: var(--neutral-n2);
    }
    .ant-pagination-disabled .ant-pagination-item-link,
    .ant-pagination-disabled:hover .ant-pagination-item-link,
    .ant-pagination-item,
    .ant-pagination-item-link {
      border: none;
      background-color: var(--neutral-white-d1);
      color: var(--neutral-n2);
    }
    .ant-pagination-item-link svg:hover {
      color: var(--primary-d2);
    }
    .ant-select:not(.ant-select-customize-input) .ant-select-selector,
    input {
      background-color: var(--neutral-white-d1);
      color: var(--neutral-n2);
      border: 1px solid var(--neutral-n6-d1);
    }
    .ant-pagination-item,
    .ant-select-selection-item,
    .ant-pagination-options-quick-jumper {
      font-size: 14px;
      font-weight: 400;
      color: var(--neutral-n2);
    }
    .ant-pagination-item-active,
    .ant-pagination-item-active:hover a {
      color: var(--primary-d2);
    }
    .ant-select:not(.ant-select-disabled):hover,
    .ant-select-show-arrow,
    .ant-select-focused,
    .ant-picker-focused,
    .ant-input-number-focused,
    .ant-select-selector,
    .ant-select:hover {
      box-shadow: inherit !important;
      .ant-dropdown-menu-item:hover {
        background-color: var(--hover-d3);
        color: var(--neutral-n1-d1);
      }
      .ant-dropdown-menu-item-active {
        background-color: var(--hover-d3);
        color: var(--neutral-n1-d1);
      }
      border-color: var(--neutral-n6-d1);
    }

    .ant-select:hover {
      border-color: 1px solid red !important;
    }

    .ant-menu-light .ant-menu-item:hover,
    .ant-menu-light .ant-menu-item-active,
    .ant-menu-light .ant-menu:not(.ant-menu-inline) .ant-menu-submenu-open,
    .ant-menu-light .ant-menu-submenu-active,
    .ant-menu-light .ant-menu-submenu-title:hover {
      color: var(--primary-d2);
    }

    .ant-menu-light .ant-menu-item:hover,
    .ant-menu-light .ant-menu-item-active,
    .ant-menu-light .ant-menu:not(.ant-menu-inline) .ant-menu-submenu-open,
    .ant-menu-light .ant-menu-submenu-active,
    .ant-menu-light .ant-menu-submenu-title:hover .custom svg {
      color: var(--primary-d2);
    }

    .ant-dropdown-menu-item {
      min-width: 120px;
      background-color: var(--neutral-white-d5);
    }
    .ant-menu-vertical .ant-menu-submenu-selected,
    .ant-menu-vertical-left .ant-menu-submenu-selected,
    .ant-menu-vertical-right .ant-menu-submenu-selected {
      color: var(--primary-d2);
    }
    .ant-menu-submenu:hover
      > .ant-menu-submenu-title
      > .ant-menu-submenu-expand-icon,
    .ant-menu-submenu:hover
      > .ant-menu-submenu-title
      > .ant-menu-submenu-arrow {
      color: var(--primary-d2);
    }
    .ant-dropdown-menu-submenu-selected .ant-dropdown-menu-submenu-title {
      color: var(--neutral-n1-d1);
      .ant-dropdown-menu-submenu-expand-icon svg {
        font-size: 12px;
      }
    }
    .ant-btn-primary:hover,
    .ant-btn-primary:focus {
      background-color: var(--primary-d1);
      border-color: var(--primary-d1);
      color: var(--neutral-white-d7);
    }
    .ant-radio-checked::after {
      border: 1px solid var(--primary-d1);
    }
    .ant-radio-checked .ant-radio-inner {
      border-color: var(--primary-d1);
    }
    .ant-radio-inner::after {
      background-color: var(--primary-d1);
    }
    .ant-breadcrumb {
      font-size: 12px;
    }
    .ant-breadcrumb li:last-child {
      color: var(--neutral-n3);
    }
    /* .ant-dropdown-menu-submenu-expand-icon svg {
      font-size: 10px !important;
    } */
    .ant-timeline-item-head-blue {
      border-color: var(--primary-d1);
    }
    .ant-pagination-prev .ant-pagination-item-link,
    .ant-pagination-next .ant-pagination-item-link {
      border: none;
    }
    .ant-select-tree-treenode:hover {
      background-color: var(--hover-d3) !important;
    }
    .ant-btn {
      box-shadow: none;
    }
    .ant-dropdown {
      box-shadow: none;
      .ant-dropdown-menu-item-divider {
        margin: 0 16px;
      }
    }
    .drag-up {
      animation: dragup ease 0.2s 1;
      animation-fill-mode: forwards;
      border: solid 2px #cccccc;
    }

    .drag-item {
      height: 64px;
      animation: dragdown ease 0.2s 1;
      animation-fill-mode: forwards;
      border: solid 2px #cccccc;
    }
    .ant-tree.ant-tree-directory .ant-tree-treenode-selected:hover::before,
    .ant-tree.ant-tree-directory .ant-tree-treenode-selected::before {
      background: none;
    }

    // 全局提示 message
    .ant-message .ant-message-success .anticon {
      color: var(--function-success);
    }
    .ant-select-clear {
      width: 16px;
      font-size: 16px;
      right: 12px;
      margin-top: -8px;
    }
    //   .ant-dropdown-menu-item-divider, .ant-dropdown-menu-submenu-title-divider {
    //     margin: 4px 12px;
    //   }
    //   .ant-dropdown-menu-item, .ant-dropdown-menu-submenu-title{
    //     padding: 0 12px;
    //  }
    .ant-spin-nested-loading > div > .ant-spin {
      top: 50%;
      transform: translateY(-50%);
    }
    .tabs {
      .ant-tabs-nav-wrap {
        padding: 0 12px;
      }
    }
    .ant-tabs-ink-bar {
      background: var(--primary-d2);
    }
    .ant-drawer-inline {
      position: fixed;
    }
    .highcharts-legend-item {
      width: 8px !important;
      height: 8px !important;
    }
    .ant-tooltip {
      max-width: 300px;
      min-width: 30px;
    }
    .ant-select-focused:not(.ant-select-disabled) .ant-select-selector {
      box-shadow: none !important;
    }
    .ant-picker-focused {
      box-shadow: none !important;
    }
    .ant-picker-input > input:focus,
    .ant-picker-input > input-focused {
      box-shadow: none !important;
      outline: 0;
    }
    .ant-carousel .slick-slider {
      height: 100%;
    }
    .ant-carousel,
    .ant-carousel .slick-slider {
      width: 100%;
      height: 100%;
    }
    // 添加斑马纹
    .rowBgc table .ant-table-tbody tr:nth-child(odd) {
      background: var(--neutral-white-d1);
    }
    .rowBgc table .ant-table-tbody tr:nth-child(even) {
      background: var(--neutral-n10);
    }
    .rowBgc .ant-table-body::-webkit-scrollbar {
      width: 0;
    }
  `
  return <Global styles={globalCss} />
}

export default GlobalStyle
