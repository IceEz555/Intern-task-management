import { useState, useEffect, useCallback } from 'react';
import PageLayout from "../../components/layout/Pagelayout";
import { useAuth } from "../../context/AuthContext";
import api from '../../utils/api';
import {
    CheckCircle2,
    Clock,
    AlertCircle,
    Activity,
    Briefcase
} from 'lucide-react';
import StatsCard from '../../components/dashboard/StatsCard';
import UrgentTaskItem from '../../components/dashboard/UrgentTaskItem';
import ActivityItem from '../../components/dashboard/ActivityItem';
import EditTaskModal from '../../components/project/EditTaskModal';
import '../../assets/styles/MemberDashboard.css';

const MemberDashboard = () => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        assigned: 0,
        inProgress: 0,
        completed: 0
    });
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    const fetchTasks = useCallback(async () => {
        if (!user?.user_id) return;
        try {
            const res = await api.get(`/api/tasks/user/${user.user_id}`);
            const data = res.data || [];
            setTasks(data);

            // Calculate Stats
            const assigned = data.filter(t => t.status !== 'Done').length;
            const inProgress = data.filter(t => t.status === 'In Progress').length;
            const completed = data.filter(t => t.status === 'Done').length;

            setStats({ assigned, inProgress, completed });
        } catch (err) {
            console.error("Failed to fetch dashboard data:", err);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const handleTaskClick = (task) => {
        const taskForModal = {
            ...task,
            id: task.task_id
        };
        setSelectedTask(taskForModal);
        setIsEditModalOpen(true);
    };

    // Derived Data
    const urgentTasks = tasks
        .filter(t => (t.priority === 'High' || t.priority === 'Medium') && t.status !== 'Done')
        .slice(0, 5);

    const recentActivity = [...tasks]
        .sort((a, b) => new Date(b.updated_at || b.created_at) - new Date(a.updated_at || a.created_at))
        .slice(0, 3);

    const formatDate = (dateString) => {
        if (!dateString) return 'No due date';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getRelativeTime = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

        if (diffInHours < 1) return 'Just now';
        if (diffInHours < 24) return `${diffInHours} hours ago`;
        return `${Math.floor(diffInHours / 24)} days ago`;
    };

    if (loading) {
        return (
            <PageLayout namepage="Member Dashboard">
                <div className="space-y-8">
                    {/* Header Skeleton */}
                    <div className="flex justify-between items-end">
                        <div className="space-y-2">
                            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                        <div className="h-10 w-40 bg-gray-200 rounded-full animate-pulse"></div>
                    </div>

                    {/* Stats Cards Skeleton */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="skeleton-card">
                                <div className="skeleton-icon"></div>
                                <div className="skeleton-text"></div>
                                <div className="skeleton-value"></div>
                            </div>
                        ))}
                    </div>

                    {/* Bottom Section Skeleton */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Urgent Tasks Skeleton */}
                        <div className="space-y-4">
                            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4"></div>
                            <div className="space-y-3">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="bg-white p-4 rounded-xl border border-gray-100 flex gap-4 animate-pulse">
                                        <div className="w-1 bg-gray-200 rounded-l-xl"></div>
                                        <div className="flex-1 space-y-2">
                                            <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                                            <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Activity Skeleton */}
                        <div className="space-y-4">
                            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4"></div>
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="flex gap-4 animate-pulse">
                                        <div className="w-2 h-2 rounded-full bg-gray-200 mt-2"></div>
                                        <div className="flex-1 space-y-2">
                                            <div className="h-4 w-full bg-gray-200 rounded"></div>
                                            <div className="h-3 w-24 bg-gray-200 rounded"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </PageLayout>
        );
    }

    return (
        <PageLayout namepage="Member Dashboard">
            <div className="space-y-8">
                {/* Header Section */}
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">My Dashboard</h1>
                        <p className="text-gray-500 mt-1">Overview of your work and performance.</p>
                    </div>
                    <div className="text-gray-500 font-medium bg-white px-4 py-2 rounded-full shadow-sm text-sm">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatsCard
                        title="Assigned Tasks"
                        count={stats.assigned}
                        icon={Briefcase}
                        colorClass="bg-blue-600"
                        isActive={true}
                    />
                    <StatsCard
                        title="In Progress"
                        count={stats.inProgress}
                        icon={Clock}
                        colorClass="bg-white yellow-border"
                        subText="Tasks currently being worked on"
                    />
                    <StatsCard
                        title="Completed"
                        count={stats.completed}
                        icon={CheckCircle2}
                        colorClass="bg-white green-border"
                        subText="Total tasks finished"
                    />
                </div>

                {/* Bottom Section: Two Columns */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Urgent Attention */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-bold text-gray-800 flex items-center">
                            <AlertCircle className="text-red-500 mr-2" size={20} />
                            Urgent Attention
                        </h2>

                        <div className="space-y-3">
                            {urgentTasks.length > 0 ? (
                                urgentTasks.map(task => (
                                    <UrgentTaskItem
                                        key={task.task_id}
                                        task={task}
                                        formatDate={formatDate}
                                        onClick={() => handleTaskClick(task)}
                                    />
                                ))
                            ) : (
                                <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                    <p className="text-gray-400 text-sm">No urgent tasks properly.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-bold text-gray-800 flex items-center">
                            <Activity className="text-blue-500 mr-2" size={20} />
                            Recent Activity
                        </h2>

                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <div className="space-y-6">
                                {recentActivity.length > 0 ? (
                                    recentActivity.map((task, idx) => (
                                        <ActivityItem
                                            key={task.task_id}
                                            task={task}
                                            getRelativeTime={getRelativeTime}
                                            showConnector={idx !== recentActivity.length - 1}
                                        />
                                    ))
                                ) : (
                                    <p className="text-center text-gray-400 text-sm">No recent activity.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Task Modal */}
            {selectedTask && (
                <EditTaskModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    task={selectedTask}
                    members={user ? [{ user_id: user.user_id, name: user.name }] : []}
                    onTaskUpdated={fetchTasks}
                    lockAssignee={true}
                />
            )}
        </PageLayout>
    );
}

export default MemberDashboard;