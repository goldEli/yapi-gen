// 迭代切换状态公用

/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable @typescript-eslint/naming-convention */
import styled from '@emotion/styled'
import { StatusTag } from '@/components/StyleCommon'
import { Popover } from 'antd'
import IconFont from '@/components/IconFont'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Complete from './Complete'

const LiWrap = styled.div<{ color: any }>(
  {
    cursor: 'pointer',
    padding: '0 16px',
    width: '100%',
    height: 32,
    display: 'flex',
    alignItems: 'center',
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
  onCompleteIteration?(id: number): void
}

const IterationStatus = (props: Props) => {
  const [t] = useTranslation()
  const [isVisible, setIsVisible] = useState(false)

  // 获取迭代状态对应名称
  const onGetStatusName = (status: any) => {
    let name: any
    if (status === 1) {
      name = t('common.opening1')
    } else {
      name = status === 3 ? t('common.Closed') : t('common.finished')
    }
    return name
  }

  const onClick = (value: any, e: any) => {
    setIsVisible(false)
    props.onChangeStatus(value, e)
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
      <LiWrap color="var(--selected)" onClick={e => onClick(1, e)}>
        <StatusTag status={1}>{t('common.opening1')}</StatusTag>
      </LiWrap>

      <LiWrap
        color="var(--function-tag2)"
        onClick={() => {
          props?.onCompleteIteration?.(props?.iterateInfo?.id)
        }}
      >
        <StatusTag status={2}>{t('common.finished')}</StatusTag>
      </LiWrap>

      <LiWrap color="var( --function-tag6)" onClick={e => onClick(3, e)}>
        <StatusTag status={3}>{t('common.Closed')}</StatusTag>
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
          visible={isVisible}
          onVisibleChange={visible => setIsVisible(visible)}
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
                      ? 'var(--primary-d2)'
                      : props.iterateInfo?.status === 2
                      ? 'var(--function-success)'
                      : 'var(--neutral-n3)',
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
