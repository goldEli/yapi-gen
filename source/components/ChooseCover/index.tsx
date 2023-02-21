import { uploadFileByTask } from '@/services/cos'
import { useSelector } from '@store/index'
import { Upload } from 'antd'
import React, {
  ForwardedRef,
  forwardRef,
  useImperativeHandle,
  useState,
} from 'react'
import FormTitleSmall from '../FormTitleSmall'
import IconFont from '../IconFont'
import ProjectCard from '../ProjectCard'
import {
  CoverArea,
  CoverAreaAdd,
  coverAreadelIcon,
  coverAreaIcon,
  CoverAreaImage,
  CoverAreaImageShade,
  CoverAreaImageWrap,
  CoverAreaWrap,
} from './style'

export type IndexRef2 = {
  activeCover: string
}

const Index = (props: any, ref: ForwardedRef<IndexRef2>) => {
  const [activeCover, setActiveCover] = useState<any>()
  const [myCover, setMyCover] = useState<string>('')
  const covers = useSelector(state => state.cover.covers)

  const onCustomRequest = async (file: any) => {
    const data = await uploadFileByTask(file.file, '2', '2')

    setMyCover(data.url)
  }
  useImperativeHandle(ref, () => ({
    activeCover,
  }))
  return (
    <CoverAreaWrap>
      <FormTitleSmall text="选择封面" />
      <CoverArea>
        {covers?.map((i: any) => (
          <CoverAreaImageWrap onClick={() => setActiveCover(i.path)} key={i.id}>
            <CoverAreaImage src={i.path} />
            {activeCover === i.path && (
              <IconFont className={coverAreaIcon} type="anglemark" />
            )}
          </CoverAreaImageWrap>
        ))}

        {myCover ? (
          <CoverAreaImageWrap onClick={() => setActiveCover(myCover)}>
            <CoverAreaImage src={myCover} />
            {myCover === activeCover && (
              <IconFont className={coverAreaIcon} type="anglemark" />
            )}
            {myCover === activeCover && (
              <CoverAreaImageShade onClick={() => setMyCover('')}>
                <IconFont
                  className={coverAreadelIcon}
                  type="delete"
                  style={{
                    color: 'var(--neutral-white-d7)',
                  }}
                />
              </CoverAreaImageShade>
            )}
          </CoverAreaImageWrap>
        ) : (
          <Upload fileList={[]} customRequest={onCustomRequest}>
            <CoverAreaAdd>
              <IconFont
                style={{
                  fontSize: 18,
                }}
                type="plus"
              />
            </CoverAreaAdd>
          </Upload>
        )}
      </CoverArea>
      <FormTitleSmall text="效果预览" />
      <div
        style={{
          marginTop: '16px',
        }}
      >
        <ProjectCard img={activeCover} />
      </div>
    </CoverAreaWrap>
  )
}

export default forwardRef(Index)
