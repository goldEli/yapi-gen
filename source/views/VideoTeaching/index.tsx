import React, { useEffect, useState } from 'react'
import { Content, ImageBox, InputBox, Wrap } from './style'
import { useNavigate } from 'react-router-dom'
import Header from './header'
import { Input } from 'antd'
import { encryptPhp } from '@/tools/cryptoPhp'
import { cloneDeep } from 'lodash'

const VideoTeaching = () => {
  const [data, setData] = useState<any>([])
  const [cacheData, setCacheData] = useState<any>([])
  const [value, setValue] = useState('')
  const [time, setTime] = useState('')
  useEffect(() => {
    fetch(
      `https://mj-system-1308485183.cos.ap-chengdu.myqcloud.com/tutorial/tutorial.json?date=${new Date().valueOf()}`,
    )
      .then(response => response.json())
      .then(data => {
        setData(data.list)
        setTime(data.update_at)
        const cacheData = cloneDeep(data.list)
        setCacheData(cacheData)
      })
  }, [])
  useEffect(() => {
    const data = cacheData.filter(
      (item: { text: string | string[] }) => item.text.indexOf(value) > -1,
    )
    setData(data)
  }, [value])
  const navigate = useNavigate()
  return (
    <Wrap>
      <Header time={time}></Header>
      <InputBox>
        <div className="title-box">
          <div className="title">iFUN Agile敏</div>
          <div className="sub-title">敏捷系统入门到精通视频教程</div>
        </div>
        <div className="input">
          <Input
            placeholder="搜索标题"
            onChange={e => {
              setValue(e.target.value)
            }}
            allowClear
          ></Input>
        </div>
      </InputBox>
      <Content windowWidth={window.innerWidth}>
        <ImageBox>
          {data.map((item: any, index: number) => (
            <div
              className="image-box"
              key={item.id}
              onClick={() => {
                const params = encryptPhp(
                  JSON.stringify({
                    data: item,
                    time,
                  }),
                )
                const url = `/videoTeachDetail?data=${params}`
                window.open(url)
              }}
            >
              <img src={item.imgUrl} alt="" />
              <span className="text">
                {item.id}:{item.text}
              </span>
            </div>
          ))}
        </ImageBox>
      </Content>
    </Wrap>
  )
}

export default VideoTeaching
