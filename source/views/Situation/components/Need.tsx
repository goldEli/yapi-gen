/* eslint-disable prefer-named-capture-group */
/* eslint-disable require-unicode-regexp */
import React, { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { useNavigate } from 'react-router-dom'
import { css } from '@emotion/css'
import { Line } from '@ant-design/plots'
import {
  ChartsItem,
  chartsTitle,
  ChartsWrap,
  HightChartsWrap,
  HomeWrap,
  TextBlueWrap,
  TextWrap,
  title1Css,
  title2Css,
  titleCss,
} from '@/components/StyleCommon'

const DemoLine = () => {
  const [data, setData] = useState([])

  const asyncFetch = () => {
    fetch(
      'https://gw.alipayobjects.com/os/bmw-prod/55424a73-7cb8-4f79-b60d-3ab627ac5698.json',
    )
      .then(response => response.json())
      .then(json => setData(json))
  }

  useEffect(() => {
    asyncFetch()
  }, [])

  const config = {
    data,
    xField: 'year',
    yField: 'value',
    seriesField: 'category',
    xAxis: {
      type: 'time',
    },
    yAxis: {
      label: {

        // 数值格式化为千分位
        formatter: (v: any) => String(v).replace(/\d{1,3}(?=(\d{3})+$)/g, s => `${s},`),
      },
    },
  }

  return <Line {...config} />
}

const Need = () => {
  const [state, setState] = useState()
  const navigate = useNavigate()

  return (
    <ChartsWrap>
      <div className={titleCss}>需求概况</div>
      <TextWrap>
        <TextBlueWrap>
          <ChartsItem>
            <span className={title1Css}>16</span>
            <span className={title2Css}>公司项目</span>
          </ChartsItem>
        </TextBlueWrap>
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
      </TextWrap>
      <div className={chartsTitle}>需求累计图</div>
      <HightChartsWrap>
        <DemoLine />
      </HightChartsWrap>
    </ChartsWrap>
  )
}

export default Need
