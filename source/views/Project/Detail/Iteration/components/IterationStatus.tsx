// 迭代切换状态公用

/* eslint-disable multiline-ternary */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable @typescript-eslint/naming-convention */
import styled from '@emotion/styled'
import { StatusTag } from '@/components/StyleCommon'
import { Popover } from 'antd'
import IconFont from '@/components/IconFont'

const LiWrap = styled.div<{ color: any }>(
  {
    cursor: 'pointer',
    padding: '0 16px',
    width: '100%',
    height: 32,
    display: 'flex',
    alignItems: 'center',
    background: 'white',
  },
  ({ color }) => ({
    '&: hover': {
      background: color,
    },
  }),
)

interface Props {
  hasChangeStatus: boolean
  iterateInfo: any
  onChangeStatus(value: any, e: any): void
}

const IterationStatus = (props: Props) => {
  // 获取迭代状态对应名称
  const onGetStatusName = (status: any) => {
    let name: any
    if (status === 1) {
      name = '已开启'
    } else {
      name = status === 3 ? '已关闭' : '已完成'
    }
    return name
  }

  const changeStatus = (
    <div
      style={{
        padding: '4px 0px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
      }}
    >
      <LiWrap color="#F0F4FA" onClick={e => props.onChangeStatus(1, e)}>
        <StatusTag status={1}>已开启</StatusTag>
      </LiWrap>

      <LiWrap color="#EDF7F4" onClick={e => props.onChangeStatus(2, e)}>
        <StatusTag status={2}>已完成</StatusTag>
      </LiWrap>

      <LiWrap color="#F2F2F4" onClick={e => props.onChangeStatus(3, e)}>
        <StatusTag status={3}>已关闭</StatusTag>
      </LiWrap>
    </div>
  )

  return (
    <>
      {props.hasChangeStatus ? (
        <StatusTag
          style={{ cursor: 'inherit' }}
          status={props.iterateInfo?.status}
        >
          {onGetStatusName(props.iterateInfo?.status)}
        </StatusTag>
      ) : (
        <Popover
          placement="bottom"
          content={changeStatus}
          getPopupContainer={node => node}
        >
          {props.iterateInfo ? (
            <StatusTag status={props.iterateInfo?.status}>
              {onGetStatusName(props.iterateInfo?.status)}
              <IconFont
                type="down-icon"
                style={{
                  fontSize: 12,
                  marginLeft: 4,
                  color:
                    props.iterateInfo?.status === 1
                      ? '#2877FF'
                      : props.iterateInfo?.status === 2
                      ? '#43BA9A'
                      : '#969799',
                }}
              />
            </StatusTag>
          ) : null}
        </Popover>
      )}
    </>
  )
}

export default IterationStatus
