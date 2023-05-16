// 表格搜索高亮

/* eslint-disable require-unicode-regexp */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-negated-condition */
/* eslint-disable react/no-danger */
import { useSelector } from '@store/index'

const TableColorText = (props: any) => {
  const hight = useSelector(state => state.colorText.text)

  const lightText = (item: any) => {
    const newStr = item.replace(/</g, '&lt;').replace(/>/g, '&gt;')
    let resultDiv = ''
    if (hight && newStr.includes(hight)) {
      const textArr = newStr.split(hight)
      textArr?.forEach((i: any, index: number) => {
        const text =
          index != textArr.length - 1
            ? `<span style="color: var(--primary-d2)">${hight}</span>`
            : ''
        resultDiv = resultDiv + i + text
      })
      return resultDiv
    }
    return newStr
  }

  return (
    <span
      className={`controlMaxWidth level${props.level}`}
      dangerouslySetInnerHTML={{ __html: lightText(props.text) }}
    />
  )
}

export default TableColorText
