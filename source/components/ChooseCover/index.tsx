import React from 'react'
import FormTitleSmall from '../FormTitleSmall'
import IconFont from '../IconFont'
import ProjectCard from '../ProjectCard'
import { CoverArea, CoverAreaAdd, CoverAreaImage, CoverAreaWrap } from './style'

const index = () => {
  const row = new Array(8).fill(1)
  return (
    <CoverAreaWrap>
      <FormTitleSmall text="选择封面" />
      <CoverArea>
        {row.map(i => (
          <CoverAreaImage
            src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"
            key={i}
          />
        ))}
        <CoverAreaAdd>
          <IconFont
            style={{
              fontSize: 18,
            }}
            type="plus"
          />
        </CoverAreaAdd>
      </CoverArea>
      <FormTitleSmall text="效果预览" />
      <div
        style={{
          marginTop: '16px',
        }}
      >
        <ProjectCard />
      </div>
    </CoverAreaWrap>
  )
}

export default index
