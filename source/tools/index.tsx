/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-negated-condition */
import { decryptPhp } from './cryptoPhp'
import { Select, Input, DatePicker, InputNumber } from 'antd'

function getIsPermission(arr: any, value: string) {
  return !arr?.filter((i: any) => i.identity === value).length
}

function openDetail(url: string) {
  if (import.meta.env.MODE !== 'production') {
    window.open(`${window.origin}${import.meta.env.__URL_ALIAS__}${url}`)
  } else {
    window.open(`${window.origin}${url}`)
  }
}

function getParamsData(params: any) {
  return JSON.parse(decryptPhp(params.get('data') as string))
}

function getTypeComponent(params: any, defaultValue?: any, inputRef?: any) {

  // console.log(params, '---12', defaultValue)
  let child: any = null
  if (params?.attr === 'date') {
    child = (
      <DatePicker
        style={{ width: '100%' }}
        showTime={params?.value[0] === 'datetime'}
        allowClear
        value={defaultValue}
      />
    )
  } else if (
    params?.attr === 'text'
    || params?.attr === 'number' && params?.value[0] === 'number'
  ) {
    child = <Input type={params?.attr} allowClear />
  } else if (params?.attr === 'textarea') {
    child = <Input.TextArea allowClear autoSize={{ minRows: 3, maxRows: 5 }} />
  } else if (params?.attr === 'number' && params?.value[0] === 'integer') {
    child = <InputNumber step={1} style={{ width: '100%' }} />
  } else {
    child = (
      <Select
        style={{ width: '100%' }}
        showSearch
        showArrow
        optionFilterProp="label"
        getPopupContainer={node => node}
        allowClear
        value={defaultValue}
        ref={inputRef}
        options={params?.value?.map((i: any) => ({ label: i, value: i }))}
        mode={
          ['select_checkbox', 'checkbox'].includes(params?.attr)
            ? 'multiple'
            : ('' as any)
        }
      />
    )
  }
  return child
}

const transData = (jsonArr: any, idStr: any, pidStr: any, childrenStr: any) => {
  const result = []
  const id: any = idStr
  const pid: any = pidStr
  const children: any = childrenStr
  const len: any = jsonArr.length
  const hash: any = {}
  jsonArr.forEach((item: any) => {
    hash[item[id]] = item
  })

  for (let j = 0; j < len; j++) {
    const jsonArrItem = jsonArr[j]
    const hashItem = hash[jsonArrItem[pid]]
    if (hashItem) {
      !hashItem[children] && (hashItem[children] = [])
      hashItem[children].push(jsonArrItem)
    } else {
      result.push(jsonArrItem)
    }
  }
  return result
}

function getNestedChildren(arr: any, parent?: any) {
  const resArr: any = []
  for (const item of arr) {
    if (item.parent_id === parent) {
      const children = getNestedChildren(arr, item.id)
      if (children.length) {
        item.children = children
      }
      resArr.push({
        title: item.name,
        key: item.id,
        value: item.id,
        children: item.children ?? [],
      })
    }
  }
  return resArr
}

export {
  getIsPermission,
  openDetail,
  getParamsData,
  transData,
  getTypeComponent,
  getNestedChildren,
}
