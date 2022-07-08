/* eslint-disable react/jsx-no-literals */
import React, { useState } from 'react'
import TotalCard from '@/components/TotalCard'
import CompanyModal from '@/components/CompanyModal'
import ProjectCard from '@/components/ProjectCard'
import IterationCard from '@/components/IterationCard'
import { Button } from 'antd'
import DemandCard from '@/components/DemandCard'
import SearchComponent from '@/components/SearchComponent'
import OperationComponent from '@/components/OperationComponent'

export default () => {
  const [visible, setVisible] = useState(false)
  const item = {}
  return (
    <div style={{ padding: 24 }}>
      <Button onClick={() => setVisible(true)}>切换公司</Button>
      <CompanyModal visible={visible} onChangeState={() => setVisible(!visible)} />
      <TotalCard title="总计" number={100} />
      <ProjectCard item={item} />
      <IterationCard item={item} />
      <DemandCard item={item} />
      <OperationComponent />
    </div>
  )
}
