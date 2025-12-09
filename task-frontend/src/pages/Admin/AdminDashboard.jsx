import { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/Pagelayout";
import { Users, Folder, CheckSquare, BarChart3, PieChart } from 'lucide-react';
import '../../assets/styles/AdminDashboard.css';

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
            <div className="dashboard-container">
                {/* Header Section */}
                <div className="dashboard-header">
                    <h1>Admin Dashboard</h1>
                    <p>System performance and usage overview.</p>
                </div>

                {/* Stats Grid */}
                <div className="stats-grid">
                    {loading ? (
                        // Skeleton Loading State
                        [1, 2, 3].map((i) => (
                            <div key={i} className="skeleton-card">
                                <div className="skeleton-icon"></div>
                                <div className="skeleton-text"></div>
                                <div className="skeleton-value"></div>
                            </div>
                        ))
                    ) : (
                        stats.map((stat, index) => (
                            <div key={index} className="stat-card">
                                <div className={`stat-icon-wrapper ${stat.bg}`}>
                                    {renderIcon(stat.icon, stat.color)}
                                </div>
                                <h3 className="stat-title">
                                    {stat.title}
                                </h3>
                                <p className="stat-value">
                                    {stat.value}
                                </p>
                            </div>
                        ))
                    )}
                </div>

                {/* Charts Section */}
                <div className="charts-grid">

                    {/* Weekly Activity (Mock Chart) */}
                    <div className="chart-card">
                        <div className="chart-header">
                            <div className="chart-title-wrapper">
                                <BarChart3 className="text-gray-400" size={20} />
                                <h3 className="chart-title">Weekly Activity</h3>
                            </div>
                            <select className="chart-select">
                                <option>This Week</option>
                                <option>Last Week</option>
                            </select>
                        </div>
                        <div className="bar-chart-container">
                            {/* Fake Bars */}
                            {[40, 70, 45, 90, 60, 80, 50].map((h, i) => (
                                <div key={i} className="bar-wrapper">
                                    <div
                                        className="bar-fill"
                                        style={{ height: `${h}%` }}
                                    ></div>
                                </div>
                            ))}
                        </div>
                        <div className="chart-labels">
                            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                        </div>
                    </div>

                    {/* User Distribution (Mock Chart) */}
                    <div className="chart-card">
                        <div className="flex items-center gap-2 mb-6">
                            <PieChart className="text-gray-400" size={20} />
                            <h3 className="font-bold text-gray-900">User Distribution</h3>
                        </div>
                        <div className="pie-chart-container">
                            {/* CSS Donut Chart */}
                            <div className="donut-chart">
                                <div className="donut-segment-1"></div>
                                <div className="donut-segment-2"></div>
                                <div className="donut-center-text">
                                    <div className="donut-value">5</div>
                                    <div className="donut-label">Users</div>
                                </div>
                            </div>

                            {/* Legend */}
                            <div className="chart-legend">
                                <div className="legend-item">
                                    <div className="legend-dot bg-blue-500"></div>
                                    <div className="legend-text">Admins <span className="font-bold ml-2">1</span></div>
                                </div>
                                <div className="legend-item">
                                    <div className="legend-dot bg-purple-500"></div>
                                    <div className="legend-text">Managers <span className="font-bold ml-2">1</span></div>
                                </div>
                                <div className="legend-item">
                                    <div className="legend-dot bg-blue-100"></div>
                                    <div className="legend-text">Members <span className="font-bold ml-2">3</span></div>
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
