import React, { useState } from 'react'
import styled from '@emotion/styled'
import StatusModal from '@/components/ChangeStatusPopover/StatusModal'
import { useDispatch, useSelector } from '@store/index'
import {
  closeModifyStatusModalInfo,
  saveModifyStatusModalInfo,
} from '@store/kanBan/kanBan.thunk'

interface ModifyStatusModalProps {}

const ModifyStatusModal: React.FC<ModifyStatusModalProps> = props => {
  const { modifyStatusModalInfo } = useSelector(store => store.kanBan)
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
      // record={props.record}
      onChangeStatusConfirm={data => {
        dispatch(saveModifyStatusModalInfo(data))
      }}
    />
  )
}

export default ModifyStatusModal
