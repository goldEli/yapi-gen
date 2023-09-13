import React from 'react'
import { Draggable } from 'react-beautiful-dnd'
import { useSelector } from '@store/index'
import './styles.css'

export const SortableItem = (props: any) => {
  const { rightSprintList } = useSelector(state => state.sprint)
  const id = props['data-row-key']
  const [groupId, itemId] = id.split('_')
  const { style, className, children, ...rest } = props
  const index = rightSprintList
    ?.find((item: any) => item.id === Number(groupId))
    ?.stories?.findIndex((item: any) => item.id === Number(itemId))

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
