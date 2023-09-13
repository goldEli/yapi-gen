/* eslint-disable react/jsx-handler-names */
/* eslint-disable no-negated-condition */
import React from 'react'
import { MyBtn, Wrap } from './style'
import { useSelector } from '@store/index'
import { useTranslation } from 'react-i18next'
import IconFont from '../IconFont'
import CommonIconFont from '../CommonIconFont'
import { Title } from '../ProjectTemplate/style'

const ProjectType = (props: any) => {
  const [t, { language: isRefresh }] = useTranslation()

  const arr = [
    {
      id: 2,
      img: 'https://mj-system-1308485183.cos.accelerate.myqcloud.com/public/project_type1.png',
      en_img:
        'https://mj-system-1308485183.cos.accelerate.myqcloud.com/public/en_project_type1.png',
      type: 2,
      hov: 0,
    },
    {
      id: 1,
      img: 'https://mj-system-1308485183.cos.accelerate.myqcloud.com/public/project_type2.png',
      en_img:
        'https://mj-system-1308485183.cos.accelerate.myqcloud.com/public/en_project_type2.png',
      type: 1,
      hov: 1,
    },
  ]
  return (
    <div>
      <Title
        style={{
          fontFamily: 'SiYuanMedium',
          marginBottom: '30px',
        }}
      >
        {t('select_project_type')}
      </Title>
      <div style={{ display: 'flex', gap: '64px' }}>
        {arr.map((i: any) => (
          <Wrap type={i.hov} bb={isRefresh === 'en'} key={i.id}>
            <img
              style={{
                width: '100%',
              }}
              src={isRefresh === 'zh' ? i.img : i.en_img}
              alt=""
            />
            <MyBtn onClick={() => props.choose(i.id)} type={i.type === 1}>
              {t('type_of_use')}
              <CommonIconFont
                type="right-md"
                size={20}
                color="var(--auxiliary-text-t1-d1)"
              />
            </MyBtn>
          </Wrap>
        ))}
      </div>
    </div>
  )
}

export default ProjectType
