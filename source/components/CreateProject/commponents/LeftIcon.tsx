import FormTitleSmall from '@/components/FormTitleSmall'
import {
  CoverArea,
  CoverAreaAdd,
  CoverAreaImage,
  CoverAreaImageShade,
  CoverAreaImageWrap,
  CoverAreaWrap,
  UploadFileIconWrap,
  coverAreaIcon,
  coverAreadelIcon,
} from './style'
import { useSelector } from '@store/index'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { uploadFileByTask } from '@/services/cos'
import IconFont from '@/components/IconFont'
import { Upload } from 'antd'
import ProjectCardShow from '@/components/ProjectCardShow'
const UploadFileIcon = (props: {
  icon: string
  onChangeIcon(val: string): void
}) => {
  const [myCover, setMyCover] = useState<string>('')
  const [activeCover, setActiveCover] = useState('')
  const covers = useSelector(state => state.cover.covers)
  const [t] = useTranslation()

  // 上傳
  const onCustomRequest = async (file: any) => {
    const data = await uploadFileByTask(file.file, '2')
    setMyCover(data.url)
    setActiveCover(data.url)
    props.onChangeIcon(data.url)
  }
  //   回显给父级
  const onChangeIcon = (path: string) => {
    setActiveCover(path)
    props.onChangeIcon(path)
  }

  useEffect(() => {
    if (props.icon) {
      setActiveCover(props.icon)
      return
    }
    setActiveCover(covers[0]?.path)
  }, [props.icon])
  return (
    <UploadFileIconWrap>
      <CoverAreaWrap>
        <FormTitleSmall text={t('choose_the_cover')} />
        <CoverArea>
          {covers?.map((i: any) => (
            <CoverAreaImageWrap
              color={i.remarks}
              onClick={() => onChangeIcon(i.path)}
              key={i.id}
            >
              <CoverAreaImage src={i.path} />
              {activeCover === i.path && (
                <IconFont className={coverAreaIcon} type="anglemark" />
              )}
            </CoverAreaImageWrap>
          ))}

          {myCover ? (
            <CoverAreaImageWrap>
              <CoverAreaImage src={myCover} />
              {myCover === activeCover && (
                <IconFont className={coverAreaIcon} type="anglemark" />
              )}
              {myCover === activeCover && (
                <CoverAreaImageShade
                  onClick={() => {
                    setMyCover('')
                    setActiveCover(covers[0]?.path)
                    props.onChangeIcon(covers[0]?.path)
                  }}
                >
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
                    fontSize: 24,
                    color: 'var(--neutral-n2)',
                  }}
                  type="plus"
                />
              </CoverAreaAdd>
            </Upload>
          )}
        </CoverArea>
        <FormTitleSmall text={t('effect_preview')} />
        <div
          style={{
            marginTop: '16px',
          }}
        >
          {/* 左侧底部的卡片展示 */}
          <ProjectCardShow
            //   names={activeCover}
            // prefix={pey}
            // user={user}
            img={activeCover}
          />
        </div>
      </CoverAreaWrap>
    </UploadFileIconWrap>
  )
}
export default UploadFileIcon
