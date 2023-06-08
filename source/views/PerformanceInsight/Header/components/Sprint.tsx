/* eslint-disable no-useless-concat */
import { Dropdown, MenuProps } from 'antd'
import { useEffect, useState } from 'react'
import { DivStyle, Label, TitleText } from '../Style'
import CommonIconFont from '@/components/CommonIconFont'
import { setSave } from '@store/performanceInsight'
import { useDispatch } from '@store/index'
interface ValueType {
  title: string
  value: number
}
interface Props {
  data: Array<{ id: number; name: string; key: number }> | []
  value: number
  onChange(val: number): void
  homeType: string
}
const Sprint = (props: Props) => {
  const dispatch = useDispatch()
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [items, setItems] = useState<MenuProps['items']>([])
  const [value, setValue] = useState<ValueType>({
    title: props.homeType === 'iteration' ? '全部工作项' : '全部冲刺',
    value: 0,
  })

  const getLabel = (el: { name: string; id: number }) => {
    return (
      <Label key={el.id}>
        <span className="labelName">{el.name}</span>
      </Label>
    )
  }
  const getHtml = () => {
    return props.data.map((el: any) => ({ label: getLabel(el), key: el.id }))
  }
  useEffect(() => {
    setItems([
      {
        label: <TitleText>近期</TitleText>,
        disabled: true,
        key: 'first',
      },
      ...getHtml(),
      {
        label: (
          <Label>
            {props.homeType === 'iteration' ? '全部工作项' : '全部冲刺'}
          </Label>
        ),
        key: 'all',
      },
    ])
  }, [])
  useEffect(() => {
    if (props.value) {
      props.onChange(props.value)
      setValue({
        title: props.data.find(el => el.id === props.value)?.name || '',
        value: props.data.find(el => el.id === props.value)?.id || 0,
      })
    } else {
      props.onChange(0)
      setValue({
        title: props.homeType === 'iteration' ? '全部工作项' : '全部冲刺',
        value: 0,
      })
    }
  }, [props.value])

  const onOpenChange: MenuProps['onClick'] = (e: any) => {
    console.log(e, 'eeeeeeeee')

    if (e.key === 'all') {
      setValue({
        title: props.homeType === 'iteration' ? '全部工作项' : '全部冲刺',
        value: 0,
      })
      props.onChange(0)
    } else {
      setValue({
        title: props.data.find(el => el.id === Number(e.key))?.name || '',
        value: props.data.find(el => el.id === Number(e.key))?.id || 0,
      })
      props.onChange(props.data.find(el => el.id === Number(e.key))?.id || 0)
    }
    dispatch(setSave(true))
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
