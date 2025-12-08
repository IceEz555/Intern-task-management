import { useState, useEffect } from 'react';
import AdminLayout from "../../components/layout/AdminLayout";
import { Search, Filter, Plus } from 'lucide-react';
import axios from 'axios';
import "../../assets/styles/UserManagement.css";

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const getRoleBadgeClass = (role) => {
        switch (role) {
            case 'Admin': return 'role-badge admin';
            case 'PM': return 'role-badge pm';
            default: return 'role-badge member';
        }
    };

    const getStatusClass = (status) => {
        return status === 'Active' ? 'status-dot active' : 'status-dot on-leave';
    };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/users');
                console.log(response.data);
                // Maps API data to UI data format (adding initials if missing)
                const formattedUsers = response.data.map(user => ({
                    ...user,
                    initials: user.name
                        ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
                        : '??'
                }));
                setUsers(formattedUsers);
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    return (
        <AdminLayout namepage="User Management">
            <div className="management-container">
                {/* Header */}
                <div className="user-management-header">
                    <h1>User Management</h1>
                    <button className="btn-create">
                        <Plus size={16} />
                        Create User
                    </button>
                </div>

                {/* Filters */}
                <div className="filter-section">
                    <div className="search-wrapper">
                        <Search size={20} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search by name, email or role..."
                            className="search-input"
                        />
                    </div>
                    <button className="btn-filter">
                        <Filter size={16} />
                        Filter
                    </button>
                </div>

                {/* User Table */}
                <div className="user-table-container">
                    {/* Table Header */}
                    <div className="table-header">
                        <div className="col-user">USER</div>
                        <div className="col-role">ROLE</div>
                        <div className="col-status">STATUS</div>
                        <div className="col-actions">ACTIONS</div>
                    </div>

                    {/* Table Body */}
                    <div className="user-list">
                        {loading ? (
                            <div className="loading">
                                <div className="loading-spinner"></div>
                                <p>Loading users...</p>
                            </div>
                        ) :
                            users.map(user => (
                                <div key={user.id} className="user-row">
                                    {/* User Info */}
                                    <div className="col-user user-info">
                                        <div className="avatar">{user.initials}</div>
                                        <div>
                                            <div className="user-name">{user.name}</div>
                                            <div className="user-email">{user.email}</div>
                                        </div>
                                    </div>

                                    {/* Role */}
                                    <div className="col-role">
                                        <span className={getRoleBadgeClass(user.role)}>
                                            {user.role}
                                        </span>
                                    </div>

                                    {/* Status */}
                                    <div className="col-status">
                                        <div className="status-wrapper">
                                            <span className={getStatusClass(user.status)}></span>
                                            {user.status}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="col-actions action-buttons">
                                        <button className="btn-action edit">Edit</button>
                                        <button className="btn-action delete">Delete</button>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default UserManagement;