import './App.scss'
import React, { useState } from 'react'
import {
  DragDropContext,
  DropResult,
  Droppable,
  Draggable,
} from 'react-beautiful-dnd'
import { initialData, TaskType, ColumnType } from './initial-data'
import classNames from 'classnames'

export const App = () => {
  const [state, setState] = useState(initialData)

  const handleDragEnd = ({ destination, source, draggableId }: DropResult) => {
    if (!destination) return

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return

    const column = state.columns[source.droppableId]
    const newTaskIds = [...column.taskIds]
    newTaskIds.splice(source.index, 1)
    newTaskIds.splice(destination.index, 0, draggableId)

    const newColumn = {
      ...column,
      taskIds: newTaskIds,
    }

    const newState = {
      ...state,
      columns: {
        ...state.columns,
        [newColumn.id]: newColumn,
      },
    }

    setState(newState)
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="app">
        {state.columnOrder.map((columnId) => {
          const column = state.columns[columnId]
          const tasks = column.taskIds.map((taskId) => state.tasks[taskId])

          return <Column column={column} tasks={tasks} key={column.id} />
        })}
      </div>
    </DragDropContext>
  )
}

const Column = ({
  column,
  tasks,
}: {
  column: ColumnType
  tasks: TaskType[]
}) => {
  return (
    <Droppable droppableId="column-1">
      {(provided) => (
        <div
          className="column"
          {...provided.droppableProps}
          ref={provided.innerRef}
        >
          <h1 className="column-name">{column.title}</h1>
          {tasks.map((task, index) => (
            <Task task={task} key={task.id} index={index} />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  )
}

const Task = ({ task, index }: { task: TaskType; index: number }) => {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          className={classNames('task', {
            'task--is-dragging': snapshot.isDragging,
          })}
          {...provided.dragHandleProps}
          {...provided.draggableProps}
          ref={provided.innerRef}
        >
          {task.content}
        </div>
      )}
    </Draggable>
  )
}
