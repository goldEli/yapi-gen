import styled from '@emotion/styled'
import { Space } from 'antd'

export const Header = styled.div`
  height: 52px;
  background: var(--neutral-white-d5);
  border-bottom: 1px solid var(--neutral-n6-d1);
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const BackIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--hover-d2);
  cursor: pointer;
`

export const ChangeIconGroup = styled.div`
  border: 1px solid var(--neutral-n6-d1);
  border-radius: 6px;
  cursor: pointer;
  box-sizing: border-box;
  width: 64px;
  height: 32px;
  display: flex;
  overflow: hidden;
  div {
    width: 31px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--neutral-white-d4);
    svg {
      color: var(--neutral-n2);
    }
  }
  div:hover {
    background: var(--hover-d2);
    svg {
      color: var(--primary-d2);
    }
  }
`

export const ChangeIconBox = styled.div`
  border: 1px solid var(--neutral-n6-d1);
  background: var(--neutral-white-d4);
  border-radius: 6px;
  cursor: pointer;
  box-sizing: border-box;
  width: 32px;
  height: 32px;
  display: flex;
  overflow: hidden;
  align-items: center;
  justify-content: center;
  svg {
    color: var(--neutral-n2);
  }
  &:hover {
    background: var(--hover-d2);
    svg {
      color: var(--primary-d2);
    }
  }
`

export const Content = styled.div`
  height: calc(100% - 53px);
  overflow: auto;
  padding: 16px 24px;
  position: relative;
`

export const ParentBox = styled(Space)`
  display: flex;
  height: 22px;
  margin-bottom: 16px;
`

export const DemandName = styled.div`
  font-size: var(--font16);
  color: var(--neutral-n1-d1);
  font-family: SiYuanMedium;
`

export const CollapseItem = styled.div`
  margin-top: 16px;
`

export const CollapseItemTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px;
  cursor: pointer;
  height: 28px;
  background: var(--hover-d2);
  span {
    font-size: var(--font12);
    color: var(--neutral-n2);
  }
`

export const ContentItem = styled.div`
  margin-bottom: 32px;
`

export const CollapseItemContent = styled.div<{ isOpen?: boolean }>`
  height: ${props => (props.isOpen ? 'auto' : 0)};
  padding-top: ${props => (props.isOpen ? 16 : 0)}px;
  overflow: hidden;
  transition: 0.2s;
`

export const Label = styled.div`
  margin-bottom: 8px;
  font-size: var(--font14);
  color: var(--neutral-n1-d1);
`

export const ShowLabel = styled.div({
  cursor: 'pointer',
  fontSize: 14,
  fontWeight: 400,
  color: '#2877ff',
})

export const MaxLabel = styled.div<{ width: number }>`
  width: ${props => props.width}px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`

export const InfoItem = styled.div({
  display: 'flex',
  alignItems: 'center',
  marginTop: 14,
  position: 'relative',
})

export const ContentWrap = styled.div<{ notHover?: any }>(
  {
    color: '#323233',
    fontSize: 14,
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '98%',
    wordBreak: 'break-all',
  },
  ({ notHover }) => ({
    paddingLeft: notHover ? 8 : 0,
  }),
)
