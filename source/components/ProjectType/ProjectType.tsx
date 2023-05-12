/* eslint-disable no-negated-condition */
import React from 'react'
import { Wrap } from './style'
import type1 from '/project_type1.png'
import type2 from '/project_type2.png'
import type1_en from '/en_project_type1.png'
import type2_en from '/en_project_type2.png'
import { useSelector } from '@store/index'
import { useTranslation } from 'react-i18next'

const ProjectType = () => {
  const [t, { language: isRefresh }] = useTranslation()

  const arr = [
    { id: 1, img: type1, en_img: type1_en },
    { id: 2, img: type2, en_img: type2_en },
  ]
  return (
    <div style={{ display: 'flex', gap: '64px' }}>
      {arr.map((i: any) => (
        <Wrap bb={isRefresh === 'en'} key={i.id}>
          <img
            style={{
              width: '100%',
            }}
            src={isRefresh === 'zh' ? i.img : i.en_img}
            alt=""
          />
        </Wrap>
      ))}
    </div>
  )
}

export default ProjectType
