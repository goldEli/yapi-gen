// 使用多次的公共方法

/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable require-unicode-regexp */
/* eslint-disable max-statements-per-line */
/* eslint-disable max-params */
/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { decryptPhp } from './cryptoPhp'
import {
  Select,
  Input,
  DatePicker,
  InputNumber,
  TreeSelect,
  message,
  Checkbox,
  Radio,
} from 'antd'
import moment from 'moment'

// 获取权限
function getIsPermission(arr: any, value: string) {
  return !arr?.filter((i: any) => i.identity === value).length
}

// 解密地址栏参数
function getParamsData(params: any) {
  return JSON.parse(decryptPhp(params.get('data') as string))
}

// 需求分类树
function filterTreeData(data: any) {
  const newData = data.map((item: any) => ({
    title: item.name,
    value: item.id,
    children:
      item.children && item.children.length
        ? filterTreeData(item.children)
        : null,
  }))
  return newData
}

function arrayFlagLevel(array: any, grade: any) {
  if (!array || !array.length) {
    return ''
  }
  array.forEach((item: any) => {
    item.grade = grade

    if (item.children && item.children.length) {
      arrayFlagLevel(item.children, grade + 1)
    }
  })
  return array
}

// 自定义字段返回相应组件和快捷编辑的组件
function getTypeComponent(
  params: any,
  onChange?: any,
  isModal?: any,
  defaultValue?: any,
  inputRef?: any,
  onBlur?: any,
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
        open={isModal}
        onBlur={() => (isModal ? onBlur(defaultValue) : void 0)}
        onChange={
          isModal
            ? (date: any) =>
                onChange(
                  date
                    ? moment(date).format(
                        params?.value[0] === 'datetime'
                          ? 'YYYY-MM-DD HH:mm:ss'
                          : 'YYYY-MM-DD',
                      )
                    : '',
                  1,
                )
            : void 0
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
        onBlur={e => (isModal ? onBlur(e.target.value) : void 0)}
        onPressEnter={(e: any) => (isModal ? onBlur(e.target.value) : void 0)}
        type={params?.attr}
        allowClear
        defaultValue={defaultValue}
        ref={inputRef}
        autoComplete="off"
        style={{ width: '100%', minWidth: 192 }}
      />
    )
  } else if (params?.attr === 'single_checkbox') {
    child = (
      <Radio
        defaultChecked={defaultValue}
        onChange={() => onChange(!defaultValue)}
      >
        wwwww
      </Radio>
      // <Input
      //   placeholder={params.remarks || ''}
      //   onBlur={e => (isModal ? onBlur(e.target.value) : void 0)}
      //   onPressEnter={(e: any) => (isModal ? onBlur(e.target.value) : void 0)}
      //   type={params?.attr}
      //   allowClear
      //   defaultValue={defaultValue}
      //   ref={inputRef}
      //   autoComplete="off"
      //   style={{ width: '100%', minWidth: 192 }}
      // />
    )
  } else if (params?.attr === 'textarea') {
    child = (
      <Input.TextArea
        placeholder={params.remarks || ''}
        onBlur={e => (isModal ? onBlur(e.target.value || '') : void 0)}
        onPressEnter={(e: any) => (isModal ? onBlur(e.target.value) : void 0)}
        allowClear
        autoSize={{ minRows: 3, maxRows: 5 }}
        defaultValue={defaultValue}
        ref={inputRef}
        style={{ width: '100%', minWidth: 192 }}
        autoComplete="off"
      />
    )
  } else if (params?.attr === 'number' && params?.value[0] === 'integer') {
    child = (
      <InputNumber
        placeholder={params.remarks || ''}
        onBlur={e => (isModal ? onBlur(e.target.value || '') : void 0)}
        onPressEnter={(e: any) => (isModal ? onBlur(e.target.value) : void 0)}
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
        onBlur={() => (isModal ? onBlur(defaultValue) : void 0)}
        onChange={value => onChange(value, 1)}
        defaultOpen={isModal}
      />
    )
  } else if (String(params?.attr)?.includes('fixed_')) {
    // 之前固定字段的修改
    child = (
      <Select
        placeholder={params.remarks}
        style={{ width: '100%', minWidth: 192 }}
        showSearch
        showArrow
        optionFilterProp="label"
        getPopupContainer={node => node}
        allowClear
        value={defaultValue}
        ref={inputRef}
        onBlur={() => (isModal ? onBlur?.(defaultValue) : void 0)}
        onChange={value =>
          onChange?.(value, params.attr === 'fixed_select' ? '' : 1)
        }
        options={params?.value}
        mode={params.attr === 'fixed_select' ? 'multiple' : (null as any)}
        defaultOpen={isModal}
      />
    )
  } else if (
    [
      'select_checkbox',
      'checkbox',
      'select',
      'radio',
      'user_select_checkbox',
      'user_select',
    ].includes(String(params?.attr))
  ) {
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
        onBlur={() => (isModal ? onBlur?.(defaultValue) : void 0)}
        onChange={value =>
          onChange?.(
            value,
            ['select_checkbox', 'checkbox', 'user_select_checkbox'].includes(
              params?.attr,
            )
              ? ''
              : 1,
          )
        }
        options={
          ['user_select_checkbox', 'user_select'].includes(String(params?.attr))
            ? params?.value
            : params?.value?.map((i: any) => ({ label: i, value: i }))
        }
        defaultOpen={isModal}
        mode={
          ['select_checkbox', 'checkbox', 'user_select_checkbox'].includes(
            params?.attr,
          )
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
        title: item.name ?? item.content,
        key: item.id,
        value: item.id,
        children: item.children ?? [],
      })
    }
  }
  return resArr
}

