import React, { useState, forwardRef, useEffect, useMemo, useRef } from 'react'
import { Select, Tag } from 'antd'
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
  height: 32px;
  span {
    margin-left: 4px;
  }
`

const ClearOptionsBox = styled.div`
  border-top: 1px solid var(--neutral-n6-d1);
  display: flex;
  flex-direction: column;
  padding-left: 16px;
  padding-top: 6px;
  color: var(--neutral-n3);
  font-size: var(--font14);
  cursor: pointer;
  span {
    height: 32px;
    display: flex;
    align-items: center;
  }
`
const TagBox = styled.div`
  display: flex;
  align-items: center;
  > div {
    background: #f2f2f4;
    border-radius: 6px 6px 6px 6px;
    margin-right: 4px;
    min-width: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0px 8px;
  }
  .text {
    color: var(--neutral-n2);
    font-size: var(--font12);
  }
`
const HasMore = styled.div`
  background: #f2f2f4;
  border-radius: 6px 6px 6px 6px;
  margin-right: 4px;
  min-width: 70px;
  cursor: pointer;
`
/**
 * width 宽度
 * value  绑定值
 * onChangeCallBack 选中的回调
 * onClearCallback 清楚事件
 * projectId 项目id
 * mode 是否支持多选
 */
interface IProps {
  width?: number
  value?: number[] | number
  onChangeCallBack?(
    data: Model.Project.CategoryValue[] | Model.Project.CategoryValue,
  ): void
  onClearCallback?(): void
  projectId: number
  is_select?: number
  mode?: 'multiple' | undefined
}
const CategoryDropdown = (props: IProps) => {
  const {
    onClearCallback,
    onChangeCallBack,
    projectId,
    is_select = 2,
    value,
    mode,
    width = '100%',
  } = props
  const [options, setOptions] = useState<Model.Project.CategoryList[]>([])
  const [cacheList, setCacheList] = useState<Model.Project.Category[]>([])
  const [selectData, setSelectData] = useState<Model.Project.CategoryValue[]>(
    [],
  )
  const memoProjectId = useMemo(() => projectId, [])

  const { getTypeCategory } = useCategoryList()
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
  // 反选
  const reverseClick = () => {
    console.log('反选', props, cacheList)
    const { value } = props
    if (!mode) {
      return
    }
    if (!value || !cacheList.length) {
      return
    }
    if (Array.isArray(value)) {
      const reverseData = cacheList
        .filter(item => {
          if (!item.id) {
            return
          }
          return !value?.includes(item.id)
        })
        .map(item => {
          return { id: item.id, name: item.labelName }
        })
      onChangeCallBack && onChangeCallBack(reverseData)
    }
  }
  const init = async () => {
    const params = { projectId, is_select }
    const res = await storyConfigCategoryList(params)
    let { list } = res
    list = list.map((item: { name: any }) => {
      return { ...item, labelName: item.name }
    })
    setCacheList(list)
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
  useEffect(() => {}, [value])
  return (
    <Wrap
      placeholder="选择类别"
      value={value}
      style={{ width: width }}
      onChange={(data: any) => {
        // debugger
        if (!data) {
          return
        }
        if (mode) {
          const newData = data.map((item: any) => {
            return { name: item.label.props.labelName, id: item.value }
          })
          setSelectData([...newData])
          onChangeCallBack && onChangeCallBack(newData)
        } else {
          onChangeCallBack &&
            onChangeCallBack({
              name: data.label.props.labelName,
              id: data.value,
            })
        }
      }}
      showSearch
      allowClear
      options={options}
      labelInValue
      filterOption={(inputValue, option) => {
        return (
          option?.labelName?.toLowerCase().indexOf(inputValue.toLowerCase()) >=
          0
        )
      }}
      fieldNames={{ label: 'name', value: 'id', options: 'children' }}
      onClear={() => {
        onClearCallback && onClearCallback()
      }}
      mode={mode}
      maxTagTextLength={1}
      dropdownRender={menu => {
        return (
          <>
            {menu}
            <ClearOptionsBox>
              <span
                onClick={() => {
                  onClearCallback && onClearCallback()
                }}
              >
                清空所有选项
              </span>
              <span onClick={reverseClick}>反选</span>
            </ClearOptionsBox>
          </>
        )
      }}
      tagRender={props => {
        // eslint-disable-next-line react/prop-types

        console.log('props----', props)

        return (
          <TagBox>
            <div>
              <span className="text">美术</span>
              <CommonIconFont type="close" size={12}></CommonIconFont>
            </div>
            <HasMore>
              <span className="text">+12</span>
              <CommonIconFont type="close" size={12}></CommonIconFont>
            </HasMore>
          </TagBox>
        )
      }}
    ></Wrap>
  )
}
export default CategoryDropdown
