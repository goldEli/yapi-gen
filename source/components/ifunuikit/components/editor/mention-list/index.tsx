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

const key = `scrollItem+${Math.random()}_`
// eslint-disable-next-line @typescript-eslint/naming-convention
const MentionList: ForwardRefRenderFunction<Ref, Props> = (props, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [searchValue, setSearchValue] = useState('')
  const inputRef = useRef<any>(null)

  const list = useMemo(() => {
    if (!props.options?.length) {
      return []
    }
    return [
      { id: 'all', label: `所有人（${props?.options?.length}）` },
      ...props?.options,
    ]
  }, [props.options])

  const selectItem = (index: number) => {
    const item = list?.[index]

    if (item) {
      props.onSelect?.(item)
    }
  }
  const handleUpAndDown = (idx: number, isDown: boolean) => {
    const currentId = list?.[idx]?.id ?? ''
    const id = key + currentId
    const dom = document.getElementById(id)
    const parentRect = dom?.parentElement?.getBoundingClientRect()
    const elementRect = dom?.getBoundingClientRect()
    setSelectedIndex(idx)
    // 元素位于父元素的上面
    if ((elementRect?.bottom ?? 0) <= (parentRect?.top ?? 0)) {
      console.log('above')
      dom?.scrollIntoView()
      return
    }
    // 元素位于父元素的下面
    if ((elementRect?.top ?? 0) >= (parentRect?.bottom ?? 0)) {
      console.log('below')
      dom?.scrollIntoView(false)
    }
  }

  const onUp = () => {
    const idx = (selectedIndex + list!.length - 1) % list!.length
    handleUpAndDown(idx, false)
  }
  const onDown = () => {
    const idx = (selectedIndex + 1) % list!.length
    handleUpAndDown(idx, true)
  }

  const onEnter = () => selectItem(selectedIndex)

  useEffect(() => setSelectedIndex(0), [list])

  useEffect(() => {
    inputRef?.current?.focus?.()
  }, [])

  useImperativeHandle(ref, () => ({
    onKeyDown({ event }) {
      if (!list) {
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
      const arr = list.filter(
        (i: any) =>
          reg.test(i.label)
            ? i.label.includes(searchValue)
            : i.label.toLowerCase().includes(searchValue.toLowerCase()),
        // String(i.label).lo.includes(searchValue),
      )
      return arr
    }
    // if (props?.options?.length > 1) {
    //   return [{ id: 'all', label: '所有人' }, ...props?.options]
    // }

    return list
  }, [searchValue, list])

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
          newArr?.map((i, index) => {
            return (
              <Item
                id={key + i.id}
                data-active={index === selectedIndex}
                key={i.id}
                onClick={() => props.onSelect?.(i)}
              >
                {i.label}
              </Item>
            )
          })
        )}
        {props.loading && <Loading />}
      </Wrap>
    </div>
  )
}

export default forwardRef(MentionList)
