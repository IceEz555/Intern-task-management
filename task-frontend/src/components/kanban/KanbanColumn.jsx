import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import KanbanCard from "./KanbanCard"

const KanbanColumn = ({ id, title, tasks }) => {
    const { setNodeRef } = useDroppable({
        id: id,
    });

    return (
        <div ref={setNodeRef}
            className="bg-gray-100 p-4 rounded-lg w-80 flex-shrink-0 flex flex-col h-fit max-h-full">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-700">{title}</h3>
                <span className="font-bold text-gray-700">{tasks.length}</span>
            </div>

            {/* Task List (Sortable Area) */}
            <SortableContext
                id={id}
                items={tasks}
                strategy={verticalListSortingStrategy}
            >
                <div className="flex flex-col gap-3 overflow-y-auto min-h-[100px]">
                    {tasks.map((task) => (
                        <KanbanCard key={task.id} id={task.id} task={task} />
                    ))}
                </div>
            </SortableContext>
        </div>
    );
}
export default KanbanColumn;
