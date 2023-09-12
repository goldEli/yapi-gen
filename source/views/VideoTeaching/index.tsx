import React, { useEffect, useState } from 'react'
import { Content, ImageBox, InputBox, Wrap } from './style'
import { useNavigate } from 'react-router-dom'
import Header from './header'
import { Input } from 'antd'
import { encryptPhp } from '@/tools/cryptoPhp'
import { cloneDeep } from 'lodash'
const a = {
  update_at: '2023-09-12',
  list: [
    {
      url: 'https://mj-system-1308485183.cos.ap-chengdu.myqcloud.com/tutorial/1-如何登录Agile.mp4',
      id: 1,
      text: '如何登录Agile',
      imgUrl:
        'https://mj-system-1308485183.cos.ap-chengdu.myqcloud.com/tutorial/img/img01.jpg',
      update_at: '2023-09-12',
    },
    {
      url: 'https://mj-system-1308485183.cos.ap-chengdu.myqcloud.com/tutorial/2-如何选择项目.mp4',
      id: 2,
      text: '如何选择项目',
      imgUrl:
        'https://mj-system-1308485183.cos.ap-chengdu.myqcloud.com/tutorial/img/img02.jpg',
    },
    {
      url: 'https://mj-system-1308485183.cos.ap-chengdu.myqcloud.com/tutorial/3-如何创建项目.mp4',
      id: 3,
      text: '如何创建项目',
      imgUrl:
        'https://mj-system-1308485183.cos.ap-chengdu.myqcloud.com/tutorial/img/img03.jpg',
    },
    {
      url: 'https://mj-system-1308485183.cos.ap-chengdu.myqcloud.com/tutorial/4-如何上报工时.mp4',
      id: 4,
      text: '如何上报工时',
      imgUrl:
        'https://mj-system-1308485183.cos.ap-chengdu.myqcloud.com/tutorial/img/img04.jpg',
    },
    {
      url: 'https://mj-system-1308485183.cos.ap-chengdu.myqcloud.com/tutorial/5-如何使用工时统计.mp4',
      id: 5,
      text: '管理员如何使用工时统计',
      imgUrl:
        'https://mj-system-1308485183.cos.ap-chengdu.myqcloud.com/tutorial/img/img05.jpg',
    },
    {
      url: 'https://mj-system-1308485183.cos.ap-chengdu.myqcloud.com/tutorial/6-如何快速处理我的工作.mp4',
      id: 6,
      text: '如何快速处理我的工作',
      imgUrl:
        'https://mj-system-1308485183.cos.ap-chengdu.myqcloud.com/tutorial/img/img06.jpg',
    },
    {
      url: 'https://mj-system-1308485183.cos.ap-chengdu.myqcloud.com/tutorial/7-如何使用日报助手自动发送日报.mp4',
      id: 7,
      text: '如何使用日报助手自动发送日报',
      imgUrl:
        'https://mj-system-1308485183.cos.ap-chengdu.myqcloud.com/tutorial/img/img07.jpg',
    },
    {
      url: 'https://mj-system-1308485183.cos.ap-chengdu.myqcloud.com/tutorial/8-如何手动发送日报.mp4',
      id: 8,
      text: '如何手动发送日报',
      imgUrl:
        'https://mj-system-1308485183.cos.ap-chengdu.myqcloud.com/tutorial/img/img08.jpg',
    },
    {
      url: 'https://mj-system-1308485183.cos.ap-chengdu.myqcloud.com/tutorial/9-遇到问题如何反馈.mp4',
      id: 9,
      text: '遇到问题如何反馈',
      imgUrl:
        'https://mj-system-1308485183.cos.ap-chengdu.myqcloud.com/tutorial/img/img09.jpg',
    },
    {
      url: 'https://mj-system-1308485183.cos.ap-chengdu.myqcloud.com/tutorial/10-如何添加移除成员.mp4',
      id: 10,
      text: '如何添加移除成员',
      imgUrl:
        'https://mj-system-1308485183.cos.ap-chengdu.myqcloud.com/tutorial/img/img10.jpg',
    },
    {
      url: 'https://mj-system-1308485183.cos.ap-chengdu.myqcloud.com/tutorial/11-如何设置访问权限.mp4',
      id: 11,
      text: '如何设置访问权限',
      imgUrl:
        'https://mj-system-1308485183.cos.ap-chengdu.myqcloud.com/tutorial/img/img11.jpg',
    },
    {
      url: 'https://mj-system-1308485183.cos.ap-chengdu.myqcloud.com/tutorial/12-如何添加工作类别及设置工作流.mp4',
      id: 12,
      text: '如何添加工作类别及设置工作流',
      imgUrl:
        'https://mj-system-1308485183.cos.ap-chengdu.myqcloud.com/tutorial/img/img12.jpg',
    },
    {
      url: 'https://mj-system-1308485183.cos.ap-chengdu.myqcloud.com/tutorial/13-如何管理发送通知.mp4',
      id: 13,
      text: '如何管理发送通知',
      imgUrl:
        'https://mj-system-1308485183.cos.ap-chengdu.myqcloud.com/tutorial/img/img13.jpg',
    },
    {
      url: 'https://mj-system-1308485183.cos.ap-chengdu.myqcloud.com/tutorial/14-如何管理接收通知.mp4',
      id: 14,
      text: '如何管理接收通知',
      imgUrl:
        'https://mj-system-1308485183.cos.ap-chengdu.myqcloud.com/tutorial/img/img14.jpg',
    },
    {
      url: 'https://mj-system-1308485183.cos.ap-chengdu.myqcloud.com/tutorial/15-如何使用冲刺建立周计划.mp4',
      id: 15,
      text: '如何使用冲刺建立周计划',
      imgUrl:
        'https://mj-system-1308485183.cos.ap-chengdu.myqcloud.com/tutorial/img/img15.jpg',
    },
    {
      url: 'https://mj-system-1308485183.cos.ap-chengdu.myqcloud.com/tutorial/16-如何创建需求.mp4',
      id: 16,
      text: '如何创建需求',
      imgUrl:
        'https://mj-system-1308485183.cos.ap-chengdu.myqcloud.com/tutorial/img/img16.jpg',
    },
    {
      url: 'https://mj-system-1308485183.cos.ap-chengdu.myqcloud.com/tutorial/17-如何创建迭代.mp4',
      id: 17,
      text: '如何创建迭代',
      imgUrl:
        'https://mj-system-1308485183.cos.ap-chengdu.myqcloud.com/tutorial/img/img17.jpg',
    },
    {
      url: 'https://mj-system-1308485183.cos.ap-chengdu.myqcloud.com/tutorial/18-如何创建缺陷.mp4',
      id: 18,
      text: '如何创建缺陷',
      imgUrl:
        'https://mj-system-1308485183.cos.ap-chengdu.myqcloud.com/tutorial/img/img18.jpg',
    },
  ],
}

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
        setData(a.list)
        setTime(a.update_at)
        const cacheData = cloneDeep(a.list)
        setCacheData(cacheData)
      })
  }, [])
  useEffect(() => {
    console.log(value)
    const data = cacheData.filter(
      (item: { text: string | string[] }) => item.text.indexOf(value) > -1,
    )
    console.log(data)
    setData(data)
  }, [value])
  const navigate = useNavigate()
  return (
    <Wrap>
      <Header time={time}></Header>
      <InputBox>
        <div className="title-box">
          <div className="title">IFUN Agile敏</div>
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
                  }),
                )
                const url = `/videoTeachDetail?data=${params}`
                window.open(url)
                // navigate(`/videoTeachDetail?data=${params}`)
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
