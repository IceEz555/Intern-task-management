import { Clock } from 'lucide-react';

const TaskItem = ({ task, onClick }) => {
    // Helper to get status class
    const getStatusClass = (status) => {
        const s = status.toLowerCase().replace(' ', '');
        return `task-status-badge ${s}`; // e.g., 'todo', 'inprogress'
    };

    // Helper to get status dot color
    const getStatusDotColor = (status) => {
        if (status === 'TO DO') return '#f87171'; // Red
        if (status === 'In Progress') return '#facc15'; // Yellow
        if (status === 'Done') return '#4ade80'; // Green
        return '#e5e7eb'; // Gray
    };

    return (
        <div className="task-item" onClick={onClick}>
            <div className="task-left">
                <div
                    className="status-dot"
                    style={{ backgroundColor: getStatusDotColor(task.status) }}
                ></div>
                <div>
                    <h3 className="task-title">{task.title}</h3>
                    <p className="task-meta">{task.id} • {task.date}</p>
                </div>
            </div>
            <div className="task-right">
                <div className="assignee-info">
                    <div className="assignee-avatar">
                        {task.assignee.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="assignee-name">{task.assignee}</span>
                </div>
                <span className={getStatusClass(task.status)}>
                    {task.status}
                </span>
            </div>
        </div>
    );
};

export default TaskItem;
