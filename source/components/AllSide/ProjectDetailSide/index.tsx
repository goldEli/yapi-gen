// 项目二级菜单

import CommonIconFont from '@/components/CommonIconFont'
import { useRef } from 'react'
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
