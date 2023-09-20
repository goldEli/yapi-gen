import React, { useState, useEffect } from 'react'
import styled from '@emotion/styled'

import { Radio } from 'antd'
import { useSelector, useDispatch } from '@store/index'
import { updateHomeSetting } from '@/services/sprint'
import { getMessage } from '@/components/Message'
import { setProjectInfo } from '@store/project/index'
import { useTranslation } from 'react-i18next'
import IconFont from '@/components/IconFont'
import { css } from '@emotion/css'
const Wrap = styled.div`
  padding-left: 24px;
`
const Title = styled.div`
  color: var(--neutral-n1-d1);
  font-size: var(--font14);
`
const SubTitle = styled.div`
  color: var(--neutral-n3);
  font-size: var(--font12);
  margin-top: 4px;
`
const RadioWrap = styled.div`
  margin-top: 16px;
  .ant-radio-wrapper {
    color: var(--neutral-n1-d1) !important;
    font-size: var(--font14) !important;
  }
`
const hov = css`
  transition: all 0.6s;
  border: 1px solid #ecedef;
  &:hover {
    border: 1px solid transparent;
    box-shadow: 0px 0px 15px 6px rgba(0, 0, 0, 0.12);
  }
`
interface IProps {}
const HomeSetting: React.FC<IProps> = props => {
  const [value, setValue] = useState('')
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const { projectInfo } = useSelector(state => state.project)
  const urls = [
    {
      url: '/ProjectManagement/Demand',
      name: t('sprintProject.need'),
      color: '#6688FF',
      color2: 'rgba(102,136,255,0.1)',
      icon: 'demand',
    },
    {
      url: '/ProjectManagement/Iteration',
      name: t('sprintProject.iteration'),
      color: '#FA9746',
      color2: ' rgba(250,151,70,0.14)',
      icon: 'interation-2',
    },
    {
      url: '/ProjectManagement/KanBan',
      name: t('sprintProject.kanban'),
      color: '#43BA9A',
      color2: ' rgba(67,186,154,0.1)',
      icon: 'layout',
    },
    {
      url: '/Report/PerformanceInsight',
      name: t('sprintProject.report'),
      color: '#A176FB ',
      color2: ' rgba(161,118,251,0.1)',
      icon: 'pie-chart-02',
    },
    {
      url: '/ProjectManagement/Defect',
      name: t('sprintProject.defect'),
      color: 'red',
      color2: ' rgba(255,92,94,0.1)',
      icon: 'bug',
    },
  ]

  const onChange = async (e: any) => {
    console.log(e)

    setValue(e)
    try {
      await updateHomeSetting({
        id: projectInfo.id,
        default_home_menu: e,
      })
      dispatch(setProjectInfo({ ...projectInfo, defaultHomeMenu: e }))
      getMessage({ msg: t('other.configSuccess'), type: 'success' })
    } catch (error) {
      //
    }
  }
  useEffect(() => {
    if (!projectInfo.defaultHomeMenu) {
      setValue('/ProjectManagement/Demand')
      return
    }
    setValue(projectInfo.defaultHomeMenu)
  }, [])
  return (
    <Wrap>
      <Title>{t('sprintProject.projectHomeConfiguration')}</Title>
      <SubTitle>{t('sprintProject.defineProjectDefaultHomeLocation')}</SubTitle>
      <RadioWrap />
      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        {urls.map(item => (
          <div
            className={hov}
            key={item.url}
            onClick={() => onChange(item.url)}
            style={{
              cursor: 'pointer',
              width: '280px',
              height: '84px',
              borderRadius: 6,
              padding: '24px 20px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                background: item.color2,
                borderRadius: 6,
                marginRight: '12px',

                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <IconFont
                style={{ fontSize: '20px', color: item.color }}
                type={item.icon}
              />
            </div>
            <span style={{ color: 'var(--neutral-n1-d1)' }}>{item.name}</span>
            <span
              style={{
                marginLeft: 'auto',
                color: value === item.url ? '#969799' : '#6688FF',
              }}
            >
              {value === item.url ? '已设置' : '设为首页'}
            </span>
          </div>
        ))}
      </div>
    </Wrap>
  )
}
export default HomeSetting
