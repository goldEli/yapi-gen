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
import { useModel } from '@/models'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getShapeLeft } from '@/services/project/shape'
import { updateDemandStatus } from '@/services/mine'
import ShapeContentForDetail from '@/components/ShapeForDetail'
import PubSub from 'pubsub-js'
import IconFont from '@/components/IconFont'

const StatusWrap = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: 28,
  borderRadius: 6,
  padding: '0 12px',
  fontSize: 14,
  border: '1px solid #EBEDF0',
  color: '#969799',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
})

const DemandStatusBox = (props: any) => {
  const [t] = useTranslation()
  const { getDemandInfo, demandInfo, isUpdateStatus, setIsUpdateStatus } =
    useModel('demand')
  const [active, setActive] = useState(demandInfo?.status?.id)
  const [rows, setRows] = useState(null)
  const { projectInfo } = useModel('project')
  const [leftList, setLeftList] = useState([])
  const isCanEdit =
    projectInfo.projectPermissions?.length > 0 &&
    projectInfo.projectPermissions?.filter((i: any) => i.name === '编辑需求')
      ?.length > 0

  const onChangeIdx = (id: any, row: any) => {
    if (demandInfo?.isExamine) {
      message.warning(t('newlyAdd.underReview'))
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
    setLeftList(res2)
    setIsUpdateStatus(false)
    setRows(res2.find((i: any) => i.id === active))
  }

  const updateStatus = async (res1: any) => {
    try {
      await updateDemandStatus(res1)
      message.success(t('common.circulationSuccess'))
      await getDemandInfo({ projectId: props.pid, id: props.sid })
      await init()
      PubSub.publish('watch')
    } catch (error) {
      //
    }
  }

  useEffect(() => {
    init()
  }, [isUpdateStatus])

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
                  color: i.id === active ? '#2877ff' : '#969799',
                  border:
                    i.id === active ? '1px solid #2877ff' : '1px solid #EBEDF0',
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
              backgroundColor: '#F9FAFA',
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
                color: '#969799',
                fontSize: '14px',
                marginLeft: '10px',
              }}
            >
              该需求正在审核中，现在不能流转操作！
            </span>
          </div>
        )}
        {rows && !isUpdateStatus && !demandInfo?.isExamine && (
          <ShapeContentForDetail
            active={demandInfo.status.status}
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
