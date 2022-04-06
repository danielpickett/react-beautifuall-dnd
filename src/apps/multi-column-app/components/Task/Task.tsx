import { TaskType } from '../../initial-data'
import './Task.scss'
import { Draggable } from 'react-beautiful-dnd'
import classNames from 'classnames'

export const Task = ({ task, index }: { task: TaskType; index: number }) => {
  return (
    <Draggable draggableId={task.id} index={index}>
      {({ innerRef, draggableProps, dragHandleProps }, snapshot) => (
        <div
          className={classNames('Task', {
            'Task--is-dragging': snapshot.isDragging,
          })}
          ref={innerRef}
          {...draggableProps}
          {...dragHandleProps}
        >
          {task.content}
        </div>
      )}
    </Draggable>
  )
}
