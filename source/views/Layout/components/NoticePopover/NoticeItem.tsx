import CommonIconFont from '@/components/CommonIconFont'
import { ICON_TYPE_DATA } from './constant'
import { NoticeItemWrap } from './style'

const NoticeItem = (props: any) => {
  const { index, data } = props
  return (
    <NoticeItemWrap>
      <div className="type_icon">
        <CommonIconFont
          type={ICON_TYPE_DATA.get(data?.send_user)?.icon ?? 'folder-open-sel'}
          color={ICON_TYPE_DATA.get(data?.send_user)?.color ?? '#FA9746'}
        ></CommonIconFont>
      </div>
      <div className="detail">
        <div className="detail_title">
          <span>{ICON_TYPE_DATA.get(data?.send_user)?.text}</span>
          <span>2小时前</span>
        </div>
        <div className="detail_content">
          <span>
            {' '}
            <img
              src="https://agile-api.dev.staryuntech.com/attachment/category_icon/security.png"
              alt=""
            />
          </span>
          <span>{data?.msg_body?.title}</span>
        </div>
        <div className="detail_result">
          {data?.msg_body?.content}
          {data?.custom_data?.linkWebUrl ? (
            <a href={data?.custom_data?.linkWebUrl}>前往查看</a>
          ) : null}
        </div>
      </div>
    </NoticeItemWrap>
  )
}

export default NoticeItem
