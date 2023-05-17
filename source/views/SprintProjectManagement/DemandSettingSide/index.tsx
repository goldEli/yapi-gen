// 项目二级菜单
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
import CommonIconFont from '@/components/CommonIconFont'
import { getCategorySaveSort } from '@/services/demand'
import { getParamsData } from '@/tools'
import { useDispatch, useSelector } from '@store/index'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import EditCategory from './EditCategory'
import { storyConfigCategoryList } from '@store/category/thunk'
import {
  AllWrap,
  MenuBox,
  Provider,
  SideInfo,
  SideTop,
  WrapSet,
  BackStyle,
  TitleStyle,
  NoDataCreateWrap,
  AffairTypeWrap,
  AffairTypeHeader,
  AffairTypeText,
  AffairTypeList,
} from './style'
import Dragging from './Dragging'
import { setStartUsing } from '@store/category'
// eslint-disable-next-line no-duplicate-imports
import { getCategoryConfigList } from '@store/category/thunk'
import {
  setActiveCategory,
  setCategoryConfigDataList,
} from '@store/category/index'
import styled from '@emotion/styled'
import { css } from '@emotion/css'
import IconFont from '@/components/IconFont'
import { CloseWrap } from '@/components/StyleCommon'
const Tabs = styled.div`
  height: 24px;
  border-radius: 4px;
  margin: 16px;
  font-size: 12px;
  font-weight: 400;
  color: var(--neutral-n3);
  background-color: var(--hover-d1);
  margin: 16px;
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
  transition: all 0.5s;
`
const ProjectDetailSide = (props: { onClick(): void; onBack(): void }) => {
  const [t] = useTranslation()
  const { startUsing, categoryList, activeCategory } = useSelector(
    store => store.category,
  )
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const paramsType = paramsData?.type
  const projectId = paramsData?.id
  const { projectInfo } = useSelector(store => store.project)
  const [tabsActive, setTabsActive] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [list, setList] = useState<any>()
  const [categoryItem, setCategoryItem] = useState(paramsData?.categoryItem)
  const [affairType, setAffairType] = useState([
    {
      name: '长故事类型',
      children: [{ name: '长故事', active: false }],
      visible: true,
    },
    {
      name: '标准事务类型',
      children: [
        { name: '故事', active: false },
        { name: '任务', active: false },
      ],
      visible: true,
    },
    {
      name: '故障事务类型',
      visible: true,
      children: [
        { name: '故障', active: false },
        { name: 'BUG缺陷', active: false },
      ],
    },
    {
      name: '子任务类型',
      visible: true,
      children: [{ name: '子任务', active: false }],
    },
  ])
  const tabs = [
    {
      label: t('start_using'),
    },
    {
      label: t('no_start_using'),
    },
  ]

  const isCreate = projectInfo?.projectPermissions?.filter(
    (i: any) => i.identity === 'b/project/story_config',
  )?.length

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
    if (activeCategory?.id || categoryItem?.id) {
      dataItem = filterData.map((el: any) => ({
        ...el,
        active:
          el.id === (activeCategory?.id || categoryItem?.id) ? true : false,
      }))
    } else {
      dataItem = filterData.map((el: any, index: number) => ({
        ...el,
        active: index === 0 ? true : false,
      }))
    }
    dataItem?.length <= 1 && dispatch(setCategoryConfigDataList([]))
    setList(dataItem)
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
    if (paramsType) {
      getList()
    } else {
      getList()
    }
  }, [paramsType])

  useEffect(() => {
    if (categoryItem) {
      dispatch(setStartUsing(categoryItem.status === 1 ? true : false))
      setTabsActive(categoryItem.status)
      dispatch(setActiveCategory(categoryItem))
    }
  }, [])

  //   返回上一页
  const onGoBack = () => {
    props.onClick()
  }

  const onMove = async (data: any) => {
    const dataSort = data.map((el: any, index: any) => ({
      id: el.id,
      sort: index,
    }))
    await getCategorySaveSort({ id: paramsData.id, data: dataSort })
  }

  const filterDataItem = (num: number) => {
    let dataItem = null
    if (activeCategory?.id || categoryItem?.id) {
      dataItem = categoryList
        ?.filter((el: any) => el.status === num)
        .map((el: any) => ({
          ...el,
          active:
            el.id === (activeCategory?.id || categoryItem?.id) ? true : false,
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
    if (
      (projectInfo?.projectPermissions?.length <= 0 ||
        projectInfo?.projectPermissions?.filter(
          (i: any) => i.identity === 'b/project/story_config',
        )?.length <= 0) &&
      location.hostname === '/ProjectManagement/DemandSetting'
    ) {
      props.onBack()
    }
  }, [projectInfo])
  const updateNode = (child: any) => {
    setAffairType(prevData => {
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
        <SideTop>
          <img src={projectInfo?.cover} alt="" />
          <SideInfo>
            <div>{projectInfo?.name}</div>
            <span> {t('demandSettingSide.teamProject')} </span>
          </SideInfo>
        </SideTop>
        <BackStyle onClick={onGoBack}>
          <CommonIconFont type="left-md" onClick={onGoBack} />
          <span>{t('demandSettingSide.back')}</span>
        </BackStyle>
        <Provider />
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
          {affairType.map((item, index) => (
            <AffairTypeWrap key={index}>
              <AffairTypeHeader
                onClick={() => {
                  affairType[index].visible = !affairType[index].visible
                  setAffairType([...affairType])
                }}
              >
                <div style={{ cursor: 'pointer' }}>
                  <IconFont
                    style={{ fontSize: 12 }}
                    type={affairType[index].visible ? 'down' : 'up'}
                  />
                  <AffairTypeText>{item.name}</AffairTypeText>
                </div>
                <IconFont
                  style={{ fontSize: 14 }}
                  type="plus"
                  onClick={e => {
                    e.stopPropagation()
                    setIsVisible(true)
                  }}
                />
              </AffairTypeHeader>

              <MenuBox className={item.visible ? toggleDropUp : toggleDropDown}>
                <Dragging
                  list={item.children}
                  setList={setList}
                  onClick={(i: number, child: any) => {
                    dispatch(
                      getCategoryConfigList({
                        projectId: projectId,
                        categoryId: child.id || 695,
                      }),
                    )
                    updateNode(child)
                  }}
                  onMove={(data: any) => onMove(data)}
                ></Dragging>
              </MenuBox>
            </AffairTypeWrap>
          ))}
        </div>
      </WrapSet>
      <EditCategory
        onClose={() => setIsVisible(false)}
        onUpdate={() => getList('add')}
        item={null}
        isVisible={isVisible}
      />
    </AllWrap>
  )
}

export default ProjectDetailSide
