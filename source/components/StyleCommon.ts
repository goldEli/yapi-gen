/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/naming-convention */
// 两次以上的公共样式

import { css } from '@emotion/css'
import styled from '@emotion/styled'
import { Slider } from 'antd'

// 弹窗右上角关闭图标
const CloseWrap = styled.div<{ width?: any; height?: any }>`
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 6px;
  svg {
    color: var(--neutral-n2);
  }
  &:hover {
    background: var(--hover-d1);
    svg {
      color: var(--neutral-n1-d1);
    }
  }
  &:active {
    background: var(--neutral-n6-d1);
    svg {
      color: var(--neutral-n1-d1);
    }
  }
`

const ChartsItem = styled.span`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`
const titleCss = css`
  color: var(--neutral-n1-d1);
  font-size: 14px;
  font-family: SiYuanMedium;
`

const title1Css = css`
  color: var(--neutral-n1-d1);
  font-size: 24px;
`

const title2Css = css`
  color: var(--neutral-n1-d1);
  font-size: 12px;
`

const chartsTitle = css`
  color: var(--neutral-n1-d1);
  font-size: 12px;
  margin-bottom: 10px;
`

const HomeWrap = styled.div`
  height: 104px;
  border: 1px solid var(--neutral-n6-d1);
  border-radius: 6px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  flex: 1;
`

const TextWrap = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  margin-top: 16px;
`
const TextBlueWrap = styled.div`
  width: 104px;
  height: 104px;
  background: var(--hover-d2);
  background-blend-mode: normal;
  border-radius: 6px;
  display: flex;
  margin-right: 24px;
  justify-content: center;
  align-items: center;
`

const HightChartsWrap = styled.div`
  height: 350px;
`
const ChartsWrap = styled.div`
  background-color: var(--neutral-white-d6);
  box-sizing: border-box;
  padding: 16px 24px;
  border-radius: 6px;
