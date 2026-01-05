import { useState, useEffect } from 'react';
import axios from 'axios';
import PageLayout from "../../components/layout/Pagelayout";
import { useAuth } from "../../context/AuthContext";
import { API_URL } from '../../utils/api';
import { Search, Filter } from 'lucide-react';
import '../../assets/styles/MemberTask.css';
import EditTaskModal from '../../components/project/EditTaskModal';
import MemberTaskTable from '../../components/member/MemberTaskTable';

const MemberTask = () => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

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

    const handleEditClick = (task) => {
        const taskForModal = {
            ...task,
            id: task.task_id
        };
        setSelectedTask(taskForModal);
        setIsEditModalOpen(true);
    };

    const handleTaskUpdated = () => {
        // Refresh tasks
        const fetchTasks = async () => {
            if (!user?.user_id) return;
            try {
                const res = await axios.get(`${API_URL}/api/tasks/user/${user.user_id}`);
                setTasks(res.data || []);
            } catch (err) {
                console.error("Failed to fetch my tasks:", err);
            }
        };
        fetchTasks();
    };

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

                {/* Task Table Component */}
                <MemberTaskTable
                    tasks={filteredTasks}
                    loading={loading}
                    onEditClick={handleEditClick}
                />

            </div>

            {/* Edit Task Modal */}
            {selectedTask && (
                <EditTaskModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    task={selectedTask}
                    members={user ? [{ user_id: user.user_id, name: user.name }] : []}
                    onTaskUpdated={handleTaskUpdated}
                    lockAssignee={true}
                />
            )}
        </PageLayout>
    );
};

export default MemberTask;
