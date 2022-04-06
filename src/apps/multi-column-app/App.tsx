import './App.scss'
import { useState } from 'react'
import {
  DragDropContext,
  Droppable,
  DropResult,
  DragStart,
} from 'react-beautiful-dnd'
import { initialData } from './initial-data'
import { Column } from './components'

export const App = () => {
  const [state, setState] = useState(initialData)
  const [homeIndex, setHomeIndex] = useState<number | null>(null)

  const handleDragStart = (start: DragStart) => {
    setHomeIndex(state.columnOrder.indexOf(start.source.droppableId))
  }

  const handleDragEnd = ({
    destination,
    source,
    draggableId,
    type,
  }: DropResult) => {
    setHomeIndex(null)
    if (!destination) return

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return

    if (type === 'column') {
      const newColumnOrder = [...state.columnOrder]
      newColumnOrder.splice(source.index, 1)
      newColumnOrder.splice(destination.index, 0, draggableId)

      setState({
        ...state,
        columnOrder: newColumnOrder,
      })

      return
    }

    const start = state.columns[source.droppableId]
    const finish = state.columns[destination.droppableId]

    if (start === finish) {
      const newTaskIds = [...start.taskIds]
      newTaskIds.splice(source.index, 1)
      newTaskIds.splice(destination.index, 0, draggableId)

      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      }

      setState({
        ...state,
        columns: {
          ...state.columns,
          [newColumn.id]: newColumn,
        },
      })
    }

    const startTaskIds = [...start.taskIds]
    startTaskIds.splice(source.index, 1)
    const newStart = {
      ...start,
      taskIds: startTaskIds,
    }

    const finishTaskIds = [...finish.taskIds]
    finishTaskIds.splice(destination.index, 0, draggableId)
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    }

    setState({
      ...state,
      columns: {
        ...state.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    })
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
      <Droppable droppableId="all-columns" direction="horizontal" type="column">
        {(provided) => (
          <div
            className="App"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {state.columnOrder.map((columnId, index) => {
              const column = state.columns[columnId]
              const tasks = column.taskIds.map((taskId) => state.tasks[taskId])
              const isDropDisabled =
                typeof homeIndex === 'number' && index < homeIndex
              return (
                <Column
                  column={column}
                  index={index}
                  tasks={tasks}
                  key={column.id}
                  isDropDisabled={isDropDisabled}
                />
              )
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}
