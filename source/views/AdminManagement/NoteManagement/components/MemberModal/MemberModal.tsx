/* eslint-disable no-undefined */
import CommonModal from '@/components/CommonModal'
import CommonUserAvatar from '@/components/CommonUserAvatar'
import NoData from '@/components/NoData'
import ResizeTable from '@/components/ResizeTable'
import { HiddenText } from '@/components/StyleCommon'
import PaginationBox from '@/components/TablePagination'
import { getStaffList } from '@/services/staff'
import { getMyAllSysNoticeNumber } from '@/services/sysNotice'
import { css } from '@emotion/css'
import { OmitText } from '@star-yun/ui'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
const flexCss = css`
  display: flex;
  align-items: center;
`

const MemberModal = (props: any) => {
  const [t] = useTranslation()
  const [isSpinning, setIsSpinning] = useState(false)
  const [listData, setListData] = useState<any>(undefined)
  const [page, setPage] = useState<number>(1)
  const [pagesize, setPagesize] = useState<number>(10)
  const [total, setTotal] = useState<number>(0)
  const onChangePage = (newPage: any, size: any) => {
    setPagesize(size)
    setPage(newPage)
  }

  const colums = [
    {
      width: 140,
      title: t('common.nickname'),
      dataIndex: 'nickname',
      key: 'nickname',
      render: (text: any, record: any) => {
        return (
          <div className={flexCss}>
            {record.avatar ? (
              <img
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  marginRight: 8,
                }}
                src={record.avatar}
                alt=""
              />
            ) : (
              <span
                style={{
                  marginRight: 8,
                }}
              >
                <CommonUserAvatar size="small" />
              </span>
            )}
            <HiddenText>
              <OmitText
                width={100}
                tipProps={{
                  getPopupContainer: node => node,
                }}
              >
                {text}
              </OmitText>
            </HiddenText>
          </div>
        )
      },
    },
    {
      width: 150,
      title: <span>{t('project.realName')}</span>,
      dataIndex: 'name',
      key: 'name',
      render: (text: string | number) => {
        return <div>{text}</div>
      },
    },
    {
      title: <span>{t('common.sex')}</span>,
      dataIndex: 'gender',
      key: 'gender',
      width: 100,
      render: (
        text: string | number,
        record: Record<string, string | number>,
      ) => {
        return <div>{text === 1 ? t('common.male') : t('common.female')}</div>
      },
    },
    {
      title: <span>{t('common.email')}</span>,
      dataIndex: 'email',
      key: 'email',
      width: 200,
      render: (text: string) => {
        return <span>{text || '--'}</span>
      },
    },
    {
      title: <span>{t('common.phone')}</span>,
      dataIndex: 'account',
      key: 'phone',
      width: 150,
      render: (text: any) => {
        return <span>{text.phone || '--'}</span>
      },
    },
    {
      title: <span>{t('common.department')}</span>,
      dataIndex: 'department',
      key: 'department_name',
      width: 160,
      render: (text: any) => {
        return <span>{text?.name || '--'}</span>
      },
    },
    {
      title: <span>{t('common.job')}</span>,
      dataIndex: 'position',
      key: 'position_name',
      width: 120,
      render: (text: any) => {
        return <span>{text?.name || '--'}</span>
      },
    },
  ]
  const getStaffListData = async () => {
    setIsSpinning(true)
    const res = await getMyAllSysNoticeNumber({
      id: props.showId,
      page,
      pagesize,
    })

    setListData(res.list)
    setIsSpinning(false)
    setTotal(res.pager.total)
  }

  useEffect(() => {
    if (props.isVisible) {
      getStaffListData()
    }
  }, [page, pagesize, props.isVisible])
  return (
    <CommonModal
      onClose={() => props.onCloseMember()}
      title={t('performance.watchMenber')}
      width={832}
      hasFooter={<span></span>}
      isVisible={props.isVisible}
    >
      <div
        style={{
          height: 'calc(100vh - 400px)',
          overflow: 'auto',
          padding: '0 24px',
        }}
      >
        <ResizeTable
          isSpinning={isSpinning}
          dataWrapNormalHeight="calc(100vh - 200px)"
          col={colums}
          dataSource={listData}
          noData={<NoData />}
        />
      </div>
      <div
        style={{
          padding: '0 24px',
        }}
      >
        <PaginationBox
          total={total}
          pageSize={pagesize}
          currentPage={page}
          onChange={onChangePage}
        />
      </div>
    </CommonModal>
  )
}

export default MemberModal
