/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react'
import { Select, Tag } from 'antd'
import styled from '@emotion/styled'
import { storyConfigCategoryList } from '@/services/project'
import useCategoryList from '@/hooks/useCategoryList'
import { css } from '@emotion/css'
import { useTranslation } from 'react-i18next'
import CommonIconFont from '@/components/CommonIconFont'
const Wrap = styled(Select)`
  overflow-y: auto;
  .ant-select-selection-overflow-item {
    .inputLabel {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 60px;
    }
  }
`
const LabelBox = styled.div`
  display: flex;
  align-items: center;
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
const customStyle = css`
  .ant-select-item {
    line-height: 2;
    /* margin-bottom: 6px; */
  }
`
/**
 * width 宽度
 * value  绑定值
 * onChangeCallBack 选中的回调
 * onClearCallback 清楚事件
 * projectId 项目id
 * mode 是否支持多选
 * footer 是否显示底部操作
 * categoryList 类别列表
 */
interface IProps {
  width?: number
  w?: number
  value?: number[] | number | string
  onChangeCallBack?(data: number[] | number): void
  onClearCallback?(): void
  projectId?: number
  is_select?: number
  mode?: 'multiple' | undefined
  footer?: boolean
  categoryList?: Model.Project.Category[]
  bordered?: boolean
  type?: boolean
  isClear?: boolean
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
    footer = true,
    categoryList,
    bordered = false,
    type = false,
  } = props
  const [options, setOptions] = useState<Model.Project.CategoryList[]>([])
  const [cacheList, setCacheList] = useState<Model.Project.Category[]>([])
  const [selectData, setSelectData] = useState<Model.Project.CategoryValue[]>(
    [],
  )
  const [t] = useTranslation()

  const { getTypeCategory } = useCategoryList()
  const LabelElement = (props: {
    url: string | undefined
    labelName: string | undefined
  }) => {
    return (
      <LabelBox>
        <img src={props.url} alt="" style={{ width: '18px' }} />
        <span className="inputLabel">{props.labelName}</span>
      </LabelBox>
    )
  }
  const getOptions = (data: Model.Project.CategoryList[] | undefined) => {
    data?.forEach(item => {
      item.children.forEach(item => {
        item.name = (
          <LabelElement
            url={item.attachmentPath || item.attachment_path}
            labelName={item.labelName}
          ></LabelElement>
        )
      })
    })
    return data
  }
  // 反选
  const reverseClick = () => {
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
          return item.id
        })
      onChangeCallBack && onChangeCallBack(reverseData as number[])
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
    const data = getTypeCategory(list, 'work_type', '', type)
    const options = getOptions(data)
    if (!options) {
      return
    }
    setOptions(options)
  }

  useEffect(() => {
    if (categoryList) {
      const data = getTypeCategory(categoryList, 'work_type', '', type)
      const options = getOptions(data)
      if (!options) {
        return
      }
      setOptions(options)
      return
    }
    init()
  }, [projectId, value, categoryList])

  return (
    <Wrap
      placeholder={t('common.chooseCategory')}
      value={value}
      style={{ width: width }}
      placement="bottomRight"
      dropdownMatchSelectWidth={props.w}
      onChange={(data: any) => {
        if (!data) {
          return
        }
        if (mode) {
          setSelectData([...data])
          onChangeCallBack && onChangeCallBack(data)
        } else {
          onChangeCallBack && onChangeCallBack(data)
        }
      }}
      suffixIcon={<CommonIconFont type="down" />}
      showSearch
      allowClear={props.isClear}
      showArrow
      bordered={bordered}
      options={options}
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
      maxTagCount={1}
      dropdownRender={menu => {
        return (
          <>
            {menu}
            {footer ? (
              <ClearOptionsBox>
                <span
                  onClick={() => {
                    onClearCallback && onClearCallback()
                  }}
                >
                  {t('common.clearAll')}
                </span>
                <span onClick={reverseClick}>{t('invert_selection')}</span>
              </ClearOptionsBox>
            ) : null}
          </>
        )
      }}
      popupClassName={customStyle}
    ></Wrap>
  )
}
export default CategoryDropdown
