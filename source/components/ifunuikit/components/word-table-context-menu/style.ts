import styled from "@emotion/styled";
import { Menu } from "react-contexify";

export const Wrap = styled(Menu)`
  position: fixed;
  z-index: 100;
  @keyframes contexify_fadeOut {
    0% {
      opacity: 1;
      transform: translateY(0);
    }
    to {
      opacity: 0;
      transform: translateY(10px);
    }
  }
  &.contexify_willLeave-fade {
    animation: contexify_fadeOut 0.3s ease;
  }
  .ant-menu-item:not(.ant-menu-item-selected) {
    &:hover {
      background-color: #edf2ff !important;
    }
  }
`;
