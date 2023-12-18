// 项目二级菜单
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
import CommonIconFont from '@/components/CommonIconFont'
import { getCategorySaveSort } from '@/services/demand'
import { getParamsData } from '@/tools'
import { useDispatch, useSelector } from '@store/index'
import _ from 'lodash'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import EditCategory from './EditCategory'
import {
  AllWrap,
  MenuBox,
  WrapSet,
  AffairTypeWrap,
  AffairTypeHeader,
  AffairTypeText,
} from '../../style'
import Dragging from './Dragging'
import { setStartUsing } from '@store/category'
// eslint-disable-next-line no-duplicate-imports
import {
  getCategoryConfigList,
  storyConfigCategoryList,
} from '@store/category/thunk'
import { setCategoryWorkType } from '@store/project'
import {
  setActiveCategory,
  setCategoryConfigDataList,
} from '@store/category/index'
import styled from '@emotion/styled'
import { css } from '@emotion/css'
import IconFont from '@/components/IconFont'
import useCategory from '@/hooks/useCategoryList'
import { CloseWrap } from '@/components/StyleCommon'

const Tabs = styled.div`
  height: 24px;
  border-radius: 4px;
  margin: 16px 24px;
  font-size: 12px;
  font-weight: 400;
  color: var(--neutral-n3);
  background-color: var(--hover-d1);
  span {
    display: inline-block;
    width: 50%;
    text-align: center;
    height: 24px;
    line-height: 24px;
    color: var(--neutral-n3);
  }
  &:hover {
    cursor: pointer;
    color: var(--neutral-n1-d1);
  }
  .tabsActive {
    background-color: var(--neutral-white-d6);
    color: var(--neutral-n1-d1);

    border-radius: 6px;
    border: 1px solid var(--neutral-n6-d1);
  }
`
const toggleDropUp = css`
  max-height: 0;
  transition: all 0.5s;
`
const toggleDropDown = css`
  max-height: 30vh;
  padding: 0 16px;
  transition: all 0.5s;
`
const CategoryList = () => {
  const [t] = useTranslation()
  const { startUsing, categoryList, activeCategory } = useSelector(
    store => store.category,
  )
  const language = window.localStorage.getItem('language')
  const dispatch = useDispatch()
  const { getTypeCategory } = useCategory()
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData?.id
  const { projectInfo } = useSelector(store => store.project)
  const [tabsActive, setTabsActive] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [list, setList] = useState<any>()
  const [affairType, setAffairType] = useState<any>()
  const [categoryItem, setCategoryItem] = useState(paramsData?.categoryItem)

  const [cacheData, setCacheData] = useState<Model.Project.CategoryList[]>()
  const [workType, setWorkType] = useState(0)
  const tabs = [
    {
      label: t('start_using'),
    },
    {
      label: t('no_start_using'),
    },
  ]
  // 需求类别侧边栏
  const getList = async (type?: string) => {
    await dispatch(storyConfigCategoryList({ projectId: paramsData.id }, type))
  }

  // 监听跟新
  const watchDataList = () => {
    let dataItem = null
    let filterData = null
    if (startUsing) {
      filterData = categoryList?.filter((el: any) => el.status === 1)
    } else {
      filterData = categoryList?.filter((el: any) => el.status !== 1)
    }
    if (activeCategory?.id || paramsData?.categoryItem?.id) {
      dataItem = filterData.map((el: any) => ({
        ...el,
        active: el.id === (activeCategory?.id || paramsData?.categoryItem?.id),
      }))
    } else {
      dataItem = filterData.map((el: any, index: number) => ({
        ...el,
        active: index === 0 ? true : false,
      }))
    }
    dataItem?.length <= 1 && dispatch(setCategoryConfigDataList([]))
    const affairTypeData = getTypeCategory(
      dataItem,
      'work_type',
      projectInfo?.projectType === 1 ? 'iteration' : 'sprint',
    )
    if (!affairTypeData) {
      return
    }

    setAffairType(affairTypeData)
    setCacheData(_.cloneDeep(affairTypeData))
  }

  // 需求类别中间列表
  const getCategoryConfig = async (dataItem: any) => {
    const itemId = dataItem?.find((item: any) => item.active)?.id
    watchDataList()
    itemId &&
      projectId &&
      (await dispatch(
        getCategoryConfigList({
          projectId: projectId,
          categoryId: itemId,
        }),
      ))
  }

  useEffect(() => {
    getList()
  }, [])

  useEffect(() => {
    if (paramsData?.categoryItem) {
      dispatch(setStartUsing(paramsData?.categoryItem.status === 1))
      setTabsActive(paramsData?.categoryItem.status === 1 ? 0 : 1)
      dispatch(setActiveCategory(paramsData?.categoryItem))
    }
  }, [paramsData?.categoryItem?.status])

  const arrayFlat = (
    array: Model.Project.CategoryList[],
    prevIndex: number,
    nextIndex: number,
    workType: any[],
  ) => {
    if (!workType.length) {
      return
    }
    const newData: Model.Project.Category[] = []
    array.forEach(item => {
      item.children.forEach(item => {
        newData.push(item)
      })
    })
    const otherCategoryData = newData.filter(
      item => !workType.includes(item.work_type),
    )
    const CategoryData = newData.filter(item =>
      workType.includes(item.work_type),
    )

    const currentItem = CategoryData[prevIndex]
    CategoryData[prevIndex] = CategoryData[nextIndex]
    CategoryData[nextIndex] = currentItem

    const list = getTypeCategory(
      [...CategoryData, ...otherCategoryData],
      'work_type',
      'iteration',
    )
    if (!list) {
      return
    }
    setAffairType(list)
    setCacheData(list)
  }
  const onMove = async (
    data: Model.Project.Category[],
    prevIndex: number,
    nextIndex: number,
  ) => {
    if (!cacheData) {
      return
    }
    const workType = data.map(item => item.work_type)
    arrayFlat(cacheData, prevIndex, nextIndex, workType)
    const dataSort = data.map((el: any, index: any) => ({
      id: el.id,
      sort: index,
    }))
    await getCategorySaveSort({ id: paramsData.id, data: dataSort })
  }

  const filterDataItem = (num: number) => {
    let dataItem = null
    if (activeCategory?.id || paramsData?.categoryItem?.id) {
      dataItem = categoryList
        ?.filter((el: any) => el.status === num)
        .map((el: any) => ({
          ...el,
          active:
            el.id === (activeCategory?.id || paramsData?.categoryItem?.id),
        }))
    } else {
      dataItem = categoryList
        ?.filter((el: any) => el.status === num)
        .map((el: any, index: number) => ({
          ...el,
          active: index === 0 ? true : false,
        }))
    }
    dispatch(setActiveCategory(dataItem.find((el: any) => el.active)))
    return dataItem
  }

  useEffect(() => {
    setTabsActive(startUsing ? 0 : 1)
    let dataItem = null
    if (startUsing) {
      dataItem = filterDataItem(1)
    } else {
      dataItem = filterDataItem(2)
    }
    getCategoryConfig(dataItem)
  }, [startUsing, categoryList])

  // 切换tab
  const getTabsActive = async (index: any) => {
    let dataItem = null
    setCategoryItem({})
    dispatch(setActiveCategory({}))
    if (index === 0) {
      dataItem = filterDataItem(1)
    } else {
      dataItem = filterDataItem(2)
    }
    dispatch(setStartUsing(index === 0 ? true : false))
    setTabsActive(index)
    watchDataList()
  }

  useEffect(() => {
    watchDataList()
  }, [language])

  const updateNode = (child: { name: any }) => {
    setAffairType((prevData: any) => {
      const newData = [...prevData]
      return newData.map(obj => {
        const updatedChildren = [...obj.children]
        return {
          ...obj,
          children: updatedChildren.map(item => {
            return { ...item, active: item.name === child.name }
          }),
        }
      })
    })
  }
  return (
    <AllWrap>
      <WrapSet>
        <Tabs>
          {tabs.map((el, index) => (
            <span
              className={tabsActive == index ? 'tabsActive' : ''}
              onClick={() => getTabsActive(index)}
              key={el.label}
            >
              {el.label}
            </span>
          ))}
        </Tabs>

        <div>
          {affairType?.map(
            (item: Model.Project.CategoryList, index: number) => (
              <AffairTypeWrap key={index}>
                <AffairTypeHeader
                  onClick={() => {
                    affairType[index].visible = !affairType[index].visible
                    setAffairType([...affairType])
                  }}
                >
                  <div
                    style={{
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      overflow: 'hidden',
                    }}
                  >
                    <IconFont
                      style={{ fontSize: 12, color: 'var(--neutral-n3)' }}
                      type={
                        affairType[index].visible ? 'down-icon' : 'right-icon'
                      }
                    />
                    <AffairTypeText>{item.name}</AffairTypeText>
                  </div>
                  <CloseWrap width={24} height={24}>
                    <IconFont
                      style={{ fontSize: 18, color: 'var(--neutral-n2)' }}
                      type="plus"
                      onClick={e => {
                        e.stopPropagation()
                        setIsVisible(true)
                        setWorkType(item.workType)
                      }}
                    />
                  </CloseWrap>
                </AffairTypeHeader>

                <MenuBox
                  className={item.visible ? toggleDropDown : toggleDropUp}
                >
                  <Dragging
                    list={item.children}
                    setList={setList}
                    onClick={(i: number, child: any) => {
                      dispatch(setCategoryWorkType(child.work_type))
                      dispatch(
                        getCategoryConfigList({
                          projectId: projectId,
                          categoryId: child.id || 695,
                        }),
                      )
                      updateNode(child)
                    }}
                    onMove={(data: any, prevIndex: number, nextIndex: number) =>
                      onMove(data, prevIndex, nextIndex)
                    }
                  ></Dragging>
                </MenuBox>
              </AffairTypeWrap>
            ),
          )}
        </div>
      </WrapSet>
      <EditCategory
        onClose={() => setIsVisible(false)}
        onUpdate={() => getList('add')}
        item={null}
        isVisible={isVisible}
        workType={workType}
      />
    </AllWrap>
  )
}

export default CategoryList
