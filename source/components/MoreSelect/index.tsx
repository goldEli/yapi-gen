/* eslint-disable react-hooks/rules-of-hooks */
import { Button, Divider, Select, Tag } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import MoreOptions from '../MoreOptions'

const index = (props: any) => {
  const [value, setValue] = useState<string[]>([])
  const onClear = () => {
    setValue([])
  }

  function getArrDifference(arr1: string[], arr2: string[]) {
    return arr1.concat(arr2).filter((v, i, arr) => {
      return arr.indexOf(v) === arr.lastIndexOf(v)
    })
  }
  const handleChange = (values: string[]) => {
    setValue(values)
  }
  const invertSelection = () => {
    const invertSelectionArray = getArrDifference(props.options, value)
    setValue(invertSelectionArray)
  }
  const prepositionItems = useMemo(() => {
    if (value.length >= 1) {
      return value.concat(getArrDifference(props.options, value))
    }
    return props.options
  }, [props.options, value])

  useEffect(() => {
    props.onChange(value)
  }, [value])

  return (
    <Select
      value={value}
      mode="multiple"
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
      // options={prepositionItems.map((i: any) => ({
      //   label: (
      //       <MoreOptions type={props.type} name={i} dec={i} />
      //   ),
      //   key: i
      // }))}
    >
      {prepositionItems.map((i: any) => (
        <Select.Option key={i} label={i}>
          <MoreOptions type={props.type} name={i} dec={i} />
        </Select.Option>
      ))}
    </Select>
  )
}

export default index
