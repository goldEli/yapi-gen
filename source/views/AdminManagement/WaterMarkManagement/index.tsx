import PermissionWrap from '@/components/PermissionWrap'
import useSetTitle from '@/hooks/useSetTitle'
import { changeWater, getWater } from '@/services/setting'
import styled from '@emotion/styled'
import { useDispatch, useSelector } from '@store/index'
import { Radio } from 'antd'
import { useTranslation } from 'react-i18next'
import { changeWaterStatus } from '../../../../store/waterState'
import { BottomTitle } from '../CompanyInfo'

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

const WaterMarkManagement = () => {
  const asyncSetTtile = useSetTitle()
  const [t] = useTranslation()
  asyncSetTtile(t('title.c7'))

  const { value: valueId } = useSelector(store => store.water)
  const { userInfo } = useSelector(store => store.user)
  const dispatch = useDispatch()

  const onChange = async (e: any) => {
    const res = await getWater()
    const res2 = await changeWater({ id: res.id, status: e.target.value })

    if (res2.code === 0) {
      dispatch(changeWaterStatus(e.target.value))
    }
  }

  return (
    <PermissionWrap
      auth="b/company/config"
      permission={userInfo?.company_permissions}
    >
      <div style={{ height: '100%' }}>
        <Header>
          <span>{t('v2_1_1.configuration')}</span>
        </Header>
        <Content>
          <div
            style={{
              background: 'white',
              height: '100%',
              padding: '25px',
              borderRadius: 6,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <BottomTitle
                style={{
                  marginBottom: '0px',
                  marginRight: '16px',
                }}
              >
                {t('v2_1_1.safe')}
              </BottomTitle>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 400,
                  color: '#969799',
                }}
              >
                {t('v2_1_1.c1')}
              </span>
            </div>
            <div
              style={{
                marginTop: '17px',
              }}
            >
              <Radio.Group onChange={onChange} value={valueId}>
                <Radio value={1}>{t('v2_1_1.open')}</Radio>
                <Radio value={2}>{t('v2_1_1.close')}</Radio>
              </Radio.Group>
            </div>
          </div>
        </Content>
      </div>
    </PermissionWrap>
  )
}

export default WaterMarkManagement
