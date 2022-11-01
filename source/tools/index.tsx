// 使用多次的公共方法

/* eslint-disable consistent-return */
/* eslint-disable max-params */
/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-negated-condition */
import { decryptPhp } from './cryptoPhp'
import { Select, Input, DatePicker, InputNumber, TreeSelect } from 'antd'
import moment from 'moment'

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

function getTypeComponent(
  params: any,
  isModal?: any,
  defaultValue?: any,
  inputRef?: any,
  onBlur?: any,
  onChange?: any,
) {
  let child: any = null
  if (params?.attr === 'date') {
    child = (
      <DatePicker
        placeholder={params.remarks || ''}
        style={{ width: '100%', minWidth: 192 }}
        showTime={params?.value[0] === 'datetime'}
        allowClear
        value={defaultValue ? moment(defaultValue) : ('' as any)}
        ref={inputRef}
        onBlur={() => (!isModal ? void 0 : onBlur(''))}
        onChange={
          !isModal
            ? void 0
            : (date: any) =>
                onChange(
                  moment(date).format(
                    params?.value[0] === 'datetime'
                      ? 'YYYY-MM-DD hh:mm:ss'
                      : 'YYYY-MM-DD',
                  ),
                )
        }
      />
    )
  } else if (
    params?.attr === 'text' ||
    (params?.attr === 'number' && params?.value[0] === 'number')
  ) {
    child = (
      <Input
        placeholder={params.remarks || ''}
        onBlur={e => (!isModal ? void 0 : onBlur(e.target.value))}
        type={params?.attr}
        allowClear
        defaultValue={defaultValue}
        ref={inputRef}
        autoComplete="off"
        style={{ minWidth: 192 }}
      />
    )
  } else if (params?.attr === 'textarea') {
    child = (
      <Input.TextArea
        placeholder={params.remarks || ''}
        onBlur={e => (!isModal ? void 0 : onBlur(e.target.value || ''))}
        allowClear
        autoSize={{ minRows: 3, maxRows: 5 }}
        defaultValue={defaultValue}
        ref={inputRef}
        style={{ minWidth: 192 }}
        autoComplete="off"
      />
    )
  } else if (params?.attr === 'number' && params?.value[0] === 'integer') {
    child = (
      <InputNumber
        placeholder={params.remarks || ''}
        onBlur={e => (!isModal ? void 0 : onBlur(e.target.value || ''))}
        step={1}
        style={{ width: '100%', minWidth: 192 }}
        defaultValue={defaultValue}
        ref={inputRef}
        autoComplete="off"
      />
    )
  } else if (params?.attr === 'treeSelect') {
    child = (
      <TreeSelect
        placeholder={params.remarks || ''}
        style={{ minWidth: 192 }}
        showArrow
        showSearch
        getPopupContainer={node => node}
        allowClear
        treeData={params?.value}
        value={defaultValue}
        ref={inputRef}
        onBlur={() => (!isModal ? void 0 : onBlur(defaultValue))}
        onChange={onChange}
      />
    )
  } else {
    child = (
      <Select
        placeholder={params.remarks || ''}
        style={{ width: '100%', minWidth: 192 }}
        showSearch
        showArrow
        optionFilterProp="label"
        getPopupContainer={node => node}
        allowClear
        value={defaultValue}
        ref={inputRef}
        onBlur={() => (!isModal ? void 0 : onBlur(defaultValue))}
        onChange={onChange}
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

function arrayFlagLevel(array: any, grade: any) {
  if (!array || !array.length) {
    return
  }
  array.forEach((item: any) => {
    item.grade = grade

    if (item.children && item.children.length) {
      arrayFlagLevel(item.children, grade + 1)
    }
  })
  return array
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

  return arrayFlagLevel(result, 1)
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
