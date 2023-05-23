import React from 'react'
import { ColorBox, ColorBtn, ColorBtn2, Wrap1, Wrap2 } from './style'
import CommonButton from '@/components/CommonButton'
import CommonIconFont from '@/components/CommonIconFont'

const NoteCard = (props: any) => {
  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Wrap1>
          <ColorBox colors={1}>定时通知</ColorBox>
          <div
            style={{
              height: '24px',
              fontSize: '16px',
              color: '#323233',
              lineHeight: '24px',
            }}
          >
            关于XXX通知
          </div>
          <div
            style={{
              height: '20px',
              fontSize: '12px',
              color: '#969799',
              lineHeight: '20px',
            }}
          >
            日常通知
          </div>
        </Wrap1>
        <Wrap2>
          <ColorBtn2>
            <CommonIconFont type="display" /> <span>全部已读</span>
          </ColorBtn2>
          <ColorBtn onClick={() => props.onDel(1)}>
            <CommonIconFont type="file-text" /> <span>删除</span>
          </ColorBtn>
          <ColorBtn onClick={() => props.onRevocation(2)}>
            <CommonIconFont type="return" /> <span>撤回</span>
          </ColorBtn>
          <ColorBtn>
            <CommonIconFont type="file-text" /> <span>查看详情</span>
          </ColorBtn>
        </Wrap2>
      </div>
      <div
        style={{
          height: '20px',
          fontSize: '12px',
          color: '#969799',
          lineHeight: '20px',
        }}
      >
        【张三】将于2023-04-08 17:09:09发送
      </div>

      <div
        style={{
          height: '106px',
          background: '#F8F8FA',
          borderRadius: '6px 6px 6px 6px',
          marginTop: '8px',
          boxSizing: 'border-box',
          padding: '16px',
        }}
      >
        <div
          style={{
            height: '22px',
            fontSize: '14px',
            color: '#323233',
            lineHeight: '22px',
          }}
        >
          来自李钟硕的系统通知：我们抱歉的通知您，由于XXX的原因，导致XXXX需要延期XXX天
        </div>

        {/* <div
          style={{
            height: '52px',
            borderRadius: '0px 0px 0px 0px',
            borderTop: '1px solid #ECEDEF',
            marginTop: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
          }}
        >
          <div
            style={{
              height: '20px',
              fontSize: '12px',
              color: '#646566',
              lineHeight: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              borderRight: '1px solid #ECEDEF',
              paddingRight: '24px',
            }}
          >
            <CommonIconFont color="#646566" size={16} type="team-2" />
            123
          </div>
          {Array(3)
            .fill(null)
            .map((i: any) => (
              <div
                key={i}
                style={{
                  height: '20px',
                  fontSize: '12px',
                  color: '#646566',
                  lineHeight: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                开发部（1）
              </div>
            ))}
        </div> */}
        <div
          style={{
            height: '52px',
            borderRadius: '0px 0px 0px 0px',
            borderTop: '1px solid #ECEDEF',
            marginTop: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
          }}
        >
          <div
            style={{
              height: '20px',
              fontSize: '12px',
              color: '#646566',
              lineHeight: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              borderRight: '1px solid #ECEDEF',
              paddingRight: '24px',
            }}
          >
            <CommonIconFont color="#646566" size={16} type="team-2" />
            持续截止时间
          </div>

          <div
            style={{
              height: '20px',
              fontSize: '12px',
              color: '#646566',
              lineHeight: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            2023年4月17日12:00:19
          </div>
        </div>
      </div>
    </div>
  )
}

export default NoteCard
