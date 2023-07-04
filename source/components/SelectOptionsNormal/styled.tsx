import styled from '@emotion/styled'
import IconFont from '../IconFont'

export const SelectOptionsBox = styled.div`
  display: flex;
  align-items: center;
  height: 32px;
  border-radius: 6px;
  /* padding: 0 16px; */
  font-size: 14px;
  width: 100%;
  box-sizing: border-box;
  cursor: pointer;
  color: var(--neutral-n2);
  background-color: var(--hover-d2);
  &:hover {
    color: var(--auxiliary-text-t1-d2);
  }
`

export const OperationArea = styled.div`
  min-width: 50px;
`
export const BtnsArea = styled.div`
  display: none;
  gap: 14px;
`

export const CheckIcon = styled.div<{ visible: boolean }>`
  display: ${props => (props.visible ? 'flex' : 'none')};
  justify-content: flex-end;
`

export const LabelArea = styled.div`
  display: flex;
  gap: 8px;
  margin-right: 16px;
  .label {
    color: var(--neutral-n2);
  }
`

export const DefaultTag = styled.div<{ visible: boolean }>`
  display: ${props => (props.visible ? 'flex' : 'none')};
  font-size: 12px;
  height: 22px;
  padding: 0 8px;
  align-items: center;
  justify-content: center;
  color: var(--neutral-n2);
  background-color: var(--neutral-n7);
  border-radius: 6px;
`

export const Options = styled.div`
  height: 32px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  &:hover .label {
    color: var(--neutral-n1-d1);
  }
  &:hover ${BtnsArea} {
    display: flex;
  }
  &:hover ${CheckIcon} {
    display: none;
  }
`
export const IconWrap = styled(IconFont)<{ visible: boolean }>`
  display: ${props => (props.visible ? 'block' : 'none')};
  font-size: 14px;
  color: var(--neutral-n3);
  &:hover {
    color: var(--auxiliary-b1);
  }
`
export const CustomWrap = styled.div`
  .ant-dropdown-menu-item,
  .ant-dropdown-menu-submenu-title {
    padding: 0px 12px;
  }
  .ant-dropdown-menu-item-divider {
    margin: 4px 12px;
  }
  .ant-dropdown-menu {
    height: 300px;
    overflow: scroll;
  }
`

export const HasIconMenu = styled.div<{ isCheck?: boolean }>(
  {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    '.icon': {
      fontSize: 16,
    },
    '.checked': {
      fontSize: 16,
      color: 'var(--auxiliary-b1)',
    },
    '.left': {
      padding: 0,
      display: 'flex',
      alignItems: 'center',
    },
    '&: hover': {
      '.label': {
        // color: 'var(--neutral-n3)',
      },
      '.icon': {
        // color: 'var(--neutral-n3)',
      },
    },
  },
  ({ isCheck }) => ({
    '.label': {
      color: isCheck ? 'var(--auxiliary-b1)!important' : 'var(--neutral-n3)',
    },
    '.icon': {
      color: isCheck ? 'var(--auxiliary-b1)!important' : 'var(--neutral-n3)',
    },
  }),
)
