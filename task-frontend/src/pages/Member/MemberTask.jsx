import { useState, useEffect } from 'react';
import axios from 'axios';
import PageLayout from "../../components/layout/Pagelayout";
import { useAuth } from "../../context/AuthContext";
import { API_URL } from '../../utils/api';
import { Search, Filter, Clock } from 'lucide-react';
import '../../assets/styles/MemberTask.css';

const MemberTask = () => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchTasks = async () => {
            if (!user?.user_id) return;
            try {
                const res = await axios.get(`${API_URL}/api/tasks/user/${user.user_id}`);
                setTasks(res.data || []);
            } catch (err) {
                console.error("Failed to fetch my tasks:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTasks();
    }, [user]);

    // Filtering Logic
    const filteredTasks = tasks.filter(task => {
        const matchesStatus = filter === 'All' || task.status === filter;
        const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (task.project_name && task.project_name.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesStatus && matchesSearch;
    });

    // Count for Tabs
    const counts = {
        All: tasks.length,
        'To Do': tasks.filter(t => t.status === 'To Do').length,
        'In Progress': tasks.filter(t => t.status === 'In Progress').length,
        'In Review': tasks.filter(t => t.status === 'In Review').length,
        'Done': tasks.filter(t => t.status === 'Done').length
    };

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

    return (
        <PageLayout namepage="My Tasks">
            <div className="space-y-6">
                {/* Header & Controls */}
                <div className="task-controls-wrapper">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">My Tasks</h1>
                        <p className="text-gray-500 mt-1">Manage your assigned work across all projects.</p>
                    </div>
                    <div className="flex gap-2">
                        <div className="search-input-wrapper">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search tasks..."
                                className="search-input"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button className="filter-btn-main">
                            <Filter size={20} />
                            Filter
                        </button>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="filter-tabs-container">
                    {['All', 'To Do', 'In Progress', 'In Review', 'Done'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setFilter(tab)}
                            className={`filter-tab ${filter === tab ? 'active' : 'inactive'}`}
                        >
                            {tab} <span className="ml-1 opacity-60 text-xs">{counts[tab]}</span>
                        </button>
                    ))}
                </div>

                {/* Task Table */}
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
                            ) : filteredTasks.length > 0 ? (
                                filteredTasks.map(task => (
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
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Clock size={16} className="text-gray-400" />
                                                {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No date'}
                                            </div>
                                        </td>
                                        <td className="text-right">
                                            <button className="text-gray-400 hover:text-blue-600">
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))
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
            </div>
        </PageLayout>
    );
};

export default MemberTask;
