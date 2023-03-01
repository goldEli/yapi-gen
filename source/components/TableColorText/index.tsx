/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-negated-condition */
/* eslint-disable react/no-danger */
import { useSelector } from '@store/index'
import { startCase } from 'lodash'

const TableColorText = (props: any) => {
  const hight = useSelector(state => state.colorText.text)

  const lightText = (item: any) => {
    let resultDiv = ''
    if (hight && item.includes(hight)) {
      const textArr = item.split(hight)
      textArr?.forEach((i: any, index: number) => {
        const text =
          index != textArr.length - 1
            ? `<span style="color: #617EF2">${hight}</span>`
            : ''
        resultDiv = resultDiv + i + text
      })
      return resultDiv
    }
    return item
  }

  return <span dangerouslySetInnerHTML={{ __html: lightText(props.text) }} />
}

export default TableColorText
