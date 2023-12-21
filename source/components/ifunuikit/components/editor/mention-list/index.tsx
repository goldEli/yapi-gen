/* eslint-disable prefer-regex-literals */
/* eslint-disable require-unicode-regexp */
/* eslint-disable react/jsx-no-leaked-render */
import { Input } from 'antd'
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
  useRef,
  type ForwardRefRenderFunction,
} from 'react'
import { Wrap, Item, Loading, Empty } from './style'

type Props = {
  loading?: boolean
  options: {
    id: string
    label: string
  }[]
  onSelect?(item: { id: string; label: string }): void
}

type Ref = {
  onKeyDown(event: { event: KeyboardEvent }): boolean
}

// eslint-disable-next-line @typescript-eslint/naming-convention
const MentionList: ForwardRefRenderFunction<Ref, Props> = (props, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [searchValue, setSearchValue] = useState('')
  const inputRef = useRef<any>(null)

  const selectItem = (index: number) => {
    const item = props.options?.[index]

    if (item) {
      props.onSelect?.(item)
    }
  }

  const onUp = () =>
    setSelectedIndex(
      (selectedIndex + props.options!.length - 1) % props.options!.length,
    )
  const onDown = () =>
    setSelectedIndex((selectedIndex + 1) % props.options!.length)
  const onEnter = () => selectItem(selectedIndex)

  useEffect(() => setSelectedIndex(0), [props.options])

  useEffect(() => {
    inputRef?.current?.focus?.()
  }, [])

  useImperativeHandle(ref, () => ({
    onKeyDown({ event }) {
      if (!props.options) {
        return false
      }

      switch (event.key) {
        case 'ArrowUp':
          onUp()
          return true
        case 'ArrowDown':
          onDown()
          return true
        case 'Enter':
          onEnter()
          return true
        default:
          return false
      }
    },
  }))
  const onSearch = (value: any) => {
    setSearchValue(value.target.value)
  }

  const newArr = useMemo(() => {
    if (searchValue) {
      const reg = new RegExp('[\\u4E00-\\u9FFF]+', 'g')
      const arr = props?.options.filter(
        (i: any) =>
          reg.test(i.label)
            ? i.label.includes(searchValue)
            : i.label.toLowerCase().includes(searchValue.toLowerCase()),
        // String(i.label).lo.includes(searchValue),
      )
      return arr
    }

    return props?.options
  }, [searchValue, props.options])

  return (
    <div
      style={{
        padding: '10px',
        backgroundColor: 'white',
        boxShadow: ' 0px 0px 7px 2px rgba(0, 0, 0, 0.04)',
      }}
    >
      <Input
        ref={inputRef}
        onChange={onSearch}
        placeholder="请搜索"
        style={{ width: 200 }}
      />

      <Wrap>
        {newArr?.length === 0 ? (
          <Empty hidden={props.loading}>没有数据</Empty>
        ) : (
          newArr?.map((i, index) => (
            <Item key={i.id} onClick={() => props.onSelect?.(i)}>
              {i.label}
            </Item>
          ))
        )}
        {props.loading && <Loading />}
      </Wrap>
    </div>
  )
}

export default forwardRef(MentionList)
