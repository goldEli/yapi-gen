import styled from '@emotion/styled'

const MenuItem = styled.div<{ isActive?: boolean }>`
  height: 44px;
  line-height: 44px;
  padding-left: 24px;
  cursor: pointer;
  background: ${props =>
    props.isActive ? 'var(--gradient-left)' : 'transparent'};
  color: var(--neutral-n1-d2);
  &:hover {
    color: var(--primary-d2);
  }
`

const MineSide = () => {
  const menuList = [
    { name: '我的概况', path: '' },
    { name: '我的待办', path: '' },
    { name: '我创建的', path: '' },
    { name: '我的已办', path: '' },
    { name: '抄送我的', path: '' },
    { name: '我的审核', path: '' },
  ]
  return (
    <div>
      {menuList.map((i: any) => (
        <MenuItem key={i.name}>{i.name}</MenuItem>
      ))}
    </div>
  )
}

export default MineSide
