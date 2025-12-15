import { useState, useEffect } from 'react';
import PageLayout from "../../components/layout/Pagelayout";
import { Search, Filter, Plus } from 'lucide-react';
import axios from 'axios';
import "../../assets/styles/UserManagement.css";
import Modal from '../../components/common/Modal';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- State for Modals ---
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // --- State for Search & Filter ---
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [isFilterVisible, setIsFilterVisible] = useState(false);

    const [currentUser, setCurrentUser] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', role: 'Member', status: 'Active', password: '', confirmPassword: '' });

    // --- Helper Functions ---
    const getRoleBadgeClass = (role) => {
        switch (role) {
            case 'Admin': return 'role-badge admin';
            case 'PM': return 'role-badge pm';
            case 'ProjectManager': return 'role-badge pm'; // Fallback
            default: return 'role-badge member';
        }
    };

    const getStatusClass = (status) => {
        return status === 'Active' ? 'status-dot active' : 'status-dot on-leave';
    };

    // --- Handlers ---
    const handleOpenCreate = () => {
        setFormData({ name: '', email: '', role: 'Member', status: 'Active', password: '', confirmPassword: '' });
        setIsCreateModalOpen(true);
    };

    const handleOpenEdit = (user) => {
        setCurrentUser(user);
        setFormData({ name: user.name, email: user.email, role: user.role, status: user.status, password: '', confirmPassword: '' });
        setIsEditModalOpen(true);
    };

    const handleOpenDelete = (user) => {
        setCurrentUser(user);
        setIsDeleteModalOpen(true);
    };

    const closeModals = () => {
        setIsCreateModalOpen(false);
        setIsEditModalOpen(false);
        setIsDeleteModalOpen(false);
        setCurrentUser(null);
    };

    // --- Submit Logic ---
    const handleSubmitCreate = async (e) => {
        e.preventDefault();

        // Password Validation
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
        if (!passwordRegex.test(formData.password)) {
            alert("Password must be at least 8 characters, including uppercase, lowercase, numbers, and special characters (!@#$%^&*).");
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            alert("Password and confirmation do not match.");
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/users', formData);

            // Optimistic Update
            const newUser = {
                ...response.data,
                initials: response.data.name
                    ? response.data.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
                    : '??'
            };

            setUsers(prev => [...prev, newUser]);
            closeModals();
            alert("User created successfully!");
        } catch (error) {
            console.error("Error creating user:", error);
            if (error.response && error.response.status === 409) {
                alert("Email already registered.");
            } else {
                alert("Failed to create user.");
            }
        }
    };

    const handleSubmitEdit = async (e) => {
        e.preventDefault();

        // Optional Password Update Validation
        if (formData.password && formData.password.trim() !== "") {
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
            if (!passwordRegex.test(formData.password)) {
                alert("New password must be at least 8 characters, including uppercase, lowercase, numbers, and special characters (!@#$%^&*).");
                return;
            }
        }

        try {
            const payload = {
                name: formData.name,
                email: formData.email,
                role: formData.role,
                status: formData.status,
                password: formData.password
            };

            const response = await axios.put(`http://localhost:5000/api/users/${currentUser.user_id}`, payload);

            const updatedUser = {
                ...response.data,
                initials: response.data.name
                    ? response.data.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
                    : '??'
            };

            setUsers(prev => prev.map(u => u.user_id === currentUser.user_id ? updatedUser : u));
            closeModals();
            alert("User updated successfully!");
        } catch (error) {
            console.error("Error updating user:", error);
            if (error.response && error.response.status === 409) {
                alert("Email already exists.");
            } else {
                alert("Failed to update user.");
            }
        }
    };

    const handleSubmitDelete = async () => {
        try {
            await axios.delete(`http://localhost:5000/api/users/${currentUser.user_id}`);
            setUsers(prev => prev.filter(u => u.user_id !== currentUser.user_id));
            closeModals();
            alert("User deleted successfully.");
        } catch (error) {
            console.error("Error deleting user:", error);
            alert("Failed to delete user.");
        }
    };

    // --- Filter Logic ---
    const filteredUsers = users.filter(user => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.role.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesRole = roleFilter === 'All' || user.role === roleFilter;
        const matchesStatus = statusFilter === 'All' || user.status === statusFilter;

        return matchesSearch && matchesRole && matchesStatus;
    });

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/users');
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
        <PageLayout namepage="User Management">
            <div className="management-container">
                {/* Header */}
                <div className="user-management-header">
                    <h1>User Management</h1>
                    <button className="btn-create" onClick={handleOpenCreate}>
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
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        className={`btn-filter ${isFilterVisible ? 'active' : ''}`}
                        onClick={() => setIsFilterVisible(!isFilterVisible)}
                        style={{ backgroundColor: isFilterVisible ? '#e0e7ff' : '', color: isFilterVisible ? '#4338ca' : '' }}
                    >
                        <Filter size={16} />
                        Filter
                    </button>
                </div>

                {/* Extended Filter Options (Toggleable) */}
                {isFilterVisible && (
                    <div className="filter-options" style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>Role</label>
                            <select
                                className="form-input"
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                style={{ width: '200px', backgroundColor: 'white' }}
                            >
                                <option value="All">All Roles</option>
                                <option value="Admin">Admin</option>
                                <option value="PM">Project Manager (PM)</option>
                                <option value="Member">Member</option>
                            </select>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>Status</label>
                            <select
                                className="form-input"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                style={{ width: '200px', backgroundColor: 'white' }}
                            >
                                <option value="All">All Status</option>
                                <option value="Active">Active</option>
                                <option value="OnLeave">On Leave</option>
                            </select>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'end' }}>
                            <button
                                onClick={() => { setRoleFilter('All'); setStatusFilter('All'); setSearchTerm(''); }}
                                style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', color: '#dc2626', fontWeight: 500 }}
                            >
                                Reset Filters
                            </button>
                        </div>
                    </div>
                )}

                {/* User Table */}
                <div className="user-table-container">
                    <div className="table-header">
                        <div className="col-user">USER</div>
                        <div className="col-role">ROLE</div>
                        <div className="col-status">STATUS</div>
                        <div className="col-actions">ACTIONS</div>
                    </div>

                    <div className="user-list">
                        {loading ? (
                            <div className="loading">
                                <div className="loading-spinner"></div>
                                <p>Loading users...</p>
                            </div>
                        ) : filteredUsers.length > 0 ? (
                            filteredUsers.map(user => (
                                <div key={user.user_id} className="user-row">
                                    <div className="col-user user-info">
                                        <div className="avatar">{user.initials}</div>
                                        <div>
                                            <div className="user-name">{user.name}</div>
                                            <div className="user-email">{user.email}</div>
                                        </div>
                                    </div>
                                    <div className="col-role">
                                        <span className={getRoleBadgeClass(user.role)}>
                                            {user.role}
                                        </span>
                                    </div>
                                    <div className="col-status">
                                        <div className="status-wrapper">
                                            <span className={getStatusClass(user.status)}></span>
                                            {user.status}
                                        </div>
                                    </div>
                                    <div className="col-actions action-buttons">
                                        <button className="btn-action edit" onClick={() => handleOpenEdit(user)}>Edit</button>
                                        <button className="btn-action delete" onClick={() => handleOpenDelete(user)}>Delete</button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-results" style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                                No users found matching your search.
                            </div>
                        )}
                    </div>
                </div>

                {/* --- Modals --- */}

                {/* Create Modal */}
                <Modal open={isCreateModalOpen} onClose={closeModals} title="Create New User">
                    <form onSubmit={handleSubmitCreate}>
                        <div className="form-group">
                            <label>Full Name</label>
                            <input type="text" className="form-input" required placeholder="e.g. John Doe" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Email Address</label>
                            <input type="email" className="form-input" required placeholder="email@company.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                        </div>
                        <div className="form-row">
                            <div className="form-group half-width">
                                <label>Role</label>
                                <select className="form-input" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
                                    <option value="Member">Team Member</option>
                                    <option value="PM">Project Manager</option>
                                    <option value="Admin">Admin</option>
                                </select>
                            </div>
                            <div className="form-group half-width">
                                <label>Status</label>
                                <select className="form-input" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                                    <option value="Active">Active</option>
                                    <option value="OnLeave">On Leave</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input type="password" className="form-input" required placeholder="Set initial password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                            <p className="helper-text">Must be 8+ chars, incl. uppercase, lowercase, number, special char.</p>
                        </div>
                        <div className="form-group">
                            <label>Confirm Password</label>
                            <input type="password" className="form-input" required placeholder="Confirm password" value={formData.confirmPassword || ''} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} />
                        </div>
                        <div className="modal-actions">
                            <button type="button" className="btn-cancel" onClick={closeModals}>Cancel</button>
                            <button type="submit" className="btn-confirm">Create User</button>
                        </div>
                    </form>
                </Modal>

                {/* Edit Modal */}
                <Modal open={isEditModalOpen} onClose={closeModals} title="Edit User">
                    <form onSubmit={handleSubmitEdit}>
                        <div className="form-group">
                            <label>Full Name</label>
                            <input type="text" className="form-input" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Email Address</label>
                            <input type="email" className="form-input" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                        </div>
                        <div className="form-row">
                            <div className="form-group half-width">
                                <label>Role</label>
                                <select className="form-input" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
                                    <option value="Member">Member</option>
                                    <option value="PM">Project Manager</option>
                                    <option value="Admin">Admin</option>
                                </select>
                            </div>
                            <div className="form-group half-width">
                                <label>Status</label>
                                <select className="form-input" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                                    <option value="Active">Active</option>
                                    <option value="OnLeave">On Leave</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Reset Password (Optional)</label>
                            <input type="password" className="form-input" placeholder="Leave blank to keep current" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                            <p className="helper-text">Enter new password only if you want to reset it.</p>
                        </div>
                        <div className="modal-actions">
                            <button type="button" className="btn-cancel" onClick={closeModals}>Cancel</button>
                            <button type="submit" className="btn-confirm">Save Changes</button>
                        </div>
                    </form>
                </Modal>

                {/* Delete Modal */}
                <Modal open={isDeleteModalOpen} onClose={closeModals} title="Delete User">
                    <div style={{ paddingBottom: '1.5rem' }}>
                        <p>Are you sure you want to delete <strong>{currentUser?.name}</strong>?</p>
                        <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                            This action cannot be undone.
                        </p>
                    </div>
                    <div className="modal-actions">
                        <button className="btn-cancel" onClick={closeModals}>Cancel</button>
                        <button className="btn-confirm delete" onClick={handleSubmitDelete}>Delete User</button>
                    </div>
                </Modal>

            </div>
        </PageLayout>
    );
};

export default UserManagement;