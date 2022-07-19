import React, { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { useNavigate } from 'react-router-dom'
import { css } from '@emotion/css'
import { Column } from '@ant-design/plots'

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
const titleCss = css`
  color: rgba(0, 0, 0, 1);
  font-size: 14px;
`
const title1Css = css`
  color: rgba(40, 119, 255, 1);
  font-size: 24px;
`
const title2Css = css`
  color: rgba(100, 101, 102, 1);
  font-size: 12px;
`
const Wrap = styled.div`
  background-color: #ffffff;
  box-sizing: border-box;
  padding: 16px 24px;
`
const HomeWrap = styled.div`
  height: 104px;
  border: 1px solid rgba(235, 237, 240, 1);
  border-radius: 6px;
  margin-bottom: 24px;
  margin-top: 16px;
  display: flex;
  justify-content: space-around;
  align-items: center;
`
const Item = styled.span`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`
export default () => {
  const [state, setState] = useState()

  const navigate = useNavigate()

  useEffect(() => {}, [])
  return (
    <Wrap>
      <div className={titleCss}>项目概况</div>
      <HomeWrap>
        <Item>
          <span className={title1Css}>16</span>
          <span className={title2Css}>公司项目</span>
        </Item>
        <Item>
          <span className={title1Css}>16</span>
          <span className={title2Css}>公司项目</span>
        </Item>
        <Item>
          <span className={title1Css}>16</span>
          <span className={title2Css}>公司项目</span>
        </Item>
        <Item>
          <span className={title1Css}>16</span>
          <span className={title2Css}>公司项目</span>
        </Item>
        <Item>
          <span className={title1Css}>16</span>
          <span className={title2Css}>公司项目</span>
        </Item>
        <Item>
          <span className={title1Css}>16</span>
          <span className={title2Css}>公司项目</span>
        </Item>
      </HomeWrap>
      <DemoColumn></DemoColumn>
    </Wrap>
  )
}
