import React, { useState } from 'react'
import styled from '@emotion/styled'
import StatusModal from '@/components/ChangeStatusPopover/StatusModal'
import { useDispatch, useSelector } from '@store/index'
import {
  closeModifyStatusModalInfo,
  saveModifyStatusModalInfo,
} from '@store/kanBan/kanBan.thunk'
import { getProjectIdByUrl } from '@/tools'

interface ModifyStatusModalProps {}

const ModifyStatusModal: React.FC<ModifyStatusModalProps> = props => {
  const { modifyStatusModalInfo } = useSelector(store => store.kanBan)
  const { projectInfo } = useSelector(store => store.project)

  const dispatch = useDispatch()
  if (!modifyStatusModalInfo.info) {
    return <></>
  }

  return (
    <StatusModal
      isVisible={modifyStatusModalInfo.visible}
      checkStatusItem={modifyStatusModalInfo.info}
      onClose={() => {
        dispatch(closeModifyStatusModalInfo())
      }}
      type={projectInfo.projectType}
      // record={props.record}
      onChangeStatusConfirm={data => {
        dispatch(saveModifyStatusModalInfo(data))
      }}
    />
  )
}

export default ModifyStatusModal
