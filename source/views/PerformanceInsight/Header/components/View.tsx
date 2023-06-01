/* eslint-disable no-useless-concat */
import CommonIconFont from '@/components/CommonIconFont'
import { MenuProps, Dropdown, Space } from 'antd'
import { useEffect, useState } from 'react'
import ViewDialog from './ViewDialog'
import DeleteConfirm from '@/components/DeleteConfirm'
import { DivStyle, DefaultLabel, DefaultLabelAdd, Btn, Label } from '../Style'
import { useDispatch, useSelector } from '@store/index'
import { setHeaderParmas } from '@store/performanceInsight'
interface Item {
  type: number
  label?: string
  key: string
  name: string
}
interface ValueType {
  title: string
  value: string
  type: string
}
interface View {
  viewDataList: Array<Models.Efficiency.ViewItem> | undefined
  onCreateView: (value: string, type: string, key?: string) => void
  onDelView: (key: string) => void
  onSetDefaulut: (id: number) => void
  onChange: (id: number) => void
}
const View = (props: View) => {
  const dispatch = useDispatch()
  const { headerParmas } = useSelector(store => store.performanceInsight)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [items, setItems] = useState<MenuProps['items']>([])
  const [value, setValue] = useState<Models.Efficiency.ViewItem>()
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const [delIsVisible, setDelIsVisible] = useState<boolean>(false)
  const [dialogTitle, setDialogTitle] = useState<{
    title: string
    type: string
  }>()
  const [dialogItem, setDialogItem] = useState<{ name: string; id?: number }>({
    name: '',
  })
  // 剔除来的默认视图
  const [optionsDefault, setOptionsDefault] =
    useState<Models.Efficiency.ViewItem>()
  const [options, setOptions] = useState<Array<Models.Efficiency.ViewItem>>()
  // 用于后面接口判断使用
  const [key, setKey] = useState('first')
  useEffect(() => {
    props.viewDataList &&
      setOptionsDefault(props.viewDataList.find(el => el.is_default === 1))
    props.viewDataList &&
      setOptions(props.viewDataList.filter(el => el.is_default !== 1) || [])
  }, [props.viewDataList])
  useEffect(() => {
    setItems([
      {
        label: (
          <DefaultLabel>
            <span>{optionsDefault?.name}</span>
            <Btn>默认</Btn>
          </DefaultLabel>
        ),
        key: 'first',
      },
      {
        type: 'divider',
      },
      ...(getHtml() || []),
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
    props.viewDataList &&
      setValue(props.viewDataList.find(el => el.is_default === 1))
    props.viewDataList && props.onChange(optionsDefault?.id || 0)
  }, [options])
  const getLabel = (el: { name: string; id: number }) => {
    return (
      <Label key={el.id}>
        <span className="labelName">{el.name}</span>
        <span>
          <Space size={12}>
            <CommonIconFont
              onClick={() => {
                props.onSetDefaulut(el.id)
              }}
              type={'tag-96pg0hf3'}
              size={16}
              color="var(--neutral-n3)"
            />
            <CommonIconFont
              onClick={() => {
                setDialogItem(el),
                  setDialogTitle({
                    title: '编辑视图',
                    type: 'edit',
                  }),
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
    return options?.map((el: any) => ({
      label: getLabel(el),
      key: el.key,
    }))
  }
  const onOpenChange: MenuProps['onClick'] = (e: { key: string }) => {
    setKey(e.key)
    if (e.key === 'first') {
      return
    } else if (e.key === 'last') {
      setIsOpen(false)
      setDialogItem({ name: '' })
      setDialogTitle({
        title: '新建视图',
        type: 'add',
      })
      setIsVisible(true)
    } else {
      let item: Models.Efficiency.ViewItem = options?.find(
        (el: { key: string }) => el.key === e.key,
      ) || {
        label: '',
        key: '',
        type: 0,
        name: '',
        status: 0,
        id: 0,
        config: {},
      }
      props.onChange(item.id)
      setValue({
        ...item,
        name: item.type === 2 ? '视图' + '' + item.name : item.name,
      })
      dispatch(
        setHeaderParmas({
          users: headerParmas.users,
          projectIds: headerParmas.projectIds,
          time: headerParmas.time,
          view: {
            title: '视图' + '' + item.name,
            value: item.key,
          },
        }),
      )
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
          <div className="name">{value?.name}</div>
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
        titleType={dialogTitle}
        onConfirm={(value, type) => {
          setDialogItem({ name: '' }),
            props.onCreateView(value, type, key),
            setIsVisible(false)
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
          props.onDelView(key)
        }}
        onChangeVisible={() => setDelIsVisible(false)}
      />
    </>
  )
}
export default View
