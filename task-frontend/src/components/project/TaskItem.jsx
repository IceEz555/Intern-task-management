import { Clock } from 'lucide-react';

const TaskItem = ({ task, onClick }) => {
    // Helper to get status class
    const getStatusClass = (status) => {
        // 'To Do' -> 'to-do', 'In Progress' -> 'in-progress'
        const s = status.toLowerCase().replace(/\s+/g, '-');
        return `task-status-badge ${s}`;
    };

    // Helper to get status dot color
    const getStatusDotColor = (status) => {
        if (status === 'To Do') return '#2563eb'; // Blue
        if (status === 'In Progress') return '#ca8a04';  // Yellow
        if (status === 'In Review') return '#6d28d9'; // Indigo
        if (status === 'Done') return '#16a34a'; // Green
        return '#9ca3af'; // Gray
    }

    // Helper to format date
    const formatDueDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const isOverdue = (dateString, status) => {
        if (!dateString || status === 'Done') return false;
        const due = new Date(dateString);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return due < today;
    };

    const overdue = isOverdue(task.due_date, task.status);

    return (
        <div className="task-item" onClick={onClick}>
            <div className="task-left">
                <div
                    className="status-dot"
                    style={{ backgroundColor: getStatusDotColor(task.status) }}
                ></div>
                <div>
                    <h3 className="task-title">{task.title}</h3>
                    <p className="task-meta flex items-center gap-1">
                        {task.description && (
                            <span className="mr-1">{task.description}</span>
                        )}
                        {task.due_date && <span className="text-gray-300 mx-1">•</span>}

                        {task.due_date && (
                            <span className={`flex items-center gap-1 ${overdue ? 'text-red-600 font-bold' : ''}`}>
                                {overdue && <Clock size={12} className="text-red-500" />}
                                {formatDueDate(task.due_date)}
                                {overdue && <span className="text-xs bg-red-100 text-red-600 px-1 rounded ml-1">Overdue</span>}
                            </span>
                        )}
                    </p>
                </div>
            </div>
            <div className="task-right flex items-center gap-4">
                <div className="assignee-info flex items-center gap-2">
                    <div className="assignee-avatar w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
                        {task.assignee ? task.assignee.split(' ').map(n => n[0]).join('') : 'U'}
                    </div>
                    <span className="assignee-name text-sm text-gray-600">{task.assignee || 'Unassigned'}</span>
                </div>
                <span className={getStatusClass(task.status)}>
                    {task.status}
                </span>
            </div>
        </div>
    );
};

export default TaskItem;
