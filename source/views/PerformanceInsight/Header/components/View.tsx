/* eslint-disable no-useless-concat */
import CommonIconFont from '@/components/CommonIconFont'
import { MenuProps, Dropdown, Space } from 'antd'
import { useEffect, useState } from 'react'
import ViewDialog from './ViewDialog'
import DeleteConfirm from '@/components/DeleteConfirm'
import { DivStyle, DefaultLabel, DefaultLabelAdd, Btn, Label } from '../Style'
interface Item {
  label?: string
  key: string
  name?: string
}
interface ValueType {
  title: string
  value: string
}

const View = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [items, setItems] = useState<MenuProps['items']>([])
  const [value, setValue] = useState<ValueType>({
    title: '系统视图',
    value: 'all',
  })
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const [delIsVisible, setDelIsVisible] = useState<boolean>(false)
  const [dialogTitle, setDialogTitle] = useState<string>('')
  const [dialogItem, setDialogItem] = useState<{ name: string; id?: number }>({
    name: '',
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
    return (
      <Label>
        <span>{el.name}</span>
        <span>
          <Space size={12}>
            <CommonIconFont
              onClick={() => {
                setDialogItem(el),
                  setDialogTitle('编辑视图'),
                  setIsVisible(true)
              }}
              type={'edit'}
              size={16}
              color="var(--neutral-n3)"
            />
            <CommonIconFont
              onClick={() => {
                setDialogItem(el), setDelIsVisible(true)
              }}
              type={'delete'}
              size={16}
              color="var(--neutral-n3)"
            />
          </Space>
        </span>
      </Label>
    )
  }
  const getHtml = () => {
    return a.map((el: any) => ({ label: getLabel(el), key: el.key }))
  }
  useEffect(() => {
    setItems([
      {
        label: (
          <DefaultLabel>
            <span>系统视图</span>
            <Btn>默认</Btn>
          </DefaultLabel>
        ),
        key: 'first',
      },
      {
        type: 'divider',
      },
      ...getHtml(),
      {
        type: 'divider',
      },
      {
        label: (
          <DefaultLabelAdd>
            <span>新建视图</span>
          </DefaultLabelAdd>
        ),
        key: 'last',
      },
    ])
  }, [])
  const onOpenChange: MenuProps['onClick'] = (e: { key: string }) => {
    if (e.key === 'first') {
      setValue({
        title: '系统视图',
        value: 'all',
      })
    } else if (e.key === 'last') {
      setIsOpen(false)
      setDialogItem({ name: '' })
      setDialogTitle('新建视图')
      setIsVisible(true)
    } else {
      let item: Item = a.find((el: { key: string }) => el.key === e.key) || {
        key: '',
        label: '',
      }
      setValue({
        title: '视图' + '' + item.name,
        value: item.key,
      })
      setIsOpen(false)
    }
  }
  return (
    <>
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
      {/* 新建和编辑视图 */}
      <ViewDialog
        name={dialogItem.name}
        title={dialogTitle}
        onConfirm={() => {
          setDialogItem({ name: '' }), console.log(123)
        }}
        onClose={() => setIsVisible(false)}
        isVisible={isVisible}
      />
      <DeleteConfirm
        title={'删除确认'}
        text={'确认删除该视图?'}
        isVisible={delIsVisible}
        onConfirm={() => {
          setDelIsVisible(false)
        }}
        onChangeVisible={() => setDelIsVisible(false)}
      />
    </>
  )
}
export default View
