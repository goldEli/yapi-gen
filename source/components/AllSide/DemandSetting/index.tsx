// 项目二级菜单
import CommonIconFont from '@/components/CommonIconFont'
import {
  getProjectInfo,
  getProjectInfoValues,
  storyConfigCategoryList,
} from '@/services/project'
import { getParamsData } from '@/tools'
import { useDispatch, useSelector } from '@store/index'
import { setProjectInfo, setProjectInfoValues } from '@store/project'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import EditCategory from './EditCategory'
import {
  AllWrap,
  MenuBox,
  MenuItem,
  Provider,
  SideFooter,
  SideInfo,
  SideTop,
  WrapSet,
  BackStyle,
  TitleStyle,
  Tabs,
} from './style'
import Dragging from './Dragging'

import { setStartUsing } from '@store/demand'
const ProjectDetailSide = (props: { leftWidth: number }) => {
  const [t] = useTranslation()
  const { startUsing } = useSelector(store => store.demand)
  const projectSide: any = useRef<HTMLInputElement>(null)
  const projectSetSide: any = useRef<HTMLInputElement>(null)
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData?.id
  const { projectInfo } = useSelector(store => store.project)
  const [tabsActive, setTabsActive] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [dataList, setDataList] = useState<any>()
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
  const getList = async () => {
    const data = await storyConfigCategoryList({ projectId: paramsData.id })
    const newList: any = data.list.map((el: any, index: any) => ({
      ...el,
      active: index === 0 ? true : false,
    }))
    setDataList(newList)
  }
  useEffect(() => {
    getInfo()
    getProjectInfoValuesData()
    getList()
  }, [])

  //   返回上一页
  const onGoBack = () => {
    projectSetSide.current.style.width = '0px'
    projectSide.current.style.width = `${props.leftWidth}px`
    setTimeout(() => {
      projectSetSide.current.style.display = 'none'
    }, 200)
  }

  const onChange = (item: any) => {
    const newList: any = list?.map((el: any) => ({
      ...el,
      active: item.name === el.name ? true : false,
    }))
    setList(newList)
  }
  useEffect(() => {
    setTabsActive(startUsing ? 0 : 1)
    if (startUsing) {
      setList(dataList?.filter((el: any) => el.status === 1))
    } else {
      setList(dataList?.filter((el: any) => el.status !== 1))
    }
  }, [startUsing, dataList])
  return (
    <AllWrap>
      <WrapSet>
        <SideTop>
          <img src={projectInfo.cover} alt="" />
          <SideInfo>
            <div>{projectInfo.name}</div>
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
              onClick={() => {
                setTabsActive(index)
                dispatch(setStartUsing(index === 0 ? true : false))
              }}
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
            onChange={(item: any) => onChange(item)}
          ></Dragging>
        </MenuBox>
      </WrapSet>
      <EditCategory
        onClose={() => setIsVisible(false)}
        onUpdate={() => '99'}
        isVisible={isVisible}
      />
    </AllWrap>
  )
}

export default ProjectDetailSide
