import CommonIconFont from '@/components/CommonIconFont'
import { ICON_TYPE_DATA } from './constant'
import { NoticeItemWrap } from './style'
import classNames from 'classnames'
import dayjs from 'dayjs'
import { encryptPhp } from '@/tools/cryptoPhp'
import { useNavigate } from 'react-router-dom'
const NoticeItem = (props: any) => {
  const { index, data, onReadClick, onCancel } = props
  const navigate = useNavigate()
  // 点击人员
  const gomember = (d: any) => {
    onCancel()
    const params = encryptPhp(
      JSON.stringify({
        user_id: d.msg_body.user_id,
      }),
    )
    navigate(`/EmployeeProfile?data=${params}`)
  }
  return (
    <NoticeItemWrap
      onClick={() => {
        console.log(data)
        if (parseInt(data.read, 10) === 2) {
          return
        }
        onReadClick(index, data?.id)
      }}
    >
      <div className="type_icon">
        <CommonIconFont
          type={
            ICON_TYPE_DATA.get(data?.send_user?.username)?.icon ??
            'folder-open-sel'
          }
          color={
            ICON_TYPE_DATA.get(data?.send_user?.username)?.color ?? '#FA9746'
          }
        ></CommonIconFont>
        {parseInt(data.read, 10) === 0 ? <div className="dot"></div> : null}
      </div>
      <div className="detail">
        <div className="detail_title">
          <span className={classNames({ read: parseInt(data.read, 10) === 2 })}>
            {data?.send_user?.nickname}
          </span>
          <span>{dayjs(data?.create_time * 1000).format('YYYY-MM-DD')}</span>
        </div>
        <div
          className={classNames('detail_content', {
            read: parseInt(data.read, 10) === 2,
          })}
        >
          <span>
            {data?.msg_body?.optHeader ? (
              <img
                src={data?.msg_body?.optHeader}
                alt=""
                style={{ borderRadius: '50%' }}
              />
            ) : (
              <img
                style={{ borderRadius: '50%' }}
                src="https://mj-system-1308485183.cos.accelerate.myqcloud.com/public/light.png"
                alt=""
              />
            )}
          </span>
          <span>
            <label
              htmlFor=""
              className="user_name"
              onClick={() => gomember(data)}
            >
              {data?.msg_body?.username}
            </label>
            <label htmlFor="">{data?.msg_body?.title_msg}</label>
          </span>
        </div>
        <div
          className={classNames('detail_result', {
            read: parseInt(data.read, 10) === 2,
          })}
        >
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
