import PermissionWrap from '@/components/PermissionWrap'
import useSetTitle from '@/hooks/useSetTitle'
import { changeWater, getWater } from '@/services/setting'
import styled from '@emotion/styled'
import { useDispatch, useSelector } from '@store/index'
import { changeWaterStatus } from '@store/waterState'
import { Switch } from 'antd'
import { useTranslation } from 'react-i18next'

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
    color: 'var(--neutral-n1-d1)',
    paddingLeft: 24,
  },
})

const Content = styled.div`
  padding: 0 24px;
`

const SwitchWrap = styled.div`
  display: flex;
  align-items: center;
  width: 600px;
  justify-content: space-between;
`

const Text = styled.div`
  height: 46px;
  margin-bottom: 24px;
  > div:nth-of-type(1) {
    font-size: 14px;
    font-weight: 400;
    color: var(--neutral-n1-d1);
    margin-bottom: 4px;
  }
  > div:nth-of-type(2) {
    font-size: 12px;
    font-weight: 400;
    color: var(--neutral-n3);
  }
`

const WaterMarkManagement = () => {
  const asyncSetTtile = useSetTitle()
  const [t] = useTranslation()
  asyncSetTtile(t('title.c7'))

  const { value: checked } = useSelector(store => store.water)
  const { menuPermission } = useSelector(store => store.user)
  const dispatch = useDispatch()

  const onChange = async (value: boolean) => {
    const res = await getWater()
    const res2 = await changeWater({ id: res.id, status: value ? 1 : 2 })

    if (res2.code === 0) {
      dispatch(changeWaterStatus(value))
    }
  }
  const configList = [
    {
      title: 'v2_1_1.safe',
      des: 'v2_1_1.c1',
      key: 'watermark',
    },
  ]

  return (
    <PermissionWrap
      auth="/AdminManagement/WaterMarkManagement"
      permission={menuPermission?.menus
        ?.filter((k: any) => k.url === '/AdminManagement')?.[0]
        ?.children?.map((i: any) => i.url)}
    >
      <div
        style={{
          height: '100%',
          backgroundColor: 'var(--neutral-white-d1)',
        }}
      >
        <Header>
          <span>{t('secure_watermark')}</span>
        </Header>

        <Content>
          {configList.map(item => (
            <SwitchWrap key={item.title}>
              <Text>
                <div>{t(item.title as any)}</div>
                <div>{t(item.des as any)}</div>
              </Text>
              <Switch onChange={onChange} checked={checked} />
            </SwitchWrap>
          ))}
        </Content>
      </div>
    </PermissionWrap>
  )
}

export default WaterMarkManagement
