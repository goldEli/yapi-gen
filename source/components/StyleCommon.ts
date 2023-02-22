/* eslint-disable @typescript-eslint/naming-convention */
// 两次以上的公共样式

import { css } from '@emotion/css'
import styled from '@emotion/styled'

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
}
