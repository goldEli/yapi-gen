import { Progress, Tooltip } from 'antd'
import React from 'react'
import CustomDropdown from '../CustomDropdown'
import IconFont from '../IconFont'
import {
  ProjectCard,
  Wrap,
  Image,
  CardRight,
  TransformWrap,
  ShowWrap,
  ProgressWrap,
  CardRightFirst,
  CardRightSecond,
  HoverIcon,
  EndTag,
} from './style'

const TextOfIcon = (props: any) => (
  <Tooltip placement="bottom" title={props.text}>
    <div>
      <IconFont type={props.type} />
      <span
        style={{
          marginLeft: '5px',
        }}
      >
        {props.num}
      </span>
    </div>
  </Tooltip>
)
const arr = [
  {
    type: 'my',
    num: '12',
    text: '项目人数',
  },
  {
    type: 'project',
    num: '12',
    text: '项目人数',
  },
  {
    type: 'm1y',
    num: '12',
    text: '项目人数',
  },
]

const ProjectManagementOptimization = () => {
  const row = new Array(10).fill(1)
  return (
    <div>
      <Wrap>
        {row.map(item => (
          <ProjectCard key={item}>
            <Image src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg" />

            <CardRight>
              <Tooltip
                arrowPointAtCenter
                autoAdjustOverflow={false}
                placement="top"
                title=" 跑酷跑酷美术项目跑酷美术项目跑酷美术项目跑酷美术项目美术项目"
              >
                <CardRightFirst>
                  跑酷跑酷美术项目跑酷美术项目跑酷美术项目跑酷美术项目美术项目
                </CardRightFirst>
              </Tooltip>

              <CardRightSecond>负责人：王富贵</CardRightSecond>
              <CardRightSecond>键：DXKJ</CardRightSecond>
              <TransformWrap>
                <ProgressWrap>
                  <Progress
                    size="small"
                    strokeColor="#43ba9a"
                    strokeWidth={4}
                    percent={30}
                  />
                </ProgressWrap>

                <ShowWrap>
                  {arr.map((i: any) => (
                    <TextOfIcon
                      key={i.type}
                      type={i.type}
                      text={i.text}
                      num={i.num}
                    />
                  ))}
                </ShowWrap>
              </TransformWrap>
            </CardRight>
            <CustomDropdown>
              <HoverIcon>
                <IconFont type="more" />
              </HoverIcon>
            </CustomDropdown>
            <EndTag>End</EndTag>
          </ProjectCard>
        ))}
      </Wrap>
    </div>
  )
}

export default ProjectManagementOptimization
