import React, { useEffect } from 'react'
import Header from './header'
import { Bread, DetailWrap } from './style'
import { useSearchParams } from 'react-router-dom'
import CommonIconFont from '@/components/CommonIconFont'
import { getParamsData } from '@/tools'
const Detail = () => {
  const [searchParams] = useSearchParams()
  const { data, time } = getParamsData(searchParams)
  return (
    <DetailWrap>
      <Header time={time} />
      {/* <Bread>
        <span
          style={{ cursor: 'pointer' }}
          onClick={() => {
            history.go(-1)
          }}
        >
          <CommonIconFont type="return" color=" #6688ff"></CommonIconFont>
          <span className="back">返回</span>
        </span>
        <span className="devide">|</span>
        <span className="text">{data.text}</span>
      </Bread> */}
      <div className="content">
        <div className="title">{data.text}</div>
        <video
          src={data.url}
          controls
          autoPlay
          width="870px"
          height="584px"
        ></video>
      </div>
    </DetailWrap>
  )
}
export default Detail
