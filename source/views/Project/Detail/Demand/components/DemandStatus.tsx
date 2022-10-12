/* eslint-disable react/jsx-key */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-empty-function */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/naming-convention */
import IconFont from '@/components/IconFont'
import Pop from '@/components/Popconfirm'
import styled from '@emotion/styled'
import { Divider, Form, Input, message, Select, Space } from 'antd'
import { AsyncButton as Button } from '@staryuntech/ant-pro'
import { useModel } from '@/models'
import { useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getParamsData } from '@/tools'
import { getShapeLeft } from '@/services/project/shape'
import { ShapeContent } from '@/components/Shape'
import { updateDemandStatus } from '@/services/mine'

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
})

const DemandStatus = styled.div({
  padding: '16px 24px',
  display: 'flex',
  flexDirection: 'column',
  width: 362,
  '.ant-form-item': {
    margin: '16px 0 0 0',
  },
})

const PopoverFooter = styled(Space)({
  display: 'flex',
  alignItems: 'center',
  marginTop: 36,
  justifyContent: 'flex-end',
})
const Box = styled.div`
  &:last-child {
    visibility: hidden;
  }
`

interface Props {
  hide?(): void
  active?: any
}

const DemandStatusBox = (props: any) => {
  const [t] = useTranslation()
  const { getDemandInfo, demandInfo } = useModel('demand')
  const [active, setActive] = useState(0)
  const { projectInfo } = useModel('project')
  const [leftList, setLeftList] = useState([])
  const isCanEdit
    = projectInfo.projectPermissions?.length > 0
    || projectInfo.projectPermissions?.filter((i: any) => i.name === '编辑需求')
      ?.length > 0

  const onChangeIdx = (id: any) => {
    if (demandInfo?.isExamine) {
      message.warning('该需求正在审核中，现在不能流转操作')
    } else {
      setActive(id)
    }
  }
  const init = async () => {
    const res2 = await getShapeLeft({
      id: props.pid,
      nId: props.sid,
    })
    setLeftList(res2)
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
  }, [])

  // console.log(demandInfo, '====')

  return (
    <>
      {leftList?.map((i: any, index: number) => (
        <Pop
          content={({ onHide }: { onHide(): void }) => {
            return demandInfo?.isExamine
              ? null
              : (
                  <ShapeContent
                    active={demandInfo.status.status}
                    sid={props.sid}
                    fromId={demandInfo?.status?.id}
                    noleft
                    tap={(value: any) => updateStatus(value)}
                    hide={onHide}
                    record={i}
                    row={i}
                  />
                )
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <StatusWrap
              onClick={() => onChangeIdx(i.id)}
              style={{
                color: i.id === demandInfo?.status?.id ? '#2877ff' : '#969799',
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
        </Pop>
      ))}
    </>
  )
}

export default DemandStatusBox
