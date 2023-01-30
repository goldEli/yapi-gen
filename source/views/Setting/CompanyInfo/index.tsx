// 设置-公司信息

import styled from '@emotion/styled'
import { OmitText } from '@star-yun/ui'
import { useTranslation } from 'react-i18next'
import useSetTitle from '@/hooks/useSetTitle'
import { Space } from 'antd'
import { useSelector } from '@store/index'

const Header = styled.div({
  height: 64,
  background: 'white',
  lineHeight: '64px',
  position: 'sticky',
  top: 0,
  zIndex: 1,
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
  flexDirection: 'column',
})

const TextWrap = styled.div({
  display: 'flex',
  flexDirection: 'column',
})

const Title = styled.div({
  fontSize: 16,
  color: 'black',
  fontWeight: 400,
  display: 'flex',
  alignItems: 'center',
  width: 'fit-content',
  lineHeight: '16px',
})

const Subtext = styled.div({
  color: '#646566',
  fontSize: 14,
  lineHeight: '24px',
  marginTop: 8,
})

const InfoBottom = styled.div({
  display: 'flex',
  flexDirection: 'column',
  marginTop: 40,
})

export const BottomTitle = styled.div({
  fontSize: 14,
  color: 'black',
  fontWeight: 400,
  paddingLeft: 8,
  borderLeft: '3px solid #2877ff',
  marginBottom: 16,
  lineHeight: '16px',
})

const CardWrap = styled.div({
  height: 80,
  width: 160,
  borderRadius: 6,
  background: '#F9FAFA',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  div: {
    color: '#323233',
    fontSize: 28,
    fontWeight: 500,
    lineHeight: '28px',
  },
  span: {
    fontSize: 14,
    fontWeight: 400,
    color: '#969799',
  },
})

const CompanyInfo = () => {
  const asyncSetTtile = useSetTitle()
  const [t] = useTranslation()
  asyncSetTtile(t('title.c1'))
  const { value: companyInfo } = useSelector(store => store.companyInfo)
  return (
    <div style={{ height: '100%' }}>
      <Header>
        <span>{t('setting.companyInfo')}</span>
      </Header>
      <Content>
        <InfoWrap>
          <InfoTop>
            <BottomTitle>{t('setting.enterpriseData')}</BottomTitle>
            <Space
              size={32}
              style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'nowrap',
              }}
            >
              <CardWrap>
                <div>{companyInfo.projectCount}</div>
                <span>{t('setting.currentProject')}</span>
              </CardWrap>
              <CardWrap>
                <div>{companyInfo.userCount}</div>
                <span>{t('setting.companyStaff')}</span>
              </CardWrap>
            </Space>
          </InfoTop>
          <InfoBottom>
            <BottomTitle>{t('setting.companyInfo')}</BottomTitle>
            <TextWrap>
              <Title>
                <OmitText
                  width={400}
                  tipProps={{
                    getPopupContainer: node => node,
                  }}
                >
                  {companyInfo.name}
                </OmitText>
              </Title>
              <Subtext>{companyInfo.info}</Subtext>
            </TextWrap>
          </InfoBottom>
        </InfoWrap>
      </Content>
    </div>
  )
}

export default CompanyInfo
