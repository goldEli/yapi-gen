import { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import { SwiperWrap } from '@/components/StyleCommon'
import SwiperCard from './SwiperCard'

const SwiperCardMove = (props: any) => {
  const { data, onTap } = props
  const [swiperActive, setSwiperActive] = useState(1)

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
            name="所有项目"
            avtar=""
            tap={() => {
              setSwiperActive(1)
              onTap(0)
            }}
            show={swiperActive === 1}
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
