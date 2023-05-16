/* eslint-disable react/jsx-handler-names */
/* eslint-disable no-negated-condition */
import React from 'react'
import { MyBtn, Wrap } from './style'
import type1 from '/project_type1.png'
import type2 from '/project_type2.png'
import type1_en from '/en_project_type1.png'
import type2_en from '/en_project_type2.png'
import { useSelector } from '@store/index'
import { useTranslation } from 'react-i18next'
import IconFont from '../IconFont'
import CommonIconFont from '../CommonIconFont'

const ProjectType = (props: any) => {
  const [t, { language: isRefresh }] = useTranslation()

  const arr = [
    { id: 1, img: type1, en_img: type1_en, type: 1 },
    { id: 2, img: type2, en_img: type2_en, type: 2 },
  ]
  return (
    <div style={{ display: 'flex', gap: '64px' }}>
      {arr.map((i: any) => (
        <Wrap type={props.type === i.id} bb={isRefresh === 'en'} key={i.id}>
          <img
            style={{
              width: '100%',
            }}
            src={isRefresh === 'zh' ? i.img : i.en_img}
            alt=""
          />
          <MyBtn onClick={() => props.choose(i.type)} type={i.type === 1}>
            使用类型
            <CommonIconFont
              type="right-md"
              size={20}
              color="var(--auxiliary-text-t1-d1)"
            />
          </MyBtn>
        </Wrap>
      ))}
    </div>
  )
}

export default ProjectType
