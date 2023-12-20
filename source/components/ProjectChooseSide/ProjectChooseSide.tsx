import React, { useEffect, useState } from 'react'
import { Liu, People, ScaleDiv, Side } from './style'
import CommonButton from '../CommonButton'
import CommonIconFont from '../CommonIconFont'
import CommonUserAvatar from '../CommonUserAvatar'
import { getProjectInfoOnly } from '@/services/project'
import { useTranslation } from 'react-i18next'
import { TitleStyle } from '@/views/TypeConfiguration/style'

const ProjectChooseSide = (props: any) => {
  const [t] = useTranslation()
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
  }, [props.cloneIds])

  return (
    <Side op={props.op}>
      <div
        style={{
          fontFamily: 'SiYuanMedium',
        }}
        className="t1"
      >
        {t('other.formImportWork', { name: info?.name })}
      </div>
      <div
        style={{
          overflowY: 'auto',
          height: 'calc( 100% - 100px)',
        }}
      >
        9999999999999999
        <div>
          <TitleStyle onClick={() => setInfoIcon(!infoIcon)}>
            <CommonIconFont
              type={infoIcon ? 'down-icon' : 'right-icon'}
              size={14}
              color="var(--neutral-n3)"
            />

            <span style={{ marginLeft: '8px', fontFamily: 'SiYuanMedium' }}>
              {t('other.workFlow')}
            </span>
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

                  {i.name}
                </div>
                <div className="l2">
                  {i.status_list.map((k: any, index: any) => (
                    <span key={k.id}>
                      【{k.content}】
                      {i.status_list.length === index + 1 ? '' : '-'}
                    </span>
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

            <span style={{ marginLeft: '8px', fontFamily: 'SiYuanMedium' }}>
              {t('project.projectMemberAll', {
                count: info?.member_list.length,
              })}
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

      <div style={{ zIndex: '900000' }} className="btn">
        <CommonButton type="primary" onClick={() => props.onClose()}>
          {t('newlyAdd.aginChoose')}
        </CommonButton>
      </div>
    </Side>
  )
}

export default ProjectChooseSide
