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

const tabsList = [
  { name: '创建的项目', type: 1 },
  { name: '创建的需求', type: 2 },
]
export default () => {
  const [active, setActive] = useState(1)

  useEffect(() => {}, [])

  return (
    <>
      <StaffHeader>我创建的</StaffHeader>
      <TabsHehavior>
        {tabsList.map(i => (
          <div
            key={i.type}
            onClick={() => setActive(i.type)}
            className={tabCss}
          >
            <TabsItem isActive={active === i.type}>
              <div>{i.name}</div>
            </TabsItem>
            <LabNumber isActive={active === i.type}>5</LabNumber>
          </div>
        ))}
      </TabsHehavior>
      <Preijct></Preijct>
    </>
  )
}
