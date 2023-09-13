import React, { useState } from 'react'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import ColumnTitleArea from '../ColumnTitleArea'
import useKanBanData from '../hooks/useKanBanData'
import IssuesGroupList from '../IssuesGroupList'

const KanBanSortByPerson = () => {
  const { data, onDragEnd, onDragStart } = useKanBanData()

  return (
    <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
      <ColumnTitleArea />
      <IssuesGroupList data={data} />
    </DragDropContext>
  )
}

export default KanBanSortByPerson
