import React, { useState, forwardRef, useEffect, useMemo, useRef } from 'react'
import { Select } from 'antd'
import styled from '@emotion/styled'
import CommonIconFont from '../CommonIconFont'
import NoData from '../NoData'
import { storyConfigCategoryList } from '@/services/project'
import useCategoryList from '@/hooks/useCategoryList'
const Wrap = styled(Select)`
  margin-bottom: 10px;
`
const LabelBox = styled.div`
  display: flex;
  align-items: center;
  /* border: 1px solid;s */
  height: 32px;
  span {
    margin-left: 4px;
  }
`
interface IProps {
  width?: number
  value?: string
  onChangeCallBack?(data: Model.Project.Category): void
  onClearCallback?(): void
  projectId: number
  is_select: number
}
const CategoryDropdown = (props: IProps) => {
  const { onClearCallback, onChangeCallBack, projectId, is_select, value } =
    props

  const [options, setOptions] = useState<Model.Project.CategoryList[]>([])

  const memoProjectId = useMemo(() => projectId, [])

  const { getTypeCategory } = useCategoryList()

  const init = async () => {
    const params = { projectId, is_select }
    const res = await storyConfigCategoryList(params)
    let { list } = res
    list = list.map((item: { name: any }) => {
      return { ...item, labelName: item.name }
    })
    const data = getTypeCategory(list, 'work_type')
    const options = getOptions(data)
    if (!options) {
      return
    }
    setOptions(options)
  }

  useEffect(() => {
    init()
  }, [memoProjectId])

  const LabelElement = (props: {
    url: string | undefined
    labelName: string | undefined
  }) => {
    return (
      <LabelBox>
        <img src={props.url} alt="" style={{ width: '18px' }} />
        <span>{props.labelName}</span>
      </LabelBox>
    )
  }
  const getOptions = (data: Model.Project.CategoryList[] | undefined) => {
    data?.forEach(item => {
      item.children.forEach(item => {
        item.name = (
          <LabelElement
            url={item.attachmentPath}
            labelName={item.labelName}
          ></LabelElement>
        )
      })
    })
    return data
  }
  return (
    <Wrap
      placeholder="选择类别"
      value={value}
      style={{ width: 200 }}
      onChange={(data: any) => {
        if (!data) {
          return
        }
        onChangeCallBack &&
          onChangeCallBack({ name: data.label.props.labelName, id: data.value })
      }}
      showSearch
      allowClear
      options={options}
      labelInValue
      filterOption={(inputValue, option) => {
        console.log(option)
        return (
          option?.labelName?.toLowerCase().indexOf(inputValue.toLowerCase()) >=
          0
        )
      }}
      fieldNames={{ label: 'name', value: 'id', options: 'children' }}
      onClear={() => {
        onClearCallback && onClearCallback()
      }}
    ></Wrap>
  )
}
export default CategoryDropdown
