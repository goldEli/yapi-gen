import styled from '@emotion/styled'

const TopWrap = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  margin: '16px 0',
})

const SurveyWrap = styled.div({
  height: 268,
  borderRadius: 6,
  background: 'white',
  display: 'flex',
  flexDirection: 'column',
  padding: 24,
  width: '49.6%',
})

const Title = styled.div({
  fontSize: 16,
  lineHeight: '20px',
  color: '#323233',
  fontWeight: 400,
  paddingLeft: 8,
  borderLeft: '3px solid #2877FF',
})

const BottomWrap = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
})

const DiagramWrap = styled.div({
  width: '60%',
  height: 430,
  borderRadius: 6,
  background: 'white',
  padding: 24,
})

const StatusWrap = styled.div({
  width: '39.2%',
  height: 430,
  borderRadius: 6,
  background: 'white',
  padding: 24,
})

export default () => {
  return (
    <div>
      <TopWrap>
        <SurveyWrap>
          <Title>概况</Title>
        </SurveyWrap>
        <SurveyWrap>
          <Title>迭代目标</Title>
        </SurveyWrap>
      </TopWrap>
      <BottomWrap>
        <DiagramWrap>
          <Title>燃尽图</Title>
        </DiagramWrap>
        <StatusWrap>
          <Title>状态分布</Title>
        </StatusWrap>
      </BottomWrap>
    </div>
  )
}
