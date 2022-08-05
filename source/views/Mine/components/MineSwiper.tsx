import { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import { SwiperWrap } from '@/components/StyleCommon'
import SwiperCard from './SwiperCard'
import { useTranslation } from 'react-i18next'

const SwiperCardMove = (props: any) => {
  const [t] = useTranslation()
  const { data, onTap } = props
  const [swiperActive, setSwiperActive] = useState('all')

  return (
    <SwiperWrap>
      <Swiper
        spaceBetween={50}
        freeMode
        grabCursor
        observer
        observeParents
        slidesPerView={6}
      >
        <SwiperSlide key={1}>
          <SwiperCard
            name={t('mine.allProject')}
            avtar=""
            tap={() => {
              setSwiperActive('all')
              onTap(0)
            }}
            show={swiperActive === 'all'}
          />
        </SwiperSlide>
        {data.map((item: any) => (
          <SwiperSlide key={item.id}>
            <SwiperCard
              name={item.name}
              avtar={item.cover}
              tap={() => {
                setSwiperActive(item.id)
                onTap(item.id)
              }}
              show={swiperActive === item.id}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </SwiperWrap>
  )
}

export default SwiperCardMove
