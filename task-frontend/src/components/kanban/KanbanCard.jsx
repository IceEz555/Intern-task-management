import { useSortable } from "@dnd-kit/sortable"
import { CSS } from '@dnd-kit/utilities'

const KanbanCard = ({ id, task, onClick }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1, // จางลงเมื่อถูกลาก
    }

    // Helper for Priority Colors
    const getPriorityColor = (priority) => {
        if (!priority) return 'bg-gray-100 text-gray-600';
        switch (priority.toLowerCase()) {
            case 'high': return 'bg-red-50 text-red-700 border border-red-100';
            case 'medium': return 'bg-yellow-50 text-yellow-700 border border-yellow-100';
            case 'low': return 'bg-green-50 text-green-700 border border-green-100';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}
            onClick={() => onClick(task)}
            className="group bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing">

            {/* Header: Priority Badge */}
            <div className="mb-3">
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${getPriorityColor(task.priority)}`}>
                    {task.priority || 'No Priority'}
                </span>
            </div>

            {/* Body: Title */}
            <h4 className="font-semibold text-gray-800 text-[15px] leading-snug mb-4">
                {task.title}
            </h4>

            {/* Footer: Avatar & Date */}
            <div className="flex justify-between items-center pt-2">
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-xs font-bold border border-gray-100">
                    {task.assignee
                        ? task.assignee.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
                        : 'U'}
                </div>

                {/* Due Date */}
                {task.due_date && (
                    <div className="text-xs text-gray-400 font-medium font-mono">
                        {new Date(task.due_date).toISOString().split('T')[0]}
                    </div>
                )}
            </div>
        </div>
    )
}

export default KanbanCard 