import React, { useState, useEffect, useRef } from 'react'
import LongStoryDropdown from '../LongStoryDropdown'
import CommonIconFont from '../CommonIconFont'
import styled from '@emotion/styled'
import { Tooltip } from 'antd'
import { copyLink } from '@/tools'
import IconFont from '../IconFont'
import { useTranslation } from 'react-i18next'
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

interface IProps {
  longStroy?: any
  layer?: boolean
  onClick?(): void
}
const LongStroyBread = (props: IProps) => {
  const [visible, setVisible] = useState(false)
  const [showEditIcon, setShowEditIcon] = useState(false)
  const [hasLongStroy, setHasLongStroy] = useState(false)
  const [isHasLongStroy, setIsHasLongStroy] = useState(false)
  const { longStroy = {}, layer = false, onClick } = props
  const [t] = useTranslation()
  // console.log('longStroy', longStroy)
  const ref = useRef<HTMLDivElement>(null)
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
    // hasLongStroy 为true可以添加长故事 work_type 为4,5才可以添加关联
    const hasLongStroy = longStroy.work_type !== 3
    if (hasLongStroy) {
      // isHasLongStroy 为true 可以新增
      const isHasLongStroy = longStroy?.level_tree?.length === 0
      setIsHasLongStroy(isHasLongStroy)
    }
    setHasLongStroy(hasLongStroy)
  }, [longStroy])
  return (
    <div style={{ position: 'relative' }} ref={ref}>
      <BreadBox>
        {hasLongStroy ? (
          <div style={{ display: 'flex' }}>
            {layer ? null : (
              <span style={{ display: 'flex', alignItems: 'center' }}>
                <CommonIconFont
                  type="right"
                  color="var(--neutral-n1-d1)"
                ></CommonIconFont>
              </span>
            )}

            {isHasLongStroy ? (
              <LongStroyWrap
                onClick={() => {
                  setVisible(true)
                }}
              >
                <CommonIconFont
                  type="edit"
                  color="var(--neutral-n3)"
                ></CommonIconFont>
                <LabelBox>添加长故事</LabelBox>
              </LongStroyWrap>
            ) : (
              <LongStroyWrap>
                {showEditIcon ? (
                  <HasStroyWrap>
                    <CommonIconFont
                      type="edit"
                      color="var(--neutral-n3)"
                      onMouseLeave={() => {
                        setShowEditIcon(false)
                      }}
                      onClick={() => setVisible(true)}
                    ></CommonIconFont>
                  </HasStroyWrap>
                ) : (
                  <HasStroyWrap>
                    <img
                      src={longStroy.category_attachment}
                      alt=""
                      onMouseEnter={() => {
                        if (
                          longStroy.work_type === 4 ||
                          longStroy.work_type === 5
                        ) {
                          setShowEditIcon(true)
                        }
                      }}
                      onMouseLeave={() => {
                        setShowEditIcon(false)
                      }}
                      style={{ width: 20, marginRight: '6px' }}
                    />
                  </HasStroyWrap>
                )}
                {longStroy.level_tree?.map((item: any, index: number) => {
                  return (
                    <Tooltip
                      placement="top"
                      title={item.name}
                      zIndex={999999}
                      key={item.id}
                    >
                      <LabelBox>
                        {`${item.project_prefix}-${item.prefix_key}`}{' '}
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
              </LongStroyWrap>
            )}
          </div>
        ) : null}

        <CommonIconFont
          type="right"
          color="var(--neutral-n1-d1)"
        ></CommonIconFont>
        <img
          src="https://dev.staryuntech.com/dev-agile/attachment/category_icon/folder.png"
          alt=""
          style={{ width: 20, marginRight: '6px' }}
        />
        <Tooltip placement="top" title={longStroy.name} zIndex={999999}>
          <AffairTypeBox>
            {longStroy?.projectPrefix}-{longStroy?.prefixKey}
          </AffairTypeBox>
        </Tooltip>
        {layer ? null : (
          <Tooltip placement="top" title="复制链接" zIndex={999999}>
            <span style={{ display: 'flex', alignItems: 'center' }}>
              <CommonIconFont
                type="link"
                color="var(--primary-d2)"
                onClick={() => {
                  // console.log(111)
                  copyLink(
                    window.location.href,
                    t('common.copySuccess'),
                    t('common.copyFail'),
                  )
                }}
                size={18}
              ></CommonIconFont>
            </span>
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