`
const HasIconMenu = styled.div<{ isCheck?: boolean }>(
  {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    '.icon': {
      marginRight: 12,
      fontSize: 16,
    },
    '.checked': {
      fontSize: 16,
      marginLeft: 36,
      color: 'var(--auxiliary-b1)',
    },
    '.left': {
      padding: 0,
      display: 'flex',
      alignItems: 'center',
    },
    '&: hover': {
      '.label': {
        color: 'var(--neutral-n1-d1)',
      },
      '.icon': {
        color: 'var(--neutral-n1-d1)',
      },
    },
  },
  ({ isCheck }) => ({
    '.label': {
      color: isCheck ? 'var(--auxiliary-b1)!important' : 'var(--neutral-n2)',
    },
    '.icon': {
      color: isCheck ? 'var(--auxiliary-b1)!important' : 'var(--neutral-n2)',
    },
  }),
)
// 新版移入效果例：项目列表左上方操作
const HoverWrap = styled.div<{ isActive?: any }>(
  {
    padding: '0 8px',
    height: 32,
    borderRadius: 6,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    color: 'var(--neutral-n2)',
    '.iconMain': {
      marginRight: 8,
      fontSize: 18,
    },
    svg: {
      fontSize: 18,
    },
    '&: hover': {
      background: '#F4F5F5',
      color: 'var(--neutral-n1-d1)',
    },
  },
  ({ isActive }) => ({
    background: isActive ? '#F4F5F5' : 'white',
    color: isActive ? 'var(--neutral-n1-d1)!important' : 'var(--neutral-n2)',
  }),
)

const DateQuickWrap = styled.div<{ isActive?: any }>(
  {
    padding: '0 14px',
    height: 20,
    borderRadius: 6,
    cursor: 'pointer',
    textAlign: 'center',
    fontSize: 12,
    lineHeight: '18px',
    marginTop: 16,
    '&: hover': {
      border: '1px solid  var(--hover-d2)',
      background: 'var(--hover-d2)',
      color: 'var(--primary-d2)',
    },
  },
  ({ isActive }) => ({
    border: isActive
      ? '1px solid var(--selected)'
      : '1px solid var(--neutral-n6-d1)',
    color: isActive ? 'var(--primary-d2)' : 'var(--neutral-n2)',
  }),
)

// 添加符号 例： 标签添加与附件添加
const AddWrap = styled.div<{ hasColor?: boolean; hasDash?: boolean }>(
  {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
    cursor: 'pointer',
    borderRadius: 6,
    '.anticon': {
      fontSize: 16,
      alignItems: 'center',
      svg: {
        margin: 0,
      },
    },
    div: {
      fontSize: 14,
      fontWeight: 400,
    },
  },
  ({ hasColor, hasDash }) => ({
    width: hasDash ? 22 : 'fit-content',
    height: hasDash ? 22 : 32,
    padding: hasDash ? '0 4px' : hasColor ? '0 8px' : 0,
    color: hasColor ? 'var(--primary-d2)' : 'var(--neutral-n3)',
    border: hasDash
      ? '1px dashed var(--neutral-n3)'
      : '1px solid var(--neutral-white-d6)',
    '.anticon > svg': {
      color: hasColor ? 'var(--primary-d2)' : 'var(--neutral-n3)',
    },
    '.anticon ': {
      marginRight: hasDash ? 0 : 4,
    },
    '&: hover': {
      border: hasDash ? '1px dashed var(--primary-d2)' : '',
      background: hasColor ? 'var(--hover-d2)' : '',
      '.anticon': {
        svg: {
          color: 'var(--primary-d2)',
        },
      },
      div: {
        color: 'var(--primary-d2)',
      },
    },
    '&: active': {
      background: hasColor ? 'var(--primary-d2)' : '',
    },
  }),
)

const PriorityWrap = styled.div<{ status?: any }>({
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  height: 26,
  padding: '0 6px',
  width: 'fit-content',
  borderRadius: 6,
  div: {
    color: 'var(--neutral-n2)',
    fontSize: 14,
    marginLeft: 8,
  },
  '.icon': {
    marginLeft: 8,
    visibility: 'hidden',
    fontSize: 16,
    color: 'var(--primary-d2)',
  },
  '.priorityIcon': {
    fontSize: 16,
    svg: {
      margin: '0!important',
    },
  },
  '&: hover': {
    background: 'var(--hover-d2)',
    '.icon': {
      visibility: 'visible',
    },
  },
})

// ----------------- 颜色未处理
const SliderWrap = styled(Slider)<{ isDisabled?: any }>(
  {
    margin: '0!important',
    '.ant-slider-track,.ant-slider-step,.ant-slider-rail': {
      height: '8px!important',
    },
    '.ant-slider-rail': {
      backgroundColor: '#F2F2F4!important',
      borderRadius: 10,
    },
    '.ant-slider-track': {
      backgroundColor: '#43BA9A!important',
    },
    '.ant-slider-handle': {
      width: 20,
      height: 20,
      border: '1px solid #EBEDF0!important',
      marginTop: -7,
    },
    '.ant-slider-handle:focus': {
      boxShadow: 'none',
    },
  },
  ({ isDisabled }) => ({
    '.ant-slider-handle': {
      '&: hover': {
        border: isDisabled ? '1px solid #2877FF!important' : '',
      },
    },
  }),
)

const SelectWrapBedeck = styled.div`
  height: 32px;
  position: relative;
  height: 32px;
  border: 1px solid #ebedf0;
  display: flex;
  align-items: center;
  border-radius: 6px;
  span {
    white-space: nowrap;
  }
  .ant-form-item {
    margin-bottom: 0;
    padding-top: 0 !important;
  }
  .ant-picker {
    border: none;
  }
  .ant-select-selection-placeholder {
    color: black;
  }
`

const SearchLine = styled.div`
  box-sizing: border-box;
  padding: 16px 0;
  display: flex;
  gap: 16px;
  padding-left: 24px;
  background: rgba(255, 255, 255, 1);
`

export {
  CloseWrap,
  ChartsItem,
  chartsTitle,
  ChartsWrap,
  HightChartsWrap,
  HomeWrap,
  TextBlueWrap,
  TextWrap,
  title1Css,
  title2Css,
  titleCss,
  HasIconMenu,
  HoverWrap,
  DateQuickWrap,
  AddWrap,
  PriorityWrap,
  SliderWrap,
  SelectWrapBedeck,
  SearchLine,
}
