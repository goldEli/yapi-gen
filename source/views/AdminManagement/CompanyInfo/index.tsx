// 设置-公司信息

import styled from '@emotion/styled'
import { OmitText } from '@star-yun/ui'
import { useTranslation } from 'react-i18next'
import useSetTitle from '@/hooks/useSetTitle'
import { Space } from 'antd'
import { useSelector } from '@store/index'
import PermissionWrap from '@/components/PermissionWrap'

const Header = styled.div({
  background: 'white',
  position: 'sticky',
  top: 0,
  zIndex: 1,
  padding: '24px 0',
  span: {
    fontSize: 16,
    fontWeight: 400,
    color: 'var(--neutral-n1-d1)',
    paddingLeft: 24,
    lineHeight: '24px',
  },
})

const Content = styled.div({
  background: 'var(--neutral-n6-d1)',
  height: 'calc(100% - 64px)',
})

const InfoWrap = styled.div({
  padding: '0 24px',
  background: 'white',
  height: '100%',
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
  color: 'var(--neutral-n2)',
  fontSize: 14,
  lineHeight: '24px',
  marginTop: 4,
})

const InfoBottom = styled.div({
  display: 'flex',
  flexDirection: 'column',
  marginTop: 40,
})

export const BottomTitle = styled.div({
  fontSize: 14,
  color: 'var(--neutral-n1-d1)',
  fontWeight: 400,
  paddingLeft: 11,
  borderLeft: '3px solid var(--primary-d1)',
  marginBottom: 16,
  lineHeight: '16px',
})

const CardWrap = styled.div({
  height: 80,
  width: 160,
  borderRadius: 6,
  background: 'var(--hover-d2)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  div: {
    color: 'var(--neutral-n1-d1)',
    fontSize: 28,
    fontFamily: 'SiYuanMedium',
    lineHeight: '28px',
  },
  span: {
    fontSize: 14,
    fontWeight: 400,
    color: 'var(--neutral-n3)',
  },
})

const CompanyInfo = () => {
  const asyncSetTtile = useSetTitle()
  const [t] = useTranslation()
  asyncSetTtile(t('title.c1'))
  const { value: companyInfo } = useSelector(store => store.companyInfo)
  const { menuPermission } = useSelector(store => store.user)

  return (
    <div style={{ height: '100%' }}>
      <PermissionWrap
        auth="/AdminManagement/CompanyInfo"
        permission={menuPermission?.menus
          ?.filter((k: any) => k.url === '/AdminManagement')?.[0]
          ?.children?.map((i: any) => i.url)}
      >
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
                  <div style={{ fontSize: 32, lineHeight: '44px' }}>
                    {companyInfo.projectCount}
                  </div>
                  <span>{t('setting.currentProject')}</span>
                </CardWrap>
                <CardWrap>
                  <div style={{ fontSize: 32, lineHeight: '44px' }}>
                    {companyInfo.userCount}
                  </div>
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
      </PermissionWrap>
    </div>
  )
}

export default CompanyInfo
