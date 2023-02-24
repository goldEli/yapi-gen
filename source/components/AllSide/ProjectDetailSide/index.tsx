// 项目二级菜单

import CommonIconFont from '@/components/CommonIconFont'
import { getProjectInfo, getProjectInfoValues } from '@/services/project'
import { getParamsData } from '@/tools'
import { useDispatch } from '@store/index'
import { setProjectInfo, setProjectInfoValues } from '@store/project'
import { useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  AllWrap,
  MenuBox,
  MenuItem,
  Provider,
  SideFooter,
  SideInfo,
  SideTop,
  WrapSet,
  WrapDetail,
} from './style'

const ProjectDetailSide = (props: { leftWidth: number }) => {
  const projectSide: any = useRef<HTMLInputElement>(null)
  const projectSetSide: any = useRef<HTMLInputElement>(null)
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData.id

  const getProjectInfoValuesData = async () => {
    const result = await getProjectInfoValues({ projectId })
    dispatch(setProjectInfoValues(result))
  }

  // 获取项目信息
  const getInfo = async () => {
    const result = await getProjectInfo({ projectId })
    dispatch(setProjectInfo(result))
  }

  useEffect(() => {
    getInfo()
    getProjectInfoValuesData()
  }, [])

  //   点击项目设置
  const onChangeSet = () => {
    projectSide.current.style.width = '0px'
    projectSetSide.current.style.width = `${props.leftWidth}px`
    projectSetSide.current.style.display = 'block'
  }

  //   返回上一页
  const onGoBack = () => {
    projectSetSide.current.style.width = '0px'
    projectSide.current.style.width = `${props.leftWidth}px`
    setTimeout(() => {
      projectSetSide.current.style.display = 'none'
    }, 200)
  }

  return (
    <AllWrap>
      <WrapDetail ref={projectSide}>
        <SideTop>
          <img src="" alt="" />
          <SideInfo>
            <div>项目婚纱卡萨贺卡坎大哈看得开</div>
            <span>团队项目</span>
          </SideInfo>
        </SideTop>
        <Provider />
        <MenuBox>
          <MenuItem>
            <CommonIconFont
              type="settings"
              color="var(--neutral-n3)"
              size={18}
            />
            <div>需求</div>
          </MenuItem>
          <MenuItem>
            <CommonIconFont
              type="settings"
              color="var(--neutral-n3)"
              size={18}
            />
            <div>迭代</div>
          </MenuItem>
        </MenuBox>
        <SideFooter onClick={onChangeSet}>
          <div>
            <CommonIconFont
              type="settings"
              color="var(--neutral-n3)"
              size={18}
            />
            <div>项目设置</div>
          </div>
        </SideFooter>
      </WrapDetail>
      <WrapSet ref={projectSetSide}>
        <div>
          1212
          <span onClick={onGoBack}>返回上一页</span>
        </div>
      </WrapSet>
    </AllWrap>
  )
}

export default ProjectDetailSide
