import React from 'react'
import { Draggable } from 'react-beautiful-dnd'
import { useSelector } from '@store/index'
import './styles.css'

export const SortableItem = (props: any) => {
  const { sprintTableData } = useSelector(state => state.sprint)
  const id = props['data-row-key']

  const [groupId, itemId] = id.split('-')

  const { style, className, children, ...rest } = props
  const index = sprintTableData
    ?.find(item => item.id === groupId)
    ?.list?.findIndex(item => item.id === itemId)

  return (
    <Draggable key={id} draggableId={id} index={index ?? 0}>
      {(provided, snapshot) => (
        <tr
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={[
            className,
            'dragItem',
            snapshot.isDragging ? 'dragOverlay' : null,
          ]
            .filter(c => c)
            .join(' ')}
          {...rest}
          data-cypress="draggable-item"
        >
          {React.Children.map(children, child => {
            if (child.key === 'sort') {
              return React.cloneElement(child, {
                additionalProps: { 'data-cypress': 'draggable-handle' },
              })
            }

            return child
          })}
        </tr>
      )}
    </Draggable>
  )
}
