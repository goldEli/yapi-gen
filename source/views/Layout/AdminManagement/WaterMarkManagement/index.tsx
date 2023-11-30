import PermissionWrap from '@/components/PermissionWrap'
import useSetTitle from '@/hooks/useSetTitle'
import { changeWater, getWater } from '@/services/setting'
import styled from '@emotion/styled'
import { useDispatch, useSelector } from '@store/index'
import { changeWaterStatus } from '@store/waterState'
import { Radio, Switch } from 'antd'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const Content = styled.div`
  width: 616px;
  height: 100%;
  padding-top: 80px;
  margin: 0 auto;
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
    font-size: 18px;
    font-weight: 400;
    color: var(--neutral-n1-d1);
    margin-bottom: 4px;
    font-family: SiYuanMedium;
  }
  > div:nth-of-type(2) {
    font-size: 12px;
    font-weight: 400;
    color: var(--neutral-n3);
    margin-bottom: 24px;
  }
`
const RadioBgcWrap = styled.div`
  display: flex;
  gap: 48px;
`

const Col = styled.div<{ state: boolean }>`
  display: flex;
  width: 284px;
  border-radius: 8px;
  border: ${props =>
    props.state
      ? '1px solid var(--primary-d1)'
      : '1px solid var(--neutral-n6-d1)'};
  padding: 12px;
  flex-direction: column;
  cursor: pointer;
  img {
    width: 100%;
    margin-bottom: 12px;
  }
  &:hover {
    border: 1px solid var(--primary-d1);
  }
`
const WaterMarkManagement = () => {
  const asyncSetTtile = useSetTitle()
  const [t] = useTranslation()
  asyncSetTtile(t('title.c7'))

  const { value: checked } = useSelector(store => store.water)
  const { menuPermission } = useSelector(store => store.user)
  const [val, setVal] = useState(checked ? 1 : 2)
  const dispatch = useDispatch()

  const onChange = async (value: any) => {
    console.log(value, '=11')
    setVal(value)
    const res = await getWater()
    const res2 = await changeWater({ id: res.id, status: value })
    if (res2.code === 0) {
      dispatch(changeWaterStatus(value === 1))
    }
  }
  const cardChange = async (value: number) => {
    setVal(value)
    const res = await getWater()
    const res2 = await changeWater({ id: res.id, status: value })
    if (res2.code === 0) {
      dispatch(changeWaterStatus(value === 1))
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
        <Content>
          {configList.map(item => (
            <SwitchWrap key={item.title}>
              <Text>
                <div>{t(item.title as any)}</div>
                <div>{t(item.des as any)}</div>
              </Text>
            </SwitchWrap>
          ))}
          <RadioBgcWrap>
            <Col state={val === 2} onClick={() => onChange(2)}>
              <img src="/bgc/nor.png" />
              <Radio value={2} checked={val === 2}>
                {t('notHaveWater')}
              </Radio>
            </Col>
            <Col state={val === 1} onClick={() => onChange(1)}>
              <img src="/bgc/sel.png" />
              <Radio value={1} checked={val === 1}>
                {t('haveWater')}
              </Radio>
            </Col>
          </RadioBgcWrap>
        </Content>
      </div>
    </PermissionWrap>
  )
}

export default WaterMarkManagement
