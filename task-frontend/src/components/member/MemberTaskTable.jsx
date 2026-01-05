import React from 'react';
import { Clock } from 'lucide-react';

const MemberTaskTable = ({ tasks, loading, onEditClick }) => {

    const getPriorityClass = (priority) => {
        switch (priority) {
            case 'High': return 'priority-high';
            case 'Medium': return 'priority-medium';
            case 'Low': return 'priority-low';
            default: return 'priority-low';
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'Done': return 'status-done';
            case 'In Progress': return 'status-in-progress';
            case 'To Do': return 'status-to-do';
            case 'In Review': return 'status-in-review';
            default: return 'status-to-do';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'No date';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const isOverdue = (dateString, status) => {
        if (!dateString || status === 'Done') return false;
        const due = new Date(dateString);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Compare dates only
        return due < today;
    };

    return (
        <div className="task-table-container">
            <table className="task-table">
                <thead>
                    <tr>
                        <th>Task Name</th>
                        <th>Project</th>
                        <th>Priority</th>
                        <th>Status</th>
                        <th>Due Date</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {loading ? (
                        <tr>
                            <td colSpan="6" className="text-center py-12 text-gray-500">Loading tasks...</td>
                        </tr>
                    ) : tasks.length > 0 ? (
                        tasks.map(task => {
                            const overdue = isOverdue(task.due_date, task.status);
                            return (
                                <tr key={task.task_id} className="task-row group">
                                    <td>
                                        <div>
                                            <p className="font-semibold text-gray-800">{task.title}</p>
                                            <span className="text-xs text-gray-400">T-{task.task_id}</span>
                                        </div>
                                    </td>
                                    <td>
                                        {task.project_name ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                                <span className="text-sm text-gray-600">{task.project_name}</span>
                                            </div>
                                        ) : (
                                            <span className="text-sm text-gray-400 italic">Personal Task</span>
                                        )}
                                    </td>
                                    <td>
                                        <span className={`priority-badge ${getPriorityClass(task.priority)}`}>
                                            {task.priority}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`status-badge ${getStatusClass(task.status)}`}>
                                            {task.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td>
                                        <div className={`flex items-center gap-2 text-sm ${overdue ? 'text-red-600 font-bold' : 'text-gray-600'}`}>
                                            <Clock size={16} className={overdue ? 'text-red-500' : 'text-gray-400'} />
                                            {formatDate(task.due_date)}
                                            {overdue && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full ml-1">Overdue</span>}
                                        </div>
                                    </td>
                                    <td className="text-right">
                                        <button
                                            className="text-gray-400 hover:text-blue-600"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onEditClick(task);
                                            }}
                                        >
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan="6" className="text-center py-12 text-gray-500">
                                No tasks found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default MemberTaskTable;
