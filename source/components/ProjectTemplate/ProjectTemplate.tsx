import React from 'react'
import { Title, Title2 } from './style'
import pt1 from '/pt1.png'
import pt2 from '/pt2.png'
import pt3 from '/pt3.png'
import { t } from 'i18next'

const ProjectTemplate = () => {
  const arr = [
    {
      id: 1,
      name: '软件开发',
      img: pt1,
      text: '',
      tags: [
        {
          name: '未开始',
          color: '#43BA9A',
          t_color: '#FFFFFF',
        },
        {
          name: '进行中',
          color: '#6688FF',
          t_color: '#FFFFFF',
        },
        {
          name: '已完成',
          color: '#F2F2F4',
          t_color: '#323233',
        },
      ],
    },
    {
      id: 2,
      name: '游戏设计',
      img: pt2,
      text: '',
      tags: [
        {
          name: '需求设计',
          color: '#6688FF',
          t_color: '#FFFFFF',
        },
        {
          name: '美术',
          color: '#6688FF',
          t_color: '#FFFFFF',
        },
        {
          name: '原画',
          color: '#6688FF',
          t_color: '#FFFFFF',
        },
        {
          name: '...',
          color: '#6688FF',
          t_color: '#FFFFFF',
        },
      ],
    },
    {
      id: 3,
      name: '已有项目导入',
      img: pt3,
      text: '可以从已有的项目里导入现有工作流和项目成员，在新的项目里也可以随时修改它。',
      tags: [],
    },
  ]

  return (
    <div style={{ width: '1000px' }}>
      <Title>选择项目模版</Title>
      <Title2>
        我们帮您预制了一些工作流程，希望能减少您的工作，当然今后也可以随时改变它
      </Title2>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: '64px',
          marginTop: '40px',
        }}
      >
        {arr.map((i: any) => (
          <div
            style={{
              height: '265px',
              width: '288px',
              border: '1px solid #ECEDEF',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
            key={i.id}
          >
            <img
              style={{
                display: 'block',
                width: '288px',
              }}
              src={i.img}
              alt=""
            />
            <div
              style={{
                height: '22px',
                fontSize: '14px',
                color: '#323233',
                lineHeight: ' 22px',
                margin: '16px 16px 8px 16px',
              }}
            >
              {i.name}
            </div>
            <div
              style={{
                margin: '16px 16px 8px 16px',
              }}
            >
              <div
                style={{
                  height: i.text ? '40px' : '0px',
                  fontSize: '12px',
                  fontWeight: 400,
                  color: '#646566',
                  lineHeight: '20px',
                }}
              >
                {i.text}
              </div>
              {i.tags.map((j: any) => (
                <span
                  style={{
                    padding: '1px 8px',
                    marginRight: '16px',
                    borderRadius: '6px',
                    color: j.t_color,
                    backgroundColor: j.color,
                  }}
                  key={j.name}
                >
                  {j.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProjectTemplate
