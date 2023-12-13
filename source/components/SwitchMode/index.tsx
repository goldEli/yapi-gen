import styled from '@emotion/styled'
import CommonIconFont from '../CommonIconFont'
import { Divider } from 'antd'
import ScreenMinHover from '../ScreenMinHover'

const SwitchModeWrap = styled.div`
  display: flex;
  align-items: center;
`

const ItemsWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
`

const ItemWrap = styled.div<{ isActive?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 3px 8px;
  border-radius: 4px;
  div {
    font-size: 14px;
    color: ${props =>
      props.isActive ? 'var(--primary-d1)!important' : 'var(--neutral-n3)'};
  }
  svg {
    color: ${props =>
      props.isActive ? 'var(--primary-d1)!important' : 'var(--neutral-n3)'};
    font-size: 18px;
  }
  &:hover {
    background: var(--hover-d1);
    svg {
      color: var(--neutral-n1-d1);
    }
    div {
      color: var(--neutral-n1-d1);
    }
  }
`

const DividerWrap = styled(Divider)`
  height: 16px;
  width: 1px;
  background: var(--neutral-n6-d1);
`

interface SwitchModeProps {
  // 模式数组
  menuList: any
  // 是否在小屏要换成图标模式
  isScreenMin?: boolean
  //   当前选中那种模式
  isActiveId?: number
  //   切换预览模式
  onClickMenuFormat(type: number): void
}

const SwitchMode = (props: SwitchModeProps) => {
  return (
    <SwitchModeWrap>
      {props?.menuList?.map((i: any) => (
        <ItemsWrap key={i.key}>
          {i.key === 'provider' && <DividerWrap type="vertical" />}
          {i.key !== 'provider' && (
            <>
              {props.isScreenMin && (
                <ScreenMinHover
                  icon={i.key}
                  style={{ marginLeft: 0 }}
                  label={i.label}
                  onClick={() => props.onClickMenuFormat(i.id)}
                />
              )}
              {!props.isScreenMin && (
                <ItemWrap
                  isActive={i.id === props?.isActiveId}
                  onClick={() => props.onClickMenuFormat(i.id)}
                >
                  <CommonIconFont type={i.key} />
                  <div>{i.label}</div>
                </ItemWrap>
              )}
            </>
          )}
        </ItemsWrap>
      ))}
    </SwitchModeWrap>
  )
}

export default SwitchMode
