import styled from '@emotion/styled'
import { Form, Switch } from 'antd'
export const Wrap = styled.div`
  height: 100%;
  width: 100%;
  padding: 20px 16px 0 16px;
`
export const HeaderWrap = styled.div`
  display: flex;
  align-items: center;
  margin-top: 12px;
  padding: 0 8px;
  justify-content: space-between;
`
export const OperateWrap = styled.div`
  display: flex;
  align-items: center;
  button {
    margin-left: 16px;
  }
`

export const TableWrap = styled.div`
  min-height: 200px;
  padding: 0 8px;
`

export const OperateLabelText = styled.span<{ color: string }>`
  color: ${props => props.color};
  font-size: var(--font14);
  margin-left: 12px;
  cursor: pointer;
`
export const FormWrap = styled(Form)`
  padding: 0px 24px;
  .ant-form-item-label {
    font-size: var(--font14);
    font-family: SiYuanMedium;
  }
  .ant-input-number {
    width: 100%;
  }
`

export const SwitchWrap = styled(Switch)``
