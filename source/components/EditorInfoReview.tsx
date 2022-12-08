/* eslint-disable react/jsx-no-leaked-render */
// 富文本上传后的图片查看

/* eslint-disable @typescript-eslint/naming-convention */

import styled from '@emotion/styled'
import { useEffect, useRef, useState } from 'react'
import Viewer from 'react-viewer'

const TextWrapEditor = styled.div({
  color: '#323233',
  fontSize: 14,
  display: 'flex',
  flexDirection: 'column',
  img: {
    maxWidth: '100%',
    height: 'auto!important',
    cursor: 'pointer',
  },
  video: {
    maxWidth: '400px',
    height: 'auto!important',
    cursor: 'pointer',
  },
  p: {
    marginBottom: '0px!important',
  },
  table: {
    td: {
      height: '20px',
      border: '1px solid black',
    },
  },
})

interface Props {
  info: any
}

const EditorInfoReview = (props: Props) => {
  const textWrapEditor = useRef<HTMLInputElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [pictureList, setPictureList] = useState({
    imageArray: [],
    index: 0,
  })

  const onGetViewPicture = (e: any) => {
    if (e.path[0].nodeName === 'IMG') {
      const params: any = {}
      const oPics = textWrapEditor?.current?.getElementsByTagName('img')
      params.imageArray = []
      if (oPics) {
        for (const element of oPics) {
          params.imageArray.push({ src: element.src })
        }
        for (let i = 0; i < oPics.length; i++) {
          if (e.path[0].src === params.imageArray[i].src) {
            params.index = i
          }
        }
      }
      setIsVisible(true)
      setPictureList(params)
    }
  }
  useEffect(() => {
    textWrapEditor?.current?.addEventListener('click', e => onGetViewPicture(e))
    return textWrapEditor?.current?.removeEventListener('click', e =>
      onGetViewPicture(e),
    )
  }, [])

  return (
    <>
      {isVisible && (
        <Viewer
          zIndex={9999}
          visible={isVisible}
          images={pictureList?.imageArray}
          activeIndex={pictureList?.index}
          onClose={() => setIsVisible(false)}
        />
      )}
      <TextWrapEditor
        ref={textWrapEditor}
        dangerouslySetInnerHTML={{ __html: props.info }}
      />
    </>
  )
}

export default EditorInfoReview
