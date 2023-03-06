// 项目二级菜单
import CommonIconFont from '@/components/CommonIconFont'
import { getProjectInfo, getProjectInfoValues } from '@/services/project'
import { getCategorySaveSort } from '@/services/demand'
import { getParamsData } from '@/tools'
import { useDispatch, useSelector } from '@store/index'
import { setProjectInfo, setProjectInfoValues } from '@store/project'
import { useEffect, useRef, useState } from 'react'
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
  Tabs,
} from './style'
import Dragging from './Dragging'
import { setStartUsing } from '@store/category'
// eslint-disable-next-line no-duplicate-imports
import { getCategoryConfigList } from '@store/category/thunk'
import { setActiveCategory } from '@store/category/index'

const ProjectDetailSide = (props: { onClick(): void }) => {
  const [t] = useTranslation()
  const { startUsing, categoryList, activeCategory } = useSelector(
    store => store.category,
  )
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData?.id
  const { projectInfo } = useSelector(store => store.project)
  const [tabsActive, setTabsActive] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [list, setList] = useState<any>()
  const tabs = [
    {
      label: '启用',
    },
    {
      label: '未启用',
    },
  ]

  const getProjectInfoValuesData = async () => {
    const result = await getProjectInfoValues({ projectId })
    dispatch(setProjectInfoValues(result))
  }

  // 获取项目信息
  const getInfo = async () => {
    const result = await getProjectInfo({ projectId })
    dispatch(setProjectInfo(result))
  }
  // 需求类别侧边栏
  const getList = async () => {
    await dispatch(storyConfigCategoryList({ projectId: paramsData.id }))
  }
  // 需求类别中间列表
  const getCategoryConfig = async (dataItem: any) => {
    const itemId = dataItem?.find((item: any) => item.active)?.id
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
    getInfo()
    getProjectInfoValuesData()
    getList()
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
  useEffect(() => {
    setTabsActive(startUsing ? 0 : 1)
    if (list?.length >= 1) {
      getCategoryConfig(list)
      dispatch(setActiveCategory(list.find((item: any) => item.active)))
    }
  }, [startUsing])
  const getTabsActive = async (index: any) => {
    dispatch(setStartUsing(index === 0 ? true : false))
    setTabsActive(index)
  }
  useEffect(() => {
    let dataItem = null
    if (tabsActive) {
      dataItem = categoryList
        ?.filter((el: any) => el.status === 1)
        .map((el: any, index: number) => ({
          ...el,
          active: index === 0 ? true : false,
        }))
    } else {
      dataItem = categoryList
        ?.filter((el: any) => el.status !== 1)
        .map((el: any, index: number) => ({
          ...el,
          active: index === 0 ? true : false,
        }))
    }
    setList(dataItem)
  }, [categoryList])
  return (
    <AllWrap>
      <WrapSet>
        <SideTop>
          <img src={projectInfo?.cover} alt="" />
          <SideInfo>
            <div>{projectInfo?.name}</div>
            <span> 团队项目 </span>
          </SideInfo>
        </SideTop>
        <BackStyle onClick={onGoBack}>
          <CommonIconFont type="left-md" onClick={onGoBack} />
          <span>返回</span>
        </BackStyle>
        <Provider />
        <TitleStyle onClick={() => setIsVisible(true)}>
          <span>需求类别</span>{' '}
          <CommonIconFont
            type="plus"
            color="var(--neutral-n2)"
            onClick={() => 123}
          />
        </TitleStyle>
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
        <MenuBox>
          <Dragging
            list={list}
            setList={setList}
            onClick={(i: number) => {
              dispatch(
                getCategoryConfigList({
                  projectId: projectId,
                  categoryId: activeCategory.id,
                }),
              ),
                setList(
                  list.map((el: any, index: any) => ({
                    ...el,
                    active: i === index ? true : false,
                  })),
                )
            }}
            onMove={(data: any) => onMove(data)}
          ></Dragging>
        </MenuBox>
      </WrapSet>
      <EditCategory
        onClose={() => setIsVisible(false)}
        onUpdate={() => getList()}
        isVisible={isVisible}
      />
    </AllWrap>
  )
}

export default ProjectDetailSide
