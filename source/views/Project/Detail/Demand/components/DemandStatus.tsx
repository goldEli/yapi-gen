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
  const [active, setActive] = useState(0)
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

    setRows(res2.find((i: any) => i.id === demandInfo.status.id))
  }
  const updateStatus = async (res1: any) => {
    const res = await updateDemandStatus(res1)

    if (res.code === 0) {
      message.success(t('common.circulationSuccess'))
      getDemandInfo({ projectId: props.pid, id: props.sid })
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
                onClick={() => onChangeIdx(i.id, i)}
                style={{
                  color:
                    i.id === demandInfo?.status?.id ? '#2877ff' : '#969799',
                  border:
                    i.id === demandInfo?.status?.id
                      ? '1px solid #2877ff'
                      : '1px solid #EBEDF0',
                  cursor: isCanEdit ? 'pointer' : 'inherit',
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
        {rows && (
          <ShapeContentForDetail
            active={demandInfo.status.status}
            sid={props.sid}
            fromId={demandInfo?.status?.id}
            tap={(value: any) => updateStatus(value)}
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
