// 项目二级菜单
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
import CommonIconFont from '@/components/CommonIconFont'
import { getProjectInfo, getProjectInfoValues } from '@/services/project'
import { getCategorySaveSort } from '@/services/demand'
import { getParamsData } from '@/tools'
import { useDispatch, useSelector } from '@store/index'
import { setProjectInfo, setProjectInfoValues } from '@store/project'
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
  Tabs,
} from './style'
import Dragging from './Dragging'
import { setStartUsing } from '@store/category'
// eslint-disable-next-line no-duplicate-imports
import { getCategoryConfigList } from '@store/category/thunk'
import { setActiveCategory } from '@store/category/index'
import styled from '@emotion/styled'
import IconFont from '@/components/IconFont'
const IconFontStyle = styled(IconFont)({
  color: 'var(--neutral-n2)',
  fontSize: '18px',
  borderRadius: '6px',
  padding: '5px',
  '&: hover': {
    background: 'var(--hover-d1)',
    cursor: 'pointer',
  },
})
const ProjectDetailSide = (props: { onClick(): void }) => {
  const [t] = useTranslation()
  const { startUsing, categoryList } = useSelector(store => store.category)
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
  // 监听跟新
  const watchDataList = () => {
    let dataItem = null
    if (startUsing) {
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
    dispatch(setActiveCategory(dataItem.find((el: any) => el.active)))
    setList(dataItem)
  }
  // 需求类别中间列表
  const getCategoryConfig = async (dataItem: any) => {
    const itemId = dataItem?.find((item: any) => item.active)?.id
    watchDataList()
    if (itemId && projectId) {
      await dispatch(
        getCategoryConfigList({
          projectId: projectId,
          categoryId: itemId,
        }),
      )
    }
  }

  useEffect(() => {
    getList()
    getInfo()
    getProjectInfoValuesData()
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
    let dataItem = null
    if (startUsing) {
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
    getCategoryConfig(dataItem)
    dispatch(setActiveCategory(dataItem.find((el: any) => el.active)))
  }, [startUsing, categoryList])
  // 切换tab
  const getTabsActive = async (index: any) => {
    dispatch(setStartUsing(index === 0 ? true : false))
    setTabsActive(index)
    watchDataList()
  }
  useEffect(() => {
    watchDataList()
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
          {/*  type="plus"
            color="var(--neutral-n2)"
            onClick={() => 123 */}
          <IconFontStyle type="plus" />
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
            onClick={(i: number, child: any) => {
              dispatch(
                getCategoryConfigList({
                  projectId: projectId,
                  categoryId: child.id,
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
        item={null}
        isVisible={isVisible}
      />
    </AllWrap>
  )
}

export default ProjectDetailSide
