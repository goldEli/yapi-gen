/* eslint-disable no-undefined */
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
} from 'antd'
import moment from 'moment'

// 获取权限
function getIsPermission(arr: any, value: string) {
  return !arr?.filter((i: any) => i.identity === value).length
}

// 新开页面
function openDetail(url: string) {
  if (import.meta.env.MODE === 'production') {
    window.open(`${window.origin}${url}`)
  } else {
    window.open(`${window.origin}${import.meta.env.__URL_ALIAS__}${url}`)
  }
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
        maxLength={params?.attr === 'text' ? 100 : undefined}
      />
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
        maxLength={100}
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

// 14.24GB
// 定义粘贴函数
const onPaste = (event: any) => {
  // 剪贴板没数据，则直接返回
  if (!event.clipboardData || !event.clipboardData.items) {
    return
  }
  return new Promise((resovle, reject) => {
    for (let i = 0, len = event.clipboardData.items.length; i < len; i++) {
      const item = event.clipboardData.items[i]

      if (item.kind === 'file') {
        const file = item.getAsFile()
        if (item.type.match('^image/')) {
          // 处理图片
          handleImage(file, (data: any) => {
            resovle(data)
          })
        } else {
          // 其他文件直接返回
          resovle({
            data: file,
            type: 'file',
          })
        }
      } else if (item.kind === 'string') {
        let str = event.clipboardData.getData('text')
        resovle({
          data: str,
          type: 'string',
        })
      } else {
        message.error('不支持粘贴该类型')
        reject(new Error('不支持粘贴该类型'))
      }
    }
  })
}

function handleImage(file: any, callback: any, maxWidth = 200) {
  if (!file || !/(?:png|jpg|jpeg|gif)/i.test(file.type)) {
    return
  }
  const reader = new FileReader()
  reader.onload = function () {
    const { result } = this
    let img: any = new Image()
    img.onload = function () {
      const compressedDataUrl = compress(img, file.type, maxWidth, true)
      const url = compress(img, file.type, maxWidth, false)
      img = null
      callback({
        data: file,
        compressedDataUrl,
        url,
        type: 'image',
      })
    }
    img.src = result
  }
  reader.readAsDataURL(file)
}

function compress(img: any, type: any, maxHeight: any, flag: any) {
  let canvas: any = document.createElement('canvas')
  let ctx2: any = canvas.getContext('2d')
  const ratio = img.width / img.height
  let { width } = img,
    { height } = img

  // 根据flag判断是否压缩图片
  if (flag) {
    // 压缩后的图片展示在输入框
    height = maxHeight
    width = maxHeight * ratio
  }
  canvas.width = width
  canvas.height = height
  ctx2.fillStyle = '#fff'
  ctx2.fillRect(0, 0, canvas.width, canvas.height)
  ctx2.drawImage(img, 0, 0, width, height)
  let base64Data = canvas.toDataURL(type, 0.75)
  if (type === 'image/gif') {
    const regx = /(?<=data:image).*?(?=;base64)/
    base64Data = base64Data.replace(regx, '/gif')
  }
  canvas = null
  ctx2 = null
  return base64Data
}

// 复制
function copyLink(text: any, successText: string, errorText: string) {
  navigator.clipboard.writeText(text).then(
    function () {
      message.success(successText)
    },
    function (err) {
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

export default onPaste

export {
  getIsPermission,
  openDetail,
  getParamsData,
  transData,
  getTypeComponent,
  getNestedChildren,
  filterTreeData,
  bytesToSize,
  onPaste,
  copyLink,
  removeNull,
}
