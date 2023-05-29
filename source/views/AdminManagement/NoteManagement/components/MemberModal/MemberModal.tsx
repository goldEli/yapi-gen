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
  console.log(props.showId)

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
      width: 200,
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
      dataIndex: 'phone',
      key: 'phone',
      width: 150,
      render: (text: string) => {
        return <span>{text || '--'}</span>
      },
    },
    {
      title: <span>{t('common.department')}</span>,
      dataIndex: 'department_name',
      key: 'department_name',
      width: 160,
      render: (text: string) => {
        return <span>{text || '--'}</span>
      },
    },
    {
      title: <span>{t('common.job')}</span>,
      dataIndex: 'position_name',
      key: 'position_name',
      width: 120,
      render: (text: string) => {
        return <span>{text || '--'}</span>
      },
    },
    {
      title: <span>{t('common.permissionGroup')}</span>,
      dataIndex: 'role_name',
      key: 'role_name',
      width: 170,
      render: (text: string) => {
        return <span>{text || '--'}</span>
      },
    },
    {
      title: <span>{t('common.status')}</span>,
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (
        text: string | number,
        record: Record<string, string | number>,
      ) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span
              style={{
                display: 'inline-block',
                width: 8,
                height: 8,
                borderRadius: '50%',
                marginRight: 8,
                background: text === 2 ? 'var(--neutral-n5)' : '#43ba9a',
              }}
            />
            {text === 1 ? t('common.job1') : t('common.job2')}
          </div>
        )
      },
    },
    {
      title: <span>{t('between_jobs')}</span>,
      dataIndex: 'handover_status',
      key: 'handover_status',
      width: 120,
      render: (
        text: string | number,
        record: Record<string, string | number>,
      ) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span
              style={{
                display: 'inline-block',
                width: 8,
                height: 8,
                marginRight: 8,
                borderRadius: '50%',
                background: text === 1 ? 'var(--neutral-n5)' : '#A176FB',
              }}
            />
            {text === 1 ? t('normal') : t('handed_over')}
          </div>
        )
      },
    },
    {
      title: <span>{t('staff.projectCount')}</span>,
      dataIndex: 'project_num',
      key: 'project_num',
      width: 135,
      render: (text: string) => {
        return <span>{text || '--'}</span>
      },
    },
    {
      title: <span>{t('common.createTime')}</span>,
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text: string) => {
        return <span>{text || '--'}</span>
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
    console.log(res)

    setListData(res.list)
    setIsSpinning(false)
    setTotal(res.pager.total)
  }
  useEffect(() => {
    if (props.isVisible) {
      getStaffListData()
    }
  }, [props.isVisible])
  useEffect(() => {
    getStaffListData()
  }, [page, pagesize])
  return (
    <CommonModal
      onClose={() => props.onCloseMember()}
      title="查看成员"
      width={832}
      hasFooter={<span></span>}
      isVisible={props.isVisible}
    >
      <div
        style={{
          height: 'calc(100vh - 302px)',
          overflow: 'auto',
          padding: '0 24px',
        }}
      >
        <ResizeTable
          isSpinning={isSpinning}
          dataWrapNormalHeight="100%"
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
