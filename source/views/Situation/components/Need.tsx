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

const DemoLine = (props: any) => {
  const { data: res } = props

  const config = {
    data: res,
    xField: 'month',
    yField: 'value',
    seriesField: 'category',
    xAxis: {
      type: 'time',
    },
    yAxis: {
      label: {},
    },
  }
  if (res) {
    return <Line {...config} />
  }
  return null
}

const Need = (props: any) => {
  const { data } = props

  return (
    <ChartsWrap>
      <div className={titleCss}>需求概况</div>
      <TextWrap>
        <TextBlueWrap>
          <ChartsItem>
            <span className={title1Css}>{data?.total}</span>
            <span className={title2Css}>创建需求</span>
          </ChartsItem>
        </TextBlueWrap>
        <HomeWrap>
          <ChartsItem>
            <span className={title1Css}>{data?.planningTotal}</span>
            <span className={title2Css}>未开始</span>
          </ChartsItem>
          <ChartsItem>
            <span className={title1Css}>{data?.ongoingTotal}</span>
            <span className={title2Css}>进行中</span>
          </ChartsItem>
          <ChartsItem>
            <span className={title1Css}>{data?.endTotal}</span>
            <span className={title2Css}>已结束</span>
          </ChartsItem>
        </HomeWrap>
      </TextWrap>
      <div className={chartsTitle}>需求累计图</div>
      <HightChartsWrap>
        <DemoLine data={data?.chartsData} />
      </HightChartsWrap>
    </ChartsWrap>
  )
}

export default Need
