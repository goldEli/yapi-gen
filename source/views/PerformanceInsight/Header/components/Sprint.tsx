/* eslint-disable no-useless-concat */
import { Dropdown, MenuProps } from 'antd'
import { useEffect, useState } from 'react'
import { DivStyle, Label, TitleText } from '../Style'
import CommonIconFont from '@/components/CommonIconFont'
interface ValueType {
  title: string
  value: string
}

const Sprint = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [items, setItems] = useState<MenuProps['items']>([])
  const [value, setValue] = useState<ValueType>({
    title: '全部冲刺',
    value: 'all',
  })

  const a = [
    {
      name: '1',
      key: '1',
    },
    {
      name: '2',
      key: '2',
    },
  ]
  const getLabel = (el: { name: string; id: number }) => {
    return <Label onClick={() => 123}>{el.name}</Label>
  }
  const getHtml = () => {
    return a.map((el: any) => ({ label: getLabel(el), key: el.key }))
  }
  useEffect(() => {
    setItems([
      {
        label: <TitleText>近期</TitleText>,
        key: 'first',
      },
      ...getHtml(),
      {
        label: <Label>全部冲刺</Label>,
        key: 'all',
      },
    ])
  }, [])
  const onOpenChange: MenuProps['onClick'] = e => {
    if (e.key === 'all') {
      setValue({
        title: '全部冲刺',
        value: 'all',
      })
    }
  }
  return (
    <Dropdown
      placement="bottomLeft"
      visible={isOpen}
      onVisibleChange={setIsOpen}
      trigger={['click']}
      menu={{ items, onClick: onOpenChange }}
      overlayStyle={{
        width: 120,
        background: 'var(--neutral-white-d1)',
      }}
    >
      <DivStyle onClick={() => setIsOpen(!isOpen)}>
        <div>{value.title}</div>
        <CommonIconFont
          type={isOpen ? 'up' : 'down'}
          size={14}
          color="var(--neutral-n4)"
        />
      </DivStyle>
    </Dropdown>
  )
}
export default Sprint
