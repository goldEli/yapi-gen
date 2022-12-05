import { getWater } from '@/services/setting'
import styled from '@emotion/styled'
import { Radio } from 'antd'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from '../../../../store'
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

const Index = () => {
  const [t] = useTranslation()
  const { value: valueId } = useSelector(store => store.water)
  const dispatch = useDispatch()

  const onChange = async (e: any) => {
    const res = await getWater()

    dispatch(changeWaterStatus({ id: res.id, status: e.target.value }))
  }

  return (
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
              水印组成【企业名称】+【姓名】+【手机】
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
  )
}

export default Index
