import { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import { Users, Folder, CheckSquare, BarChart3, PieChart } from 'lucide-react';

const AdminDashboard = () => {
    // State for data (Backend Ready)
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);

    // Simulate API Fetch
    useEffect(() => {
        // TODO: Replace with actual API call
        const fetchData = async () => {
            setLoading(true);
            try {
                // await api.get('/dashboard/stats');
                // Simulate network delay
                await new Promise(resolve => setTimeout(resolve, 1000));

                const mockStats = [
                    {
                        title: "TOTAL USERS",
                        value: "5",
                        icon: "Users", // Store icon name or handle component mapping
                        bg: "bg-blue-50",
                        color: "text-blue-600"
                    },
                    {
                        title: "ACTIVE PROJECTS",
                        value: "12",
                        icon: "Folder",
                        bg: "bg-purple-50",
                        color: "text-purple-600"
                    },
                    {
                        title: "TASKS COMPLETED",
                        value: "1,204",
                        icon: "CheckSquare",
                        bg: "bg-green-50",
                        color: "text-green-600"
                    }
                ];
                setStats(mockStats);
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Helper to render icon dynamically
    const renderIcon = (iconName, className) => {
        switch (iconName) {
            case 'Users': return <Users className={className} size={24} />;
            case 'Folder': return <Folder className={className} size={24} />;
            case 'CheckSquare': return <CheckSquare className={className} size={24} />;
            default: return null;
        }
    };

    return (
        <AdminLayout namepage="Admin Dashboard">
            <div className="space-y-6">
                {/* Header Section */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-500">System performance and usage overview.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {loading ? (
                        // Skeleton Loading State
                        [1, 2, 3].map((i) => (
                            <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm animate-pulse">
                                <div className="w-12 h-12 bg-gray-200 rounded-xl mb-4"></div>
                                <div className="h-3 w-24 bg-gray-200 rounded mb-2"></div>
                                <div className="h-8 w-16 bg-gray-200 rounded"></div>
                            </div>
                        ))
                    ) : (
                        stats.map((stat, index) => (
                            <div key={index} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center mb-4`}>
                                    {renderIcon(stat.icon, stat.color)}
                                </div>
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                                    {stat.title}
                                </h3>
                                <p className="text-3xl font-bold text-gray-900">
                                    {stat.value}
                                </p>
                            </div>
                        ))
                    )}
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Weekly Activity (Mock Chart) */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <BarChart3 className="text-gray-400" size={20} />
                                <h3 className="font-bold text-gray-900">Weekly Activity</h3>
                            </div>
                            <select className="text-sm border border-gray-200 rounded-lg px-2 py-1 text-gray-500 bg-gray-50 outline-none">
                                <option>This Week</option>
                                <option>Last Week</option>
                            </select>
                        </div>
                        <div className="h-64 flex items-end justify-between gap-2 px-4">
                            {/* Fake Bars */}
                            {[40, 70, 45, 90, 60, 80, 50].map((h, i) => (
                                <div key={i} className="w-full bg-blue-50 rounded-t-lg relative group">
                                    <div
                                        className="absolute bottom-0 left-0 w-full bg-blue-500 rounded-t-lg transition-all duration-500 group-hover:bg-blue-600"
                                        style={{ height: `${h}%` }}
                                    ></div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between mt-4 text-xs text-gray-400 font-medium">
                            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                        </div>
                    </div>

                    {/* User Distribution (Mock Chart) */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-2 mb-6">
                            <PieChart className="text-gray-400" size={20} />
                            <h3 className="font-bold text-gray-900">User Distribution</h3>
                        </div>
                        <div className="flex items-center justify-center h-64 relative">
                            {/* CSS Donut Chart */}
                            <div className="w-48 h-48 rounded-full border-[16px] border-blue-100 relative flex items-center justify-center">
                                <div className="absolute inset-0 rounded-full border-[16px] border-blue-500 border-t-transparent border-r-transparent rotate-45"></div>
                                <div className="absolute inset-0 rounded-full border-[16px] border-purple-500 border-b-transparent border-l-transparent border-t-transparent rotate-[200deg]"></div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-gray-900">5</div>
                                    <div className="text-xs text-gray-400 uppercase font-bold">Users</div>
                                </div>
                            </div>

                            {/* Legend */}
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 space-y-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                    <div className="text-sm text-gray-600">Admins <span className="font-bold ml-2">1</span></div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                                    <div className="text-sm text-gray-600">Managers <span className="font-bold ml-2">1</span></div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-blue-100"></div>
                                    <div className="text-sm text-gray-600">Members <span className="font-bold ml-2">3</span></div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
