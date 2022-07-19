import React, { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { useNavigate } from 'react-router-dom'
import { css } from '@emotion/css'
import { Column } from '@ant-design/plots'
import { ChartsItem, chartsTitle, ChartsWrap, HomeWrap, title1Css, title2Css, titleCss } from '@/components/StyleCommon'

const DemoColumn = () => {
  const data = [
    {
      type: '家具家电',
      sales: 38,
    },
    {
      type: '粮油副食',
      sales: 52,
    },
    {
      type: '生鲜水果',
      sales: 61,
    },
    {
      type: '美容洗护',
      sales: 145,
    },
    {
      type: '母婴用品',
      sales: 48,
    },
    {
      type: '进口食品',
      sales: 38,
    },
    {
      type: '食品饮料',
      sales: 38,
    },
    {
      type: '家庭清洁',
      sales: 38,
    },
  ]
  const config = {
    data,
    xField: 'type',
    yField: 'sales',
    label: {
      // 可手动配置 label 数据标签位置
      position: 'middle',
      // 'top', 'bottom', 'middle',
      // 配置样式
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    meta: {
      type: {
        alias: '类别',
      },
      sales: {
        alias: '销售额',
      },
    },
  }
  return <Column {...config} />
}

export default () => {
  const [state, setState] = useState()

  const navigate = useNavigate()

  useEffect(() => {}, [])
  return (
    <ChartsWrap>
      <div className={titleCss}>员工概况</div>
      <HomeWrap>
        <ChartsItem>
          <span className={title1Css}>16</span>
          <span className={title2Css}>公司项目</span>
        </ChartsItem>
        <ChartsItem>
          <span className={title1Css}>16</span>
          <span className={title2Css}>公司项目</span>
        </ChartsItem>
        <ChartsItem>
          <span className={title1Css}>16</span>
          <span className={title2Css}>公司项目</span>
        </ChartsItem>
        <ChartsItem>
          <span className={title1Css}>16</span>
          <span className={title2Css}>公司项目</span>
        </ChartsItem>
        <ChartsItem>
          <span className={title1Css}>16</span>
          <span className={title2Css}>公司项目</span>
        </ChartsItem>
      </HomeWrap>
      <div className={chartsTitle}>职位人数分布</div>
      <DemoColumn></DemoColumn>
    </ChartsWrap>
  )
}
