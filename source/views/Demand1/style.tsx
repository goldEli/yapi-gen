import IconFont from '@/components/IconFont'
import { css } from '@emotion/css'
import styled from '@emotion/styled'

// 列表主页样式
export const Wrap = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  padding: 20px 16px 0 0px;
  flex-direction: column;
`

export const ContentWrap = styled.div`
  display: flex;
  height: calc(100% - 32px);
  overflow-y: auto;
`

export const ContentLeft = styled.div`
  margin-top: 20px;
`

export const ContentRight = styled.div`
  width: 100%;
  height: 100%;
  padding-left: 24px;
`

export const OperationWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 32px;
  margin-bottom: 20px;
  background: var(--neutral-white-d6);
  margin: 20px 0;
`

export const ContentMain = styled.div`
  width: 100%;
  height: calc(100% - 72px);
`

// 列表主页样式

// 左侧需求分类
export const TitleWrap = styled.div({
  paddingLeft: '15px',
  whiteSpace: 'nowrap',
  fontSize: 14,
  color: 'var(--neutral-n1-d2)',
  fontFamily: 'SiYuanMedium',
})

export const TreeBox = styled.div`
  width: 100% !important;
  height: 40px;
  border-radius: 0px 0px 0px 0px;
  display: flex;
  align-items: center;
`
export const FormBox = styled.div`
  padding: 0 20px 0 24px;
`
export const ButtonsItemBox = styled.div`
  cursor: pointer;
  min-width: 102px;
  padding: 0px 10px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: start;
  border-radius: 0px 0px 0px 0px;
  font-size: 14px;
  font-family: PingFang SC-Regular, PingFang SC;
  font-weight: 400;
  color: var(--neutral-n2);
  &:hover {
    background: var(--hover-d3);
    color: var(--neutral-n1-d2);
  }
`
export const centerText = css`
  box-sizing: border-box;
  white-space: nowrap;
  margin-left: 10px;
`
export const rightText = css`
  box-sizing: border-box;
  visibility: hidden;
  font-size: 16px;
  margin-left: auto;
  color: var(--neutral-n3) !important;
  &:hover {
    color: var(--primary-d2);
  }
`
// 左侧需求分类

// 右侧操作栏
export const StickyWrap = styled.div({
  background: 'white',
})

export const LiWrap = styled.div({
  cursor: 'pointer',
  padding: '0 16px',
  width: '100%',
  height: 32,
  display: 'flex',
  alignItems: 'center',
  background: 'var(--neutral-white-d3)',
  '&: hover': {
    background: 'var(--hover-d3)',
  },
})

export const IconWrap = styled(IconFont)({
  fontSize: 20,
  cursor: 'pointer',
  padding: 6,
  borderRadius: 6,
  color: 'var(--neutral-n3)',
  '&: hover': {
    color: 'var(--neutral-n1-d1)',
    background: 'var(--hover-d3)',
  },
})

export const MoreWrap = styled.div<{ type?: any }>(
  {
    display: 'flex',
    alignItems: 'center',
    height: 32,
    borderRadius: 6,
    padding: '0 16px',
    fontSize: 14,
    fontWeight: 400,
    cursor: 'pointer',
  },
  ({ type }) => ({
    background: type ? 'var(--primary-d1)' : 'var(--hover-d2)',
    color: type ? 'var(--neutral-white-d7)' : 'var(--primary-d2)',
    '&: hover': {
      background: type ? 'var(--primary-d1)' : 'var(--hover-d2)',
    },
    '&: active': {
      background: type ? 'var(--primary-d1)' : 'var(--hover-d2)',
    },
  }),
)

export const MoreItem = styled.div({
  display: 'flex',
  alignItems: 'center',
  height: 32,
  color: 'var(--neutral-n2)',
  fontSize: 14,
  fontWeight: 400,
  cursor: 'pointer',
  padding: '0 16px',
  svg: {
    color: 'var(--neutral-n3)',
  },
  '&: hover': {
    color: 'var(--neutral-n1-d1)!important',
    background: 'var(--hover-d3)',
    svg: {
      color: 'var(--neutral-n1-d1)!important',
    },
  },
})

// 右侧操作栏

// 表格内容
export const TableContent = styled.div`
  background: var(--neutral-white-d1);
  height: 100%;
`
// 表格内容
