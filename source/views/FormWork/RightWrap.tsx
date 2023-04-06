/* eslint-disable @typescript-eslint/naming-convention */
import CommonButton from '@/components/CommonButton'
import styled from '@emotion/styled'
import { Input } from 'antd'
import { useState } from 'react'
import PermissionConfig from './PermissionConfig'
import EditWork from './EditWork'
const RightFormWorkStyle = styled.div`
  flex: 1;
  overflow: hidden;
  overflow-y: auto;
  border-left: 1px solid var(--neutral-n6-d1);
  padding-right: 24px;
`
const Title = styled.div`
  padding: 24px;
  color: var(--neutral-n1-d1);
  font-size: 16px;
  font-family: SiYuanMedium;
`
const HeaderOperate = styled.div`
  padding-left: 24px;
  height: 32px;
  display: flex;
  justify-content: space-between;
`
const RowStyle = styled.div`
  position: relative;
  display: flex;
`
const Col2 = styled.div`
  max-width: 200px;
  height: 32px;
  display: flex;
  position: absolute;
  right: -177px;
  &:hover {
    cursor: pointer;
  }
`
const Col = styled.div`
  max-width: 200px;
  height: 32px;
  display: flex;
  &:hover {
    cursor: pointer;
  }
`
const Text = styled.div<{ bgc: any }>(
  {
    padding: '0 24px 0 0',
    minWidth: '136px',
    height: '32px',
    lineHeight: '32px',
    textAlign: 'center',
    fontSize: '14px',
    fontFamily: 'SiYuanMedium',
  },
  ({ bgc }) => ({
    backgroundColor: bgc ? 'var(--function-tag5)' : 'var(--neutral-n8)',
    color: bgc ? 'var(--primary-d1)' : 'var(--neutral-n2)',
  }),
)
const StyleRight = styled.div<{ bgc?: any }>(
  {
    width: 0,
    height: 0,
    border: '16px solid transparent',
    lineHeight: 0,
    fontSize: 0,
  },
  ({ bgc }) => ({
    borderColor: bgc
      ? ' transparent transparent  transparent  var(--function-tag5)'
      : ' transparent transparent  transparent  var(--neutral-n8) ',
  }),
)
const StyleLeft = styled.div<{ bgc?: any }>(
  {
    width: 0,
    height: 0,
    border: '16px solid transparent',
    lineHeight: 0,
    fontSize: 0,
  },
  ({ bgc }) => ({
    borderColor: bgc
      ? 'var(--function-tag5)  var(--function-tag5)  var(--function-tag5)  transparent'
      : 'var(--neutral-n8)  var(--neutral-n8)  var(--neutral-n8)  transparent',
  }),
)
const BtnRight = styled.div`
  display: flex;
`
const EditFormWorkBox = styled.div`
  margin: 20px 0 20px 24px;
  border-bottom: 1px solid var(--neutral-n6-d1);
`
const EditFormWorkStyle = styled(Input)({
  border: 'none',
  marginBottom: '14px',
  '&::placeholder': {
    fontSize: '18px',
    color: 'var(--neutral-n4)',
  },
})

const RightFormWork = () => {
  const [isActive, setIsActive] = useState(0)
  return (
    <RightFormWorkStyle>
      <Title>工作日报</Title>
      <HeaderOperate>
        <RowStyle>
          <Col onClick={() => setIsActive(0)}>
            <StyleLeft bgc={isActive === 0} />
            <Text bgc={isActive === 0}>编辑模板</Text>
            <StyleRight bgc={isActive === 0} />
          </Col>
          <Col2 onClick={() => setIsActive(1)}>
            <StyleLeft bgc={isActive === 1} />
            <Text bgc={isActive === 1}>权限配置</Text>
            <StyleRight bgc={isActive === 1} />
          </Col2>
        </RowStyle>
        <BtnRight>
          <CommonButton type="light" onClick={() => 133}>
            预览
          </CommonButton>
          <CommonButton
            type="light"
            onClick={() => 133}
            style={{ margin: '0 0px 0 16px' }}
          >
            删除
          </CommonButton>
        </BtnRight>
      </HeaderOperate>
      {/* 编辑 */}
      <EditFormWorkBox>
        <EditFormWorkStyle placeholder="请输入模板标题"></EditFormWorkStyle>
      </EditFormWorkBox>
      {/* 编辑模板 */}
      {isActive === 0 ? <EditWork /> : <PermissionConfig />}
    </RightFormWorkStyle>
  )
}
export default RightFormWork
