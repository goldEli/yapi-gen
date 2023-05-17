import React, { useState } from 'react'
import { columnsFromBackend, issueColumns } from './data'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import ColumnTitleArea from '../ColumnTitleArea'
import useKanBanData from '../hooks/useKanBanData'
import IssuesGroupList from '../IssuesGroupList'

const KanBanDefault = () => {
  const { data, onDragEnd } = useKanBanData(columnsFromBackend)

  return (
    <DragDropContext
      onDragEnd={onDragEnd}
      onDragStart={start => {
        console.log(start)
      }}
    >
      <ColumnTitleArea />
      <IssuesGroupList data={data} />
    </DragDropContext>
  )
}

export default KanBanDefault
