/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable react/jsx-key */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-empty-function */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/naming-convention */
import styled from '@emotion/styled'
import { Divider, message } from 'antd'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
// import { updateDemandStatus } from '@/services/mine'
import ShapeContentForDetail from '@/components/ShapeForDetail'
import IconFont from '@/components/IconFont'
import { useDispatch, useSelector } from '@store/index'
// import { getDemandInfo, getShapeLeft } from '@/services/demand'
import { getMessage } from '@/components/Message'
import { getShapeFlawLeft, updateFlawStatus } from '@/services/flaw'
import { getFlawCommentList, getFlawInfo } from '@store/flaw/flaw.thunk'
import { setIsUpdateStatus } from '@store/project'
import StatusExamine from '@/components/StatusExamine'
import { cancelVerify } from '@/services/mine'

const StatusWrap = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: 28,
  borderRadius: 6,
  padding: '0 12px',
  fontSize: 14,
  border: '1px solid var(--neutral-n6-d1)',
  color: 'var(--neutral-n3)',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
})

const FlawStatus = (props: any) => {
  const [t] = useTranslation()
  const [active, setActive] = useState<any>(0)
  const [rows, setRows] = useState(null)
  const { projectInfo, isUpdateStatus } = useSelector(store => store.project)
  const { flawInfo } = useSelector(store => store.flaw)
  const [leftList, setLeftList] = useState([])
  const dispatch = useDispatch()
  const isCanEdit =
    projectInfo.projectPermissions?.length > 0 &&
    projectInfo.projectPermissions?.filter(
      (i: any) => i.identity === 'b/flaw/update',
    )?.length > 0

  const onChangeIdx = (id: any, row: any) => {
    if (flawInfo?.isExamine) {
      getMessage({ msg: t('newlyAdd.underReview'), type: 'warning' })
    } else {
      setActive(id)
      setRows(row)
    }
  }
  const init = async () => {
    const res2 = await getShapeFlawLeft({
      id: props.pid,
      nId: props.sid,
    })
    setActive(flawInfo?.status?.id)
    setLeftList(res2)
    dispatch(setIsUpdateStatus(false))
    setRows(res2.find((i: any) => i.id === flawInfo?.status?.id))
  }

  const updateStatus = async (res1: any) => {
    try {
      await updateFlawStatus(res1)
      getMessage({ msg: t('common.circulationSuccess'), type: 'success' })
      dispatch(getFlawInfo({ projectId: props.pid, id: props.sid }))
      dispatch(
        getFlawCommentList({
          projectId: props.pid,
          id: props.sid,
          page: 1,
          pageSize: 20,
        }),
      )
    } catch (error) {
      //
    }
  }

  // 取消审核
  const onCancelExamine = async () => {
    await cancelVerify(flawInfo.id)
    getMessage({ type: 'success', msg: t('other.cancelExamineSuccess') })
    dispatch(getFlawInfo({ projectId: props.pid, id: props.sid }))
  }

  useEffect(() => {
    init()
  }, [])

  useEffect(() => {
    if (isUpdateStatus || flawInfo) {
      init()
    }
  }, [isUpdateStatus, flawInfo])

  return (
    <div>
      <div
        style={{
          display: 'flex',
        }}
      >
        {leftList?.map((i: any, index: number) => {
          return (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <StatusWrap
                onClick={() => {
                  if (isCanEdit && !flawInfo?.isExamine) {
                    onChangeIdx(i.id, i)
                  }
                }}
                style={{
                  color:
                    i.id === active ? 'var(--primary-d2)' : 'var(--neutral-n3)',
                  border:
                    i.id === active
                      ? '1px solid var(--primary-d2)'
                      : '1px solid var(--neutral-n6-d1)',
                  cursor:
                    isCanEdit && !flawInfo?.isExamine
                      ? 'pointer'
                      : 'not-allowed',
                }}
              >
                {i.status.content}
              </StatusWrap>
              <Divider
                style={{
                  width: 48,
                  margin: '0 8px',
                  minWidth: 'auto',
                  display: index === leftList?.length - 1 ? 'none' : 'block',
                }}
                dashed
              />
            </div>
          )
        })}
      </div>

      <div>
        {flawInfo?.isExamine && (
          <StatusExamine type={3} onCancel={onCancelExamine} />
        )}
        {rows && !isUpdateStatus && !flawInfo?.isExamine && (
          <ShapeContentForDetail
            active={flawInfo?.status?.status}
            sid={props.sid}
            fromId={flawInfo?.status?.id}
            tap={updateStatus}
            record={rows}
            row={rows}
            noleft
          />
        )}
      </div>
    </div>
  )
}

export default FlawStatus
