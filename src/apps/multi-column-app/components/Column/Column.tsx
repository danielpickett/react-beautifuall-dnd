import classNames from 'classnames'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import type { ColumnType, TaskType } from '../../initial-data'
import { Task } from '../Task'
import './Column.scss'

export const Column = ({
  column,
  index,
  tasks,
  isDropDisabled,
}: {
  column: ColumnType
  index: number
  tasks: TaskType[]
  isDropDisabled: boolean
}) => {
  return (
    <Draggable draggableId={column.id} index={index}>
      {(provided) => (
        <div
          className="Column"
          {...provided.draggableProps}
          ref={provided.innerRef}
        >
          <h2 className="Column__title" {...provided.dragHandleProps}>
            {column.title}
          </h2>
          <Droppable
            droppableId={column.id}
            isDropDisabled={isDropDisabled}
            type="task"
          >
            {({ droppableProps, innerRef, placeholder }, snapshot) => (
              <div
                className={classNames('Column__tasks', {
                  'Column__tasks--is-dragging-over': snapshot.isDraggingOver,
                })}
                {...droppableProps}
                ref={innerRef}
              >
                {tasks.map((task, index) => (
                  <Task key={task.id} task={task} index={index} />
                ))}
                {placeholder}
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  )
}
