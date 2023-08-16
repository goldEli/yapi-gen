import React, { useState, useEffect, useRef } from 'react'
import LongStoryDropdown from '../LongStoryDropdown'
import CommonIconFont from '../CommonIconFont'
import styled from '@emotion/styled'
import { Tooltip } from 'antd'
import { copyLink } from '@/tools'
import IconFont from '../IconFont'
import { useTranslation } from 'react-i18next'
import { encryptPhp } from '@/tools/cryptoPhp'
import useOpenDemandDetail from '@/hooks/useOpenDemandDetail'
const BreadBox = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  position: relative;
  svg {
    margin: 0px 6px;
  }
`
const LongStroyWrap = styled.div`
  display: flex;
`
const LabelBox = styled.div`
  color: var(--neutral-n3);
  font-size: var(--font12);
  cursor: pointer;
  display: flex;
  align-items: center;
`
const AffairTypeBox = styled.div`
  color: var(--neutral-n1-d1);
  font-size: var(--font12);
`
const HasStroyWrap = styled.div`
  display: inline-block;
  width: 24px;
  svg {
    margin: 0px;
  }
`
const SpanWrap = styled.span`
  display: flex;
  align-items: center;
  svg {
    color: var(--neutral-n3);
  }
  &:hover {
    svg {
      color: var(--primary-d2);
    }
  }
`

interface IProps {
  longStroy?: any
  layer?: boolean
  onClick?(): void
}
const LongStroyBread = (props: IProps) => {
  const [visible, setVisible] = useState(false)
  const [showEditIcon, setShowEditIcon] = useState(false)
  const [isHasLongStroy, setIsHasLongStroy] = useState(false)
  const { longStroy = {}, layer = false, onClick } = props
  const [t] = useTranslation()
  const ref = useRef<HTMLDivElement>(null)
  const [openDemandDetail] = useOpenDemandDetail()
  // 复制链接
  const onCopyLink = () => {
    let text: any = ''
    let beforeUrl: any = ''
    beforeUrl = window.origin
    const params = encryptPhp(
      JSON.stringify({
        id: longStroy.projectId,
        detailId: longStroy.id,
        isOpenScreenDetail: true,
        specialType: 1,
      }),
    )
    const url = `/SprintProjectManagement/Affair?data=${params}`
    text += `${beforeUrl}${url} \n`
    copyLink(
      `【${longStroy?.projectPrefix}-${longStroy?.prefixKey}】${text}`,
      t('common.copySuccess'),
      t('common.copyFail'),
    )
  }

  useEffect(() => {
    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  const handleClickOutside = (event: { target: any }) => {
    if (
      ref.current &&
      !ref.current.contains(event.target) &&
      typeof event.target.getAttribute('xlink:href') !== 'string'
    ) {
      setVisible(false)
    }
  }

  useEffect(() => {
    if (
      longStroy?.level_tree?.some(
        (item: { work_type: number }) => item.work_type === 3,
      )
    ) {
      setIsHasLongStroy(true)
    } else {
      setIsHasLongStroy(false)
    }
  }, [longStroy])
  return (
    <div style={{ position: 'relative' }} ref={ref}>
      <BreadBox>
        <div style={{ display: 'flex' }}>
          {layer ? null : (
            <span style={{ display: 'flex', alignItems: 'center' }}>
              <CommonIconFont
                type="right"
                color="var(--neutral-n1-d1)"
              ></CommonIconFont>
            </span>
          )}
          {/* 显示添加长故事按钮还是显示编辑按钮 */}
        </div>
        {/* 事务显示层级关系 */}
        {(longStroy.level_tree?.length === 0 ||
          (longStroy.level_tree?.length && !isHasLongStroy)) &&
        longStroy.work_type !== 3 ? (
          <LongStroyWrap
            onClick={() => {
              setVisible(true)
            }}
          >
            <LabelBox>{t('other.addLongStory')}</LabelBox>
            <CommonIconFont
              type="right"
              color="var(--neutral-n1-d1)"
            ></CommonIconFont>
          </LongStroyWrap>
        ) : null}
        {longStroy.level_tree?.map((item: any, index: number) => {
          return (
            <Tooltip
              placement="top"
              title={item.name}
              zIndex={999999}
              key={item.id}
            >
              <LabelBox>
                {showEditIcon && item.work_type === 3 ? (
                  <CommonIconFont
                    type="edit"
                    color="var(--neutral-n3)"
                    onMouseLeave={() => {
                      setShowEditIcon(false)
                    }}
                    onClick={() => setVisible(true)}
                  ></CommonIconFont>
                ) : (
                  <img
                    src={item.category_attachment}
                    alt=""
                    onMouseEnter={() => {
                      if (item.work_type === 3) {
                        setShowEditIcon(true)
                      }
                    }}
                    onMouseLeave={() => {
                      setShowEditIcon(false)
                    }}
                    onClick={() => {
                      const projectId = longStroy?.projectId
                      openDemandDetail({ ...item }, projectId, item.id, 1)
                    }}
                    style={{ width: 20, marginRight: '6px' }}
                  />
                )}
                <span
                  onClick={() => {
                    const projectId = longStroy?.projectId
                    openDemandDetail({ ...item }, projectId, item.id, 1)
                  }}
                >
                  {item.project_prefix}-{item.prefix_key}
                </span>
                {index !== longStroy.level_tree?.length - 1 && (
                  <CommonIconFont
                    type="right"
                    color="var(--neutral-n1-d1)"
                  ></CommonIconFont>
                )}
              </LabelBox>
            </Tooltip>
          )
        })}
        {/* 事务本身 */}
        {longStroy.level_tree?.length === 0 ? null : (
          <CommonIconFont
            type="right"
            color="var(--neutral-n1-d1)"
          ></CommonIconFont>
        )}

        <img
          src={longStroy.category_attachment}
          alt=""
          style={{ width: 20, marginRight: '6px' }}
        />
        <Tooltip placement="top" title={longStroy.name} zIndex={999999}>
          <AffairTypeBox>
            {longStroy?.projectPrefix}-{longStroy?.prefixKey}
          </AffairTypeBox>
        </Tooltip>
        {layer ? null : (
          <Tooltip placement="top" title={t('copy_title_link')} zIndex={999999}>
            <SpanWrap style={{}}>
              <CommonIconFont
                type="link"
                color="var(--primary-d2)"
                onClick={onCopyLink}
                size={18}
              ></CommonIconFont>
            </SpanWrap>
          </Tooltip>
        )}
      </BreadBox>
      {visible ? (
        <LongStoryDropdown
          detail={longStroy}
          onClick={() => {
            setVisible(false)
            onClick && onClick()
          }}
        ></LongStoryDropdown>
      ) : null}
    </div>
  )
}
export default LongStroyBread
