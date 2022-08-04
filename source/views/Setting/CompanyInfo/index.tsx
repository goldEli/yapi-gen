import styled from '@emotion/styled'
import { OmitText } from '@star-yun/ui'
import { useModel } from '@/models'
import { useTranslation } from 'react-i18next'

const Header = styled.div({
  height: 64,
  background: 'white',
  lineHeight: '64px',
  position: 'sticky',
  top: 0,
  zIndex: 2,
  span: {
    fontSize: 16,
    fontWeight: 400,
    color: 'black',
    paddingLeft: 24,
  },
})

const Content = styled.div({
  padding: 16,
  background: '#F5F7FA',
  height: 'calc(100% - 64px)',
})

const InfoWrap = styled.div({
  padding: 24,
  background: 'white',
  height: '100%',
  borderRadius: 6,
})

const InfoTop = styled.div({
  display: 'flex',
  justifyContent: 'flex-start',
})

const CompanyImg = styled.img({
  height: 186,
  width: 396,
  borderRadius: 6,
  marginRight: 24,
})

const TextWrap = styled.div({
  display: 'flex',
  flexDirection: 'column',
})

const Title = styled.div({
  fontSize: 16,
  color: 'black',
  fontWeight: 400,
})

const Subtext = styled.div({
  color: '#646566',
  fontSize: 14,
  lineHeight: '30px',
  marginTop: 10,
})

const InfoBottom = styled.div({
  display: 'flex',
  flexDirection: 'column',
  marginTop: 40,
})

const BottomTitle = styled.div({
  fontSize: 14,
  color: 'black',
  fontWeight: 400,
  paddingLeft: 8,
  borderLeft: '3px solid #2877ff',
  marginBottom: 16,
})

const CardWrap = styled.div({
  height: 72,
  width: 160,
  borderRadius: 6,
  background: 'rgba(235, 237, 240, 0.6)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: 24,
  div: {
    color: '#2877FF',
    fontSize: 32,
    fontWeight: 400,
    lineHeight: '32px',
  },
  span: {
    fontSize: 14,
    fontWeight: 400,
    color: '#323233',
  },
})

const CompanyInfo = () => {
  const [t] = useTranslation()
  const { companyInfo } = useModel('setting')
  return (
    <div style={{ height: '100%' }}>
      <Header>
        <span>公司信息</span>
      </Header>
      <Content>
        <InfoWrap>
          <InfoTop>
            <CompanyImg src={companyInfo.logo} />
            <TextWrap>
              <Title>
                <OmitText width={400}>{companyInfo.name}</OmitText>
              </Title>
              <Subtext>{companyInfo.info}</Subtext>
            </TextWrap>
          </InfoTop>
          <InfoBottom>
            <BottomTitle>企业数据</BottomTitle>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'nowrap',
              }}
            >
              <CardWrap>
                <div>{companyInfo.projectCount}</div>
                <span>当前项目</span>
              </CardWrap>
              <CardWrap>
                <div>{companyInfo.userCount}</div>
                <span>公司员工</span>
              </CardWrap>
            </div>
          </InfoBottom>
        </InfoWrap>
      </Content>
    </div>
  )
}

export default CompanyInfo