function bytesToSize(fileByte: any) {
  const fileSizeByte = fileByte
  let fileSizeMsg = ''
  if (fileSizeByte < 1024) {
    fileSizeMsg = `${fileSizeByte.toFixed(2)}Byte`
  } else if (fileSizeByte < 1048576) {
    fileSizeMsg = `${(fileSizeByte / 1024).toFixed(2)}KB`
  } else if (fileSizeByte === 1048576) {
    fileSizeMsg = '1MB'
  } else if (fileSizeByte > 1048576 && fileSizeByte < 1073741824) {
    fileSizeMsg = `${(fileSizeByte / (1024 * 1024)).toFixed(2)}MB`
  } else if (fileSizeByte > 1048576 && fileSizeByte === 1073741824) {
    fileSizeMsg = '1GB'
  } else if (fileSizeByte > 1073741824 && fileSizeByte < 1099511627776) {
    fileSizeMsg = `${(fileSizeByte / (1024 * 1024 * 1024)).toFixed(2)}GB`
  } else {
    fileSizeMsg = '文件超过1TB'
  }
  return fileSizeMsg
}

// 复制
function copyLink(text: any, successText: string, errorText: string) {
  navigator.clipboard.writeText(text).then(
    () => {
      message.success(successText)
    },
    err => {
      message.error(errorText)
    },
  )
}

// 去除筛选填入的空选项
function removeNull(list: any, key: string) {
  return list
    ?.filter((i: any) => i.key === key)[0]
    ?.children?.filter((i: any) => i.id !== -1)
}

// 获取自定义字段默认值
function getCustomNormalValue(attr: any, text: any) {
  let result: any
  if (['user_select_checkbox', 'user_select'].includes(attr)) {
    result = text?.true_value || '--'
  }

  if (Array.isArray(text?.value)) {
    result = text?.value?.join(';')
  } else if (typeof text?.value === 'object') {
    result = text?.value.content
  } else {
    result = text?.value
  }

  return result || '--'
}

export {
  getIsPermission,
  getParamsData,
  transData,
  getTypeComponent,
  getNestedChildren,
  filterTreeData,
  bytesToSize,
  removeNull,
  getCustomNormalValue,
  copyLink,
}
