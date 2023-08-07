/* eslint-disable no-undefined */
/* eslint-disable react-hooks/rules-of-hooks */
import styled from '@emotion/styled'
import { Divider, Select } from 'antd'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import IconFont from '../IconFont'
import { SelectWrap } from '../StyleCommon'

const Btn = styled.div`
  height: 32px;
  border-radius: 0px 0px 0px 0px;
  padding-left: 16px;
  font-size: 14px;
  font-family: PingFang SC-Regular, PingFang SC;
  font-weight: 400;
  color: var(--neutral-n3);
  line-height: 32px;
  cursor: pointer;
`

type List = {
  id: string
  name: string
  dec?: string
}

const index = (props: any) => {
  const [t] = useTranslation()

  const onClear = () => {
    props.onChange(undefined)
    props.onConfirm(props.id)
  }
  const handleChange = (values: any) => {
    props.onChange(values)
    props.onConfirm(props.id)
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
      .filter((i: any) => i !== undefined)
  }

  const invertSelection = () => {
    const invertSelectionArray = getArrDifference(props.options, props.value)

    props.onChange(invertSelectionArray)
    props.onConfirm(props.id)
  }

  function mySort(arr1: List[], arr2: string[]) {
    return arr1.sort((prev, next) => {
      return arr2.indexOf(prev.id) - arr2.indexOf(next.id)
    })
  }

  const prepositionItems = useMemo(() => {
    if (
      props.value?.length >= 1 &&
      props.options?.every((i: any) => !i.children)
    ) {
      const reRroup = props.value.concat(
        getArrDifference(props.options, props.value),
      )

      return mySort(props.options, reRroup)
    }
    return props.options
  }, [props.options, props.value])

  return (
    <SelectWrap
      showArrow
      value={props.value}
      style={{ width: '100%' }}
      mode={props.more ? undefined : 'multiple'}
      allowClear
      optionFilterProp="label"
      onChange={handleChange}
      placeholder={t('common.pleaseSelect')}
      suffixIcon={
        <IconFont
          type="down"
          style={{ fontSize: 16, color: 'var(--neutral-n4)' }}
        />
      }
      dropdownRender={(menu: any) => (
        <>
          {menu}
          <Divider style={{ margin: '8px 0' }} />
          <div>
            <Btn onClick={onClear}>{t('clear_all_options')}</Btn>
            <Btn onClick={invertSelection}>{t('invert_selection')}</Btn>
          </div>
        </>
      )}
      options={prepositionItems}
      fieldNames={{ label: 'label', value: 'value', options: 'children' }}
    />
  )
}

export default index
