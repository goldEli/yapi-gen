/* eslint-disable @typescript-eslint/ban-types */
// 图片
import style from './SecretImage.module.css'
import { createPortal } from 'react-dom'
export default ({
  secretVisible,
  secretImage,
  close,
  operationManual,
  operationNotes,
}: {
  secretVisible: boolean
  secretImage: string
  close: Function
  operationManual: string
  operationNotes: string
}) => {
  if (!secretVisible) {
    return null
  }
  return createPortal(
    <div className={style.container}>
      <div className={style.main}>
        <div className={style.img}>
          <img src={secretImage} alt="" />
        </div>

        <span
          onClick={() => {
            close()
          }}
          className={style.close}
        >
          ×
        </span>
        <span className={style.note_black}>{operationNotes}</span>
        <span
          onClick={() => {
            window.open(
              'https://doc-1308485183.cos.ap-chengdu.myqcloud.com/doc/IFUN%E7%B3%BB%E7%BB%9F%E7%99%BB%E5%BD%95%E5%8A%A8%E6%80%81%E5%8F%A3%E4%BB%A4%E7%BB%91%E5%AE%9A%E6%95%99%E7%A8%8B.pdf',
              '_blank',
            )
          }}
          className={style.note}
        >
          {operationManual}
        </span>
      </div>
    </div>,
    document.body,
  )
}
