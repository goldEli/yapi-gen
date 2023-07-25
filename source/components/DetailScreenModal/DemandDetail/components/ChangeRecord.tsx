/* eslint-disable no-undefined */
// 需求详情-变更记录
import { Space } from 'antd'
import { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { HiddenText } from '@/components/StyleCommon'
import { useSearchParams } from 'react-router-dom'
import Sort from '@/components/Sort'
import { OmitText } from '@star-yun/ui'
import { useTranslation } from 'react-i18next'
import NoData from '@/components/NoData'
import { getParamsData } from '@/tools'
import CommonModal from '@/components/CommonModal'
import { useDispatch, useSelector } from '@store/index'
import { setIsRefresh } from '@store/user'
import PaginationBox from '@/components/TablePagination'
import ResizeTable from '@/components/ResizeTable'
import { Editor } from '@xyfe/uikit'
import { setIsUpdateChangeLog } from '@store/project'
import { getDemandChangeLog } from '@/services/demand'
import { ComputedWrap } from '../style'
import CommonFilter from '../../CommonFilter'
const SpaceWrap = styled(Space)({
  '.ant-space-item': {
    width: '48.5%',
  },
  img: {
    maxWidth: '100%',
  },
})

const TitleWrap = styled(Space)({
  height: 40,
  background: 'var(--neutral-n8)',
  padding: '0 24px',
  borderRadius: 6,
  color: 'var(--neutral-n1-d1)',
  fontSize: 14,
  marginBottom: 24,
})

const ContentWrap = styled.div({
  display: 'flex',
  flexDirection: 'column',
  height: '60vh',
  overflow: 'auto',
  padding: '0 24px 16px 24px',
})

const NewSort = (sortProps: any) => {
  return (
    <Sort
      fixedKey={sortProps.fixedKey}
      onChangeKey={sortProps.onUpdateOrderKey}
      nowKey={sortProps.nowKey}
      order={sortProps.order === 'asc' ? 1 : 2}
    >
      {sortProps.children}
    </Sort>
  )
}

interface Props {
  activeKey: string
  filter?: boolean
}

const ChangeRecord = (props: Props) => {
  const [t] = useTranslation()
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const { id } = paramsData
  const [dataList, setDataList] = useState<any>({
    list: undefined,
  })
  const [checkDetail, setCheckDetail] = useState<any>({})
  const [isVisible, setIsVisible] = useState(false)
  const [order, setOrder] = useState<any>({ value: '', key: '' })
  const [pageObj, setPageObj] = useState({ page: 1, size: 20 })
  const [isSpinning, setIsSpinning] = useState(false)
  const dispatch = useDispatch()
  const { isRefresh } = useSelector(store => store.user)
  const { isUpdateChangeLog } = useSelector(store => store.project)
  const { demandInfo } = useSelector(store => store.demand)

  const getList = async (item?: any, orderVal?: any) => {
    setIsSpinning(true)
    const result = await getDemandChangeLog({
      demandId: demandInfo.id,
      projectId: id,
      page: item ? item.page : 1,
      pageSize: item ? item.size : 10,
      order: orderVal.value,
      orderKey: orderVal.key,
    })
    setDataList(result)
    setIsSpinning(false)
    dispatch(setIsRefresh(false))
    dispatch(setIsUpdateChangeLog(false))
  }

  useEffect(() => {
    if (props.activeKey === '4') {
      getList(pageObj, order)
    }
  }, [props.activeKey])

  useEffect(() => {
    if (isRefresh) {
      getList({ page: 1, size: pageObj.size }, order)
    }
  }, [isRefresh])

  useEffect(() => {
    if (isUpdateChangeLog) {
      getList(pageObj, order)
    }
  }, [isUpdateChangeLog])

  const onClickCheck = (item: any) => {
    setCheckDetail(item)
    setIsVisible(true)
  }

  const fieldContent = (item: any, i: string) => {
    if (i === 'tag') {
      return item[i]?.length
        ? item[i]?.map((k: any) => k?.name).join(';')
        : '--'
    } else if (i === 'users' || i === 'copysend' || i === 'attachment') {
      return item[i]?.length ? item[i].join(';') : '--'
    } else if (i === 'status') {
      return item[i]
    } else {
      return item[i] || '--'
    }
  }

  const onUpdateOrderKey = (key: any, val: any) => {
    setOrder({ value: val === 2 ? 'desc' : 'asc', key })
    getList(
      { page: 1, size: pageObj.size },
      { value: val === 2 ? 'desc' : 'asc', key },
    )
  }

  const columns = [
    {
      title: (
        <NewSort
          fixedKey="id"
          nowKey={order.key}
          order={order.value}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          {t('common.serialNumber')}
        </NewSort>
      ),
      dataIndex: 'id',
      width: 110,
    },
    {
      title: (
        <NewSort
          fixedKey="created_at"
          nowKey={order.key}
          order={order.value}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          {t('project.changeTime')}
        </NewSort>
      ),
      dataIndex: 'updateTime',
      width: 180,
    },
    {
      title: (
        <NewSort
          fixedKey="user_name"
          nowKey={order.key}
          order={order.value}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          {t('project.changeName')}
        </NewSort>
      ),
      dataIndex: 'userName',
      width: 140,
    },
    {
      title: (
        <NewSort
          fixedKey="change_log_type"
          nowKey={order.key}
          order={order.value}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          {t('project.changeType')}
        </NewSort>
      ),
      dataIndex: 'type',
      width: 160,
      render: (text: any) => {
        return <div>{text?.content_txt}</div>
      },
    },
    {
      title: (
        <NewSort
          fixedKey="fields"
          nowKey={order.key}
          order={order.value}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          {t('project.changeFields')}
        </NewSort>
      ),
      dataIndex: 'fields',
      width: 160,
      render: (text: []) => {
        return (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '16px 0',
            }}
          >
            {Object.keys(text)?.map((i: any) =>
              i === 'custom_field' ? (
                (text[i] as any).map((k: any) => (
                  <span key={k.field}>{k.name}</span>
                ))
              ) : (
                <span key={Math.random()}>{text[i]}</span>
              ),
            )}
          </div>
        )
      },
    },
    {
      title: (
        <NewSort
          fixedKey="before"
          nowKey={order.key}
          order={order.value}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          {t('project.changeBefore')}
        </NewSort>
      ),
      dataIndex: 'beforeField',
      width: 200,
      render: (text: any, record: any) => {
        return (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '16px 0',
            }}
          >
            {Object.keys(record?.fields).map((i: any) => (
              <span key={i}>
                {i === 'info' ? (
                  <span
                    style={{ cursor: 'pointer', color: 'var(--primary-d2)' }}
                    onClick={() => onClickCheck(record)}
                  >
                    {text
                      ? text[i]?.length
                        ? t('project.checkInfo')
                        : '--'
                      : '--'}
                  </span>
                ) : i === 'custom_field' ? (
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {record.beforeField
                      ? record.fields.custom_field
                          ?.map(
                            (m: any) => record.beforeField[i][m.field]?.value,
                          )
                          ?.map((k: any) => (
                            <span key={k}>
                              {(Array.isArray(k) ? k.join(';') : k) || '--'}
                            </span>
                          ))
                      : record.fields.custom_field?.map((m: any) => (
                          <span key={m}>--</span>
                        ))}
                  </div>
                ) : (
                  <HiddenText>
                    <OmitText
                      width={300}
                      tipProps={{
                        getPopupContainer: node => node,
                      }}
                    >
                      <span>{text ? fieldContent(text, i) : '--'}</span>
                    </OmitText>
                  </HiddenText>
                )}
              </span>
            ))}
          </div>
        )
      },
    },
    {
      title: (
        <NewSort
          fixedKey="after"
          nowKey={order.key}
          order={order.value}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          {t('project.changeAfter')}
        </NewSort>
      ),
      dataIndex: 'afterField',
      width: 200,
      render: (text: any, record: any) => {
        return (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '16px 0',
            }}
          >
            {Object.keys(record?.fields).map((i: any) => (
              <span key={i}>
                {i === 'info' ? (
                  <span
                    style={{ cursor: 'pointer', color: 'var(--primary-d2)' }}
                    onClick={() => onClickCheck(record)}
                  >
                    {text
                      ? text[i]?.length
                        ? t('project.checkInfo')
                        : '--'
                      : '--'}
                  </span>
                ) : i === 'custom_field' ? (
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {record.afterField
                      ? record.fields.custom_field
                          ?.map(
                            (m: any) => record.afterField[i][m.field]?.value,
                          )
                          ?.map((k: any) => (
                            <span key={k}>
                              {(Array.isArray(k) ? k.join(';') : k) || '--'}
                            </span>
                          ))
                      : record.fields.custom_field?.map((m: any) => (
                          <span key={m}>--</span>
                        ))}
                  </div>
                ) : (
                  <HiddenText>
                    <OmitText
                      width={300}
                      tipProps={{
                        getPopupContainer: node => node,
                      }}
                    >
                      <span>{text ? fieldContent(text, i) : '--'}</span>
                    </OmitText>
                  </HiddenText>
                )}
              </span>
            ))}
          </div>
        )
      },
    },
  ]

  const onChangePage = (page: number, size: number) => {
    setPageObj({ page, size })
    getList({ page, size }, order)
  }

  return (
    <ComputedWrap>
      <CommonModal
        isVisible={isVisible}
        title={t('project.changeInfo')}
        width={1080}
        onClose={() => setIsVisible(false)}
        isShowFooter
      >
        <SpaceWrap
          size={32}
          style={{
            display: 'flex',
            width: '100%',
            alignItems: 'flex-start',
            paddingRight: 16,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <TitleWrap>{t('project.changeBefore')}</TitleWrap>
            <ContentWrap>
              <Editor
                value={checkDetail?.beforeField?.info}
                getSuggestions={() => []}
                readonly
              />
            </ContentWrap>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <TitleWrap>{t('project.changeAfter')}</TitleWrap>
            <ContentWrap>
              <Editor
                value={checkDetail?.afterField?.info}
                getSuggestions={() => []}
                readonly
              />
            </ContentWrap>
          </div>
        </SpaceWrap>
      </CommonModal>
      {props.filter ? <CommonFilter></CommonFilter> : null}
      <ResizeTable
        isSpinning={isSpinning}
        dataWrapNormalHeight="calc(100% - 60px)"
        col={columns}
        dataSource={dataList?.list}
        noData={<NoData />}
      />
      <PaginationBox
        currentPage={dataList?.currentPage}
        pageSize={pageObj?.size}
        total={dataList?.total}
        onChange={onChangePage}
        hasPadding
      />
    </ComputedWrap>
  )
}

export default ChangeRecord
