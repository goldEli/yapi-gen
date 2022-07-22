import React, { useState } from 'react'
import styled from '@emotion/styled'
import { useNavigate } from 'react-router-dom'
import { css } from '@emotion/css'
import {
  StaffHeader,
  TabsItem,
  TabsHehavior,
  LabNumber,
  tabCss,
  SwiperWrap,
} from '@/components/StyleCommon'
import Need from './components/Need'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import SwiperCard from '../components/SwiperCard'

// const Bcss = css`
//   border: 1px solid blue;
//   transform: translate(0, -10%);
// `

const tabsList = [{ name: '抄送我的', type: 2, path: 'need' }]

const Agenda = () => {
  const [swiperActive, setSwiperActive] = useState(1)
  const active = 2
  const navigate = useNavigate()

  return (
    <div>
      <StaffHeader>抄送我的</StaffHeader>
      <SwiperWrap>
        <Swiper
          spaceBetween={50}
          freeMode
          grabCursor
          observer
          observeParents
          slidesPerView={6}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(item => (
            <SwiperSlide key={item}>
              <SwiperSlide key={item}>
                <SwiperCard
                  tap={() => setSwiperActive(item)}
                  show={swiperActive === item}
                />
              </SwiperSlide>
            </SwiperSlide>
          ))}
        </Swiper>
      </SwiperWrap>

      <TabsHehavior>
        {tabsList.map(i => (
          <div key={i.type} className={tabCss}>
            <TabsItem isActive={active === i.type}>
              <div>{i.name}</div>
            </TabsItem>
            <LabNumber isActive={active === i.type}>5</LabNumber>
          </div>
        ))}
      </TabsHehavior>

      {active === 2 && <Need />}
    </div>
  )
}

export default Agenda
