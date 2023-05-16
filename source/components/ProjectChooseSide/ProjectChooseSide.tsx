import React, { useState } from 'react'
import { Liu, People, ScaleDiv, Side } from './style'
import CommonButton from '../CommonButton'
import { TitleStyle } from '@/views/DemandSetting/components/Main'
import CommonIconFont from '../CommonIconFont'
import CommonUserAvatar from '../CommonUserAvatar'

const ProjectChooseSide = (props: any) => {
  const [infoIcon, setInfoIcon] = useState(true)
  const [infoIcon2, setInfoIcon2] = useState(true)
  return (
    <Side op={props.op}>
      <div className="t1">从XXXX项目导入工作流</div>
      <div
        style={{
          overflowY: 'auto',
          height: 'calc( 100% - 100px)',
        }}
      >
        <div>
          <TitleStyle onClick={() => setInfoIcon(!infoIcon)}>
            <CommonIconFont
              type={infoIcon ? 'down-icon' : 'right-icon'}
              size={14}
              color="var(--neutral-n3)"
            />

            <span style={{ marginLeft: '8px' }}>工作流</span>
          </TitleStyle>
          <ScaleDiv hi={!infoIcon}>
            {Array(3)
              .fill(null)
              .map((i: any) => (
                <Liu key={i}>
                  <div className="l1">
                    <CommonIconFont
                      type="colorDOC-76p4mioh"
                      size={18}
                      color="var(--neutral-n3)"
                    />
                    3D设计
                  </div>
                  <div className="l2">
                    【规划中】-【设计中】-【评审中...6个流程
                  </div>
                </Liu>
              ))}
          </ScaleDiv>
        </div>
        <div>
          <TitleStyle onClick={() => setInfoIcon2(!infoIcon2)}>
            <CommonIconFont
              type={infoIcon2 ? 'down-icon' : 'right-icon'}
              size={14}
              color="var(--neutral-n3)"
            />

            <span style={{ marginLeft: '8px' }}>项目成员（50）</span>
          </TitleStyle>
          <ScaleDiv hi={!infoIcon2}>
            {Array(2)
              .fill(null)
              .map((i: any) => (
                <People key={i}>
                  <div>
                    <CommonUserAvatar size="large" />
                  </div>
                  <div className="p2">
                    <span className="p11">李四的工作日报</span>
                    <span className="p12">0px</span>
                  </div>
                </People>
              ))}
          </ScaleDiv>
        </div>
      </div>

      <div className="btn">
        <CommonButton type="primary" onClick={props?.onClose}>
          重新选择
        </CommonButton>
      </div>
    </Side>
  )
}

export default ProjectChooseSide
