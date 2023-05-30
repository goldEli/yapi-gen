import React, { useEffect, useState } from 'react'
import { Liu, People, ScaleDiv, Side } from './style'
import CommonButton from '../CommonButton'
import { TitleStyle } from '@/views/DemandSetting/components/Main'
import CommonIconFont from '../CommonIconFont'
import CommonUserAvatar from '../CommonUserAvatar'
import { getProjectInfoOnly } from '@/services/project'
import { spawn } from 'child_process'

const ProjectChooseSide = (props: any) => {
  const [infoIcon, setInfoIcon] = useState(true)
  const [infoIcon2, setInfoIcon2] = useState(true)
  const [info, setInfo] = useState<any>()

  const init = async () => {
    if (props.cloneIds[0]) {
      const res = await getProjectInfoOnly(props.cloneIds[0], true)

      setInfo({
        name: res.name,
        category_list: res.category_list,
        member_list: res.member_list,
      })
    }
  }

  useEffect(() => {
    init()
    console.log(props.cloneIds, '克隆ID')
  }, [props.cloneIds])

  return (
    <Side op={props.op}>
      <div className="t1">从{info?.name}导入工作流</div>
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
            {info?.category_list.map((i: any) => (
              <Liu key={i.id}>
                <div className="l1">
                  <img
                    style={{
                      width: '18px',
                      height: '18px',
                    }}
                    src={i.attachment_id}
                    alt=""
                  />
                  {/* <CommonIconFont
                    type="colorDOC-76p4mioh"
                    size={18}
                    color="var(--neutral-n3)"
                  /> */}
                  {i.name}
                </div>
                <div className="l2">
                  {i.status_list.map((k: any) => (
                    <span key={k.id}>【{k.content}】-</span>
                  ))}
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

            <span style={{ marginLeft: '8px' }}>
              项目成员（{info?.member_list.length}）
            </span>
          </TitleStyle>
          <ScaleDiv hi={!infoIcon2}>
            {info?.member_list.map((i: any) => (
              <People key={i.id}>
                <div>
                  <CommonUserAvatar size="large" />
                </div>
                <div className="p2">
                  <span className="p11">{i.name}</span>
                  <span className="p12">{i.role_name}</span>
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
