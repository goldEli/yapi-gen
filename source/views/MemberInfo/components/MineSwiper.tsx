// 他的模块-项目swiper

import { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import SwiperCard from './SwiperCard'
import { useTranslation } from 'react-i18next'
import { message } from 'antd'
import { SwiperWrap } from '@/views/Mine/components/MineSwiper'

const SwiperCardMove = (props: any) => {
  const [t] = useTranslation()
  const { data, onTap } = props
  const [swiperActive, setSwiperActive] = useState('all')

  const onClickProject = (item: any) => {
    if (item?.is_public !== 1 && !item.user_ismember) {
      message.warning(t('common.notCheckInfo'))
    } else {
      setSwiperActive(item.id)
      onTap(item.id)
    }
  }

  return (
    <SwiperWrap>
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
                onClickProject(item)
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
