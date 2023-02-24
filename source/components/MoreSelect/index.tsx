/* eslint-disable no-undefined */
/* eslint-disable react-hooks/rules-of-hooks */
import { Button, Divider, Select, Tag } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import MoreOptions from '../MoreOptions'

type List = {
  id: string
  name: string
  dec?: string
}

type Props = {
  type: 'promise' | 'user' | 'project'
  options: List[]
  onChange?(values: string[]): void
}

const index = (props: any) => {
  const [value, setValue] = useState<string[]>(() => props.value)

  const onClear = () => {
    setValue([])
  }
  const handleChange = (values: string[]) => {
    setValue(values)
  }

  function getIds(arr: List[]) {
    return arr.map((i: List) => i.id)
  }

  function getArrDifference(arr1: any[], arr2: any[]) {
    return getIds(arr1)
      .concat(arr2)
      .filter((v, i, arr) => {
        return arr.indexOf(v) === arr.lastIndexOf(v)
      })
  }

  const invertSelection = () => {
    const invertSelectionArray = getArrDifference(props.options, value)
    setValue(invertSelectionArray)
  }

  function mySort(arr1: List[], arr2: string[]) {
    return arr1.sort((prev, next) => {
      return arr2.indexOf(prev.id) - arr2.indexOf(next.id)
    })
  }

  const prepositionItems = useMemo(() => {
    if (value?.length >= 1) {
      const reRroup = value.concat(getArrDifference(props.options, value))

      return mySort(props.options, reRroup)
    }
    return props.options
  }, [props.options, value])

  useEffect(() => {
    if (value?.length < 1) {
      return
    }
    props.onChange(value)
  }, [value])

  return (
    <Select
      disabled={props.disabled}
      value={value}
      mode={props.mode ? 'multiple' : undefined}
      onChange={handleChange}
      placeholder="custom dropdown render"
      dropdownRender={menu => (
        <>
          {menu}
          <Divider style={{ margin: '8px 0' }} />
          <div>
            <Button onClick={onClear}>清空</Button>
            <Button onClick={invertSelection}>反选</Button>
          </div>
        </>
      )}
      optionLabelProp="label"
    >
      {prepositionItems.map((i: any) => (
        <Select.Option value={i.id} key={i.id} label={i.name}>
          <MoreOptions type={props.type} name={i.name} dec={i.dec} />
        </Select.Option>
      ))}
    </Select>
  )
}

export default index
