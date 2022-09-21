/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable new-cap */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-len */
import IconFont from '@/components/IconFont'
import { useModel } from '@/models'
import { getParamsData } from '@/tools'
import { encryptPhp } from '@/tools/cryptoPhp'
import styled from '@emotion/styled'
import { AsyncButton as Button } from '@staryuntech/ant-pro'
import { Divider, Space } from 'antd'
import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CategoryWrap, StepBoxWrap } from '@/components/StyleCommon'
import StepPageOne from './components/StepPageOne'
import StepPageTwo from './components/StepPageTwo'

const Wrap = styled.div({
  padding: 16,
  height: '100%',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
})

const SetTitleWrap = styled.div({
  marginBottom: 16,
  display: 'flex',
  alignItems: 'center',
  fontSize: 12,
})

const BackWrap = styled.div({
  display: 'flex',
  alignItems: 'center',
  color: '#2877ff',
  fontWeight: 400,
  cursor: 'pointer',
})

const ContentWrap = styled.div({
  borderRadius: 6,
  background: 'white',
  width: '100%',
  height: 'calc(100% - 35px)',
  padding: 24,
  overflow: 'auto',
  position: 'relative',
})

const LabelWrap = styled.div({
  display: 'flex',
  alignItems: 'center',
  marginBottom: 24,
  span: {
    marginLeft: 8,
    fontWeight: 500,
    fontSize: 14,
    color: '#323233',
  },
  '.provider': {
    height: 16,
    width: 3,
    background: '#2877ff',
  },
})

const StepWrap = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '24px 0',
})

const SetBreadcrumb = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { projectInfo } = useModel('project')
  const paramsData = getParamsData(searchParams)
  const activeTabs = Number(paramsData.type) || 0

  const onBack = () => {
    navigate(-1)
  }

  const onToSet = () => {
    const params = encryptPhp(
      JSON.stringify({
        type: activeTabs,
        id: projectInfo.id,
        pageIdx: 'main',
      }),
    )
    navigate(`/Detail/Set?data=${params}`)
  }
  return (
    <SetTitleWrap>
      <BackWrap onClick={onBack}>
        <IconFont type="return" style={{ fontSize: 16, marginRight: 6 }} />
        <span>返回</span>
      </BackWrap>
      <Divider type="vertical" style={{ background: '#BBBDBF' }} />
      <div style={{ color: '#323233', cursor: 'pointer' }} onClick={onToSet}>
        需求设置
      </div>
      <IconFont type="right" style={{ color: '#323233', margin: '0 4px' }} />
      <div style={{ color: '#969799' }}>工作流设置</div>
    </SetTitleWrap>
  )
}

const Workflow = () => {
  const { colorList } = useModel('project')
  const [step, setStep] = useState(1)
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const { categoryItem } = paramsData

  const onSaveNext = () => {
    setStep(2)

    // 保存第一步数据
  }

  return (
    <Wrap>
      <SetBreadcrumb />
      <ContentWrap>
        <LabelWrap>
          <div className="provider" />
          <span>工作流设置</span>
          <CategoryWrap
            color={categoryItem.color}
            bgColor={
              colorList?.filter(i => i.key === categoryItem.color)[0]?.bgColor
            }
          >
            {categoryItem.name}
          </CategoryWrap>
        </LabelWrap>
        <StepWrap>
          <StepBoxWrap active={step === 1}>
            <div className="circle">1</div>
            <span>状态定义</span>
          </StepBoxWrap>
          <div
            style={{
              width: 160,
              height: 1,
              background: '#EBEDF0',
              margin: '0 8px',
            }}
          />
          <StepBoxWrap active={step === 2}>
            <div className="circle">2</div>
            <span>流转设置</span>
          </StepBoxWrap>
        </StepWrap>
        {step === 1 ? <StepPageOne /> : <StepPageTwo />}
        <Space size={16} style={{ position: 'absolute', bottom: 24, left: 24 }}>
          <Button type="primary" onClick={onSaveNext}>
            {step === 1 ? '保存&下一步' : '保存'}
          </Button>
          <Button>取消</Button>
        </Space>
      </ContentWrap>
    </Wrap>
  )
}

export default Workflow
