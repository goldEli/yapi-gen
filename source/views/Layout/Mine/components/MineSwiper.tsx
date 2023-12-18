// 我的模块-项目swiper

import { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import SwiperCard from './SwiperCard'
import { useTranslation } from 'react-i18next'
import styled from '@emotion/styled'
import { getMessage } from '@/components/Message'

export const SwiperWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: start;
  box-sizing: border-box;
  padding: 0 24px;
  height: 90px;
  background-color: var(--neutral-white-d2);
  overflow: hidden;
  & .swiper {
    overflow: visible;
    margin: 0;
  }
  & .swiper-wrapper {
    max-width: 1400px;
    width: 100%;
    display: flex;
  }
  & .swiper-slide {
    width: auto !important;
    /* border:1px solid var(--neutral-n6-d1); */
    border-radius: 6px;
  }
`

const SwiperBox = styled.div`
  margin-top: 16px;
  padding: 16px 24px 0 24px;
  width: 100%;
  background: var(--neutral-n8);
  overflow: hidden;
`

const SwiperCardMove = (props: any) => {
  const [t] = useTranslation()
  const { data, onTap } = props
  const [swiperActive, setSwiperActive] = useState('all')

  const onClickProject = (item: any) => {
    if (item?.is_public !== 1 && !item.user_ismember) {
      getMessage({ msg: t('common.notCheckInfo'), type: 'warning' })
    } else {
      setSwiperActive(item.id)
      onTap(item.id)
    }
  }

  return (
    <SwiperWrap>
      <SwiperBox>
        <Swiper
          spaceBetween={16}
          freeMode
          grabCursor
          observer
          observeParents
          slidesPerView={6}
        >
          <SwiperSlide key={1}>
            <SwiperCard
              all
              name={t('mine.allProject')}
              avtar=""
              tap={() => {
                setSwiperActive('all')
                onTap(0)
              }}
              show={swiperActive === 'all'}
            />
          </SwiperSlide>
          {data.map((item: any) => {
            return (
              <SwiperSlide key={item.id}>
                <SwiperCard
                  project_type={item.project_type}
                  permission_type={item.permission_type}
                  name={item.name}
                  avtar={item.cover}
                  tap={() => {
                    onClickProject(item)
                  }}
                  show={swiperActive === item.id}
                />
              </SwiperSlide>
            )
          })}
        </Swiper>
      </SwiperBox>
    </SwiperWrap>
  )
}

export default SwiperCardMove
