import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from '@emotion/styled'
import { useNavigate } from 'react-router-dom'
import { css } from '@emotion/css'
import {
  StaffHeader,
  Hehavior,
  PaginationWrap,
  StaffTableWrap,
  MyInput,
  SearchLine,
  SetButton,
  TabsItem,
  TabsHehavior,
  LabNumber,
  tabCss,
} from '@/components/StyleCommon'
import IconFont from '@/components/IconFont'
import { Button, Dropdown, Menu, Pagination, Table } from 'antd'
import { CheckboxValueType } from 'antd/lib/checkbox/Group'
import { useDynamicColumns } from './components/CreatePrejectTableColum'
import { OptionalFeld } from '@/components/OptionalFeld'
import Preijct from './components/Preijct'
import Need from './components/Need'
import SwiperCard from './components/SwiperCard'
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react'

// Import Swiper styles
import 'swiper/css'

const SwiperWrap = styled.div`
  /* width: 1000px; */
  box-sizing: border-box;
  padding: 24px;
  height: 144px;
  background-color: #f5f7fa;
`
const tabsList = [
  { name: '创建的项目', type: 1, path: 'project' },
  { name: '创建的需求', type: 2, path: 'need' },
]
export default () => {
  const [swiperActive, setSwiperActive] = useState(1)
  const [active, setActive] = useState(1)
  const navigate = useNavigate()
  useEffect(() => {}, [])
  const switchTo = (value: { name: string; type: number; path: string }) => {
    setActive(value.type)
    // navigate(`/create?type=${value.path}`)
  }
  return (
    <div>
      <StaffHeader>我创建的</StaffHeader>
      <SwiperWrap>
        <Swiper
          slideToClickedSlide
          spaceBetween={50}
          slidesPerView={6}
          grabCursor
          freeMode
          observer
          observeParents
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map(item => (
            <SwiperSlide key={item} style={{ minWidth: '162px',}}>
              <div
                onClick={() => setSwiperActive(item)}
                style={{
                  
                  border: swiperActive === item ? '1px solid red' : '',
                }}
              >
                <SwiperCard></SwiperCard>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </SwiperWrap>
      <TabsHehavior>
        {tabsList.map(i => (
          <div key={i.type} onClick={() => switchTo(i)} className={tabCss}>
            <TabsItem isActive={active === i.type}>
              <div>{i.name}</div>
            </TabsItem>
            <LabNumber isActive={active === i.type}>5</LabNumber>
          </div>
        ))}
      </TabsHehavior>
      {active === 1 && <Need></Need>}
      {active === 2 && <Preijct></Preijct>}
    </div>
  )
}
