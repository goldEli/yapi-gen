/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable react-hooks/exhaustive-deps */
import { Popover, Upload, Space, message } from 'antd'
import styled from '@emotion/styled'
import { IconFont } from '@staryuntech/ant-pro'
import { useModel } from '@/models'
import { useEffect, useState } from 'react'
import type { UploadRequestOption } from 'rc-upload/lib/interface'

const ImgWrap = styled.div({
  borderRadius: 6,
  height: 176,
  overflow: 'hidden',
  img: {
    height: '100%',
    width: '100%',
  },
})

const ChangeWrap = styled.div({
  position: 'absolute',
  bottom: 0,
  width: '100%',
  height: 32,
  background: 'rgba(50, 50, 51, 0.4)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  fontSize: 14,
  fontWeight: 400,
  cursor: 'pointer',
  borderBottomLeftRadius: 6,
  borderBottomRightRadius: 6,
})

const ChooseTitle = styled.div({
  color: '#646566',
  fontSize: 12,
  fontWeight: 400,
  marginBottom: 8,
})

const PosterGroup = styled(Space)({
  display: 'flex',
  flexWrap: 'wrap',
  marginBottom: 8,
})
const AddUpload = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: 28,
  borderRadius: 6,
  width: 60,
  boxSizing: 'border-box',
  border: '1px solid #EBEDF0',
  marginBottom: 8,
  color: '#969799',
  cursor: 'pointer',
  '&: hover': {
    color: '#2877ff',
    border: '1px solid #2877ff',
  },
})

const PosterWrap = styled.img({
  marginBottom: 8,
  cursor: 'pointer',
  width: 60,
  height: 28,
  borderRadius: 2,
})

interface Props {
  value?: any
  onChangeValue?(cover: string): void
}

const PosterComponent = (props: Props) => {
  const { coverList } = useModel('project')
  const [checkedPoster, setCheckedPoster] = useState(props.value || '')
  const { uploadFile } = useModel('cos')
  const [posterList, setPosterList] = useState<any>([])

  const onUpdateValue = (path: string) => {
    setCheckedPoster(path)
    props.onChangeValue?.(path)
  }

  useEffect(() => {
    if (coverList.length && !props.value) {
      onUpdateValue(coverList[0].path)
    }
  }, [coverList])

  const onUploadBefore = (file: any) => {
    const acceptArr = ['jpg', 'png']
    const urlType = file.name.split('.')
    if (!acceptArr.includes(urlType[urlType.length - 1])) {
      message.warning('格式不正确')
      return Upload.LIST_IGNORE
    }
  }

  const onUploadFileClick = async (option: UploadRequestOption) => {
    const { file } = option
    if (file instanceof File) {
      const result = await uploadFile(file, file.name, 'file')
      option.onSuccess?.(result)
      const items = [result.url]
      setPosterList([...posterList, ...items])
    }
  }

  const choosePoster = (
    <div style={{ width: 372, padding: 16 }}>
      <ChooseTitle>请选择一个封面</ChooseTitle>
      <PosterGroup size={8}>
        {coverList.map((i: any) => (
          <PosterWrap
            key={i.id}
            onClick={() => onUpdateValue(i.path)}
            src={i.path}
            alt=""
          />
        ))}
      </PosterGroup>
      <ChooseTitle>自定义封面</ChooseTitle>
      <div>
        {posterList.map((i: any) => <PosterWrap onClick={() => onUpdateValue(i)} key={i} src={i} alt="" />)}
        <Upload
          beforeUpload={onUploadBefore}
          customRequest={onUploadFileClick}
          showUploadList={false}
        >
          <AddUpload>
            <IconFont type="plus" />
          </AddUpload>
        </Upload>
      </div>
      <div style={{ fontSize: 12, fontWeight: 400, color: '#969799' }}>
        图片格式支持jpg、png，大小为220*104px
      </div>
    </div>
  )

  return (
    <div style={{ position: 'relative' }}>
      <ImgWrap>
        <img src={checkedPoster} alt="" />
      </ImgWrap>
      <Popover
        placement="bottom"
        content={choosePoster}
        getPopupContainer={node => node}
      >
        <ChangeWrap>修改图片</ChangeWrap>
      </Popover>
    </div>
  )
}

export default PosterComponent
