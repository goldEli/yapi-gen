/* eslint-disable prefer-named-capture-group */
/* eslint-disable require-unicode-regexp */
import React, { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { useNavigate } from 'react-router-dom'
import { css } from '@emotion/css'
import { ChartsItem, SecondTitle } from '@/components/StyleCommon'
import { Line } from '@ant-design/plots'
import { Timeline } from 'antd'
import Gatte from './components/Gatte'

const titleNumberCss = css`
  color: rgba(67, 186, 154, 1);
  font-size: 24px;
`
const titleNumberCss2 = css`
  color: rgba(250, 151, 70, 1);
  font-size: 24px;
`
const titleNumberCss3 = css`
  color: rgba(67, 186, 154, 1);
  font-size: 24px;
`
const titleTextCss = css`
  color: rgba(40, 119, 255, 1);
  font-size: 12px;
`
const StyledWrap = styled.div`
  height: 400px;
  padding: 16px;
  display: flex;
  gap: 17px;
`
const Head = styled.div`
  box-sizing: border-box;
  padding: 24px;
  background: rgba(255, 255, 255, 1);
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 24px;
  flex: 1;
`
const HeadLeft = styled.div`
  /* flex: 2; */
`
const HeadRight = styled.div`
  /* flex: 3; */
`
const Center = styled.div`
  display: flex;
  flex: 2;
`

const CenterRight = styled.div`
  box-sizing: border-box;
  padding: 24px;
  flex: 1;
  background: rgba(255, 255, 255, 1);
  border-radius: 6px;
`
const InnerWrap = styled.div`
  margin-top: 16px;
  height: 88px;
  background: rgba(255, 255, 255, 1);
  background-blend-mode: normal;
  border: 1px solid rgba(235, 237, 240, 1);
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 16px 24px 16px 24px;
  border-radius: 6px;
`

const TimeLineWrap = styled.div`
  box-sizing: border-box;
  padding: 10px 10px;
  margin-top: 10px;
  overflow-y: scroll;

  height: 300px;
`
const LineItem = styled.div`
  width: 360px;
  display: flex;
  justify-content: space-between;
`
const GatteWrap = styled.div`
  background: #f5f7fa;
  box-sizing: border-box;
  padding: 0 16px;
`
const Profile = () => {

  // const [state, setState] = useState()
  // const navigate = useNavigate()
  const tap = () => {

    //
  }
  return (
    <>
      <StyledWrap>
        <Head>
          <HeadLeft>
            <SecondTitle>基本高考</SecondTitle>
            <InnerWrap>
              <ChartsItem>
                <span className={titleNumberCss}>16</span>
                <span className={titleTextCss}>公司项目</span>
              </ChartsItem>
              <ChartsItem>
                <span className={titleNumberCss}>16</span>
                <span className={titleTextCss}>公司项目</span>
              </ChartsItem>
              <ChartsItem>
                <span className={titleNumberCss}>16</span>
                <span className={titleTextCss}>公司项目</span>
              </ChartsItem>
            </InnerWrap>
          </HeadLeft>
          <HeadRight>
            <SecondTitle onClick={tap}>基本高考</SecondTitle>
            <InnerWrap>
              <ChartsItem>
                <span className={titleNumberCss}>16</span>
                <span className={titleTextCss}>公司项目</span>
              </ChartsItem>
              <ChartsItem>
                <span className={titleNumberCss}>16</span>
                <span className={titleTextCss}>公司项目</span>
              </ChartsItem>
              <ChartsItem>
                <span className={titleNumberCss}>16</span>
                <span className={titleTextCss}>公司项目</span>
              </ChartsItem>
              <ChartsItem>
                <span className={titleNumberCss}>16</span>
                <span className={titleTextCss}>公司项目</span>
              </ChartsItem>
              <ChartsItem>
                <span className={titleNumberCss}>16</span>
                <span className={titleTextCss}>公司项目</span>
              </ChartsItem>
            </InnerWrap>
          </HeadRight>
        </Head>
        <Center>
          <CenterRight>
            <SecondTitle>我的动态</SecondTitle>
            <TimeLineWrap>
              <Timeline>
                {[1, 2, 3, 4, 5, 6, 7, 8].map(item => (
                  <Timeline.Item key={item}>
                    <LineItem>
                      <span>2022-06-06 15:30</span>
                      <span style={{ color: 'rgba(40, 119, 255, 1)' }}>
                        流转【需求】状态到【已实现】
                      </span>
                    </LineItem>
                    <LineItem>
                      <span>项目名称xxxx</span>
                      <span>需求名称xxxx</span>
                    </LineItem>
                  </Timeline.Item>
                ))}
              </Timeline>
            </TimeLineWrap>
          </CenterRight>
        </Center>
      </StyledWrap>
      <GatteWrap>
        <SecondTitle>需求甘特图</SecondTitle>
        <Gatte />
      </GatteWrap>
    </>
  )
}

export default Profile
