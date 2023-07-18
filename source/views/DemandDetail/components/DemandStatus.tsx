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
import { updateDemandStatus } from '@/services/mine'
import ShapeContentForDetail from '@/components/ShapeForDetail'
import IconFont from '@/components/IconFont'
import { useDispatch, useSelector } from '@store/index'
import { getDemandInfo, getShapeLeft } from '@/services/demand'
import { setDemandInfo } from '@store/demand'
import { getMessage } from '@/components/Message'
import { setIsUpdateStatus } from '@store/project'
import { getDemandCommentList } from '@store/demand/demand.thunk'

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

const DemandStatusBox = (props: any) => {
  const [t] = useTranslation()
  const [active, setActive] = useState(0)
  const [rows, setRows] = useState(null)
  const { projectInfo, isUpdateStatus } = useSelector(store => store.project)
  const { demandInfo } = useSelector(store => store.demand)
  const [leftList, setLeftList] = useState([])
  const dispatch = useDispatch()
  const isCanEdit =
    projectInfo.projectPermissions?.length > 0 &&
    projectInfo.projectPermissions?.filter(
      (i: any) => i.identity === 'b/story/update',
    )?.length > 0

  const onChangeIdx = (id: any, row: any) => {
    if (demandInfo?.isExamine) {
      getMessage({ msg: t('newlyAdd.underReview'), type: 'warning' })
    } else {
      setActive(id)
      setRows(row)
    }
  }
  const init = async () => {
    const res2 = await getShapeLeft({
      id: props.pid,
      nId: props.sid,
    })
    setActive(demandInfo?.status?.id)
    setLeftList(res2)
    dispatch(setIsUpdateStatus(false))
    setRows(res2.find((i: any) => i.id === demandInfo?.status?.id))
  }

  const updateStatus = async (res1: any) => {
    try {
      await updateDemandStatus(res1)
      getMessage({ msg: t('common.circulationSuccess'), type: 'success' })
      const result = await getDemandInfo({
        projectId: props.pid,
        id: props.sid,
      })
      dispatch(setDemandInfo(result))
      dispatch(
        getDemandCommentList({
          projectId: props.pid,
          demandId: props.sid,
          page: 1,
          pageSize: 999,
        }),
      )
    } catch (error) {
      //
    }
  }

  useEffect(() => {
    init()
  }, [])

  useEffect(() => {
    init()
  }, [demandInfo])

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
                  if (isCanEdit && !demandInfo?.isExamine) {
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
                    isCanEdit && !demandInfo?.isExamine
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
        {demandInfo?.isExamine && (
          <div
            style={{
              backgroundColor: 'var(--neutral-n6-d1)',
              width: '100%',
              height: '54px',
              zIndex: 1,
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              marginTop: '10px',
              paddingLeft: '18px',
            }}
          >
            <IconFont
              type="Warning"
              style={{
                fontSize: 17,
                color: '#FA9746',
              }}
            />
            <span
              style={{
                color: 'var(--neutral-n3)',
                fontSize: '14px',
                marginLeft: '10px',
              }}
            >
              {t('newlyAdd.underReview')}
            </span>
          </div>
        )}
        {rows && !demandInfo?.isExamine && (
          <ShapeContentForDetail
            active={demandInfo?.status?.status}
            sid={props.sid}
            fromId={demandInfo?.status?.id}
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

export default DemandStatusBox
