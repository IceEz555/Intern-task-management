import { useEffect, useState } from "react";
import axios from 'axios';
import PageLayout from "../../components/layout/Pagelayout";
import { Users, Folder, CheckSquare, BarChart3, PieChart } from 'lucide-react';
import '../../assets/styles/AdminDashboard.css';

const AdminDashboard = () => {
    // State for data
    const [stats, setStats] = useState([]);
    const [userDist, setUserDist] = useState([]); // New state for chart
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:5000/api/admin/stats');
                const data = response.data;

                const realStats = [
                    {
                        title: "TOTAL USERS",
                        value: data.totalUsers,
                        icon: "Users",
                        bg: "bg-blue-50",
                        color: "text-blue-600"
                    },
                    {
                        title: "ACTIVE PROJECTS",
                        value: data.activeProjects,
                        icon: "Folder",
                        bg: "bg-purple-50",
                        color: "text-purple-600"
                    },
                    {
                        title: "TASKS COMPLETED",
                        value: data.completedTasks.toLocaleString(),
                        icon: "CheckSquare",
                        bg: "bg-green-50",
                        color: "text-green-600"
                    }
                ];
                setStats(realStats);
                setUserDist(data.userDistribution);
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
        <PageLayout namepage="Admin Dashboard">
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
                            {/* Dynamic Conic Gradient Donut Chart */}
                            <div
                                className="donut-chart"
                                style={{
                                    background: `conic-gradient(
                                            ${userDist.map((item, index) => {
                                        const total = userDist.reduce((acc, curr) => acc + curr.count, 0);
                                        const prevCount = userDist.slice(0, index).reduce((acc, curr) => acc + curr.count, 0);
                                        const startPct = (prevCount / total) * 100;
                                        const endPct = startPct + ((item.count / total) * 100);
                                        // Palette: Blue, Purple, Light Blue (matches image)
                                        const color = ['#3B82F6', '#A855F7', '#BFDBFE'][index % 3];
                                        return `${color} ${startPct}% ${endPct}%`;
                                    }).join(', ')}
                                        )`
                                }}
                            >
                                <div className="donut-hole"></div>
                                <div className="donut-center-text">
                                    <div className="donut-value">
                                        {userDist.reduce((acc, curr) => acc + curr.count, 0)}
                                    </div>
                                    <div className="donut-label">Users</div>
                                </div>
                            </div>

                            {/* Legend */}
                            <div className="chart-legend">
                                {userDist.map((item, index) => (
                                    <div key={index} className="legend-item">
                                        <div className={`legend-dot ${['bg-blue-500', 'bg-purple-500', 'bg-lightblue-custom'][index % 3]}`}></div>
                                        <div className="legend-text">{item.role} <span className="font-bold ml-2">{item.count}</span></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </PageLayout>
    );
};

export default AdminDashboard;
