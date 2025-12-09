import { useState, useEffect } from 'react';
import AdminLayout from "../../components/layout/AdminLayout";
import { Search, Filter, Plus } from 'lucide-react';
import axios from 'axios';
import "../../assets/styles/UserManagement.css";
import Modal from '../../components/common/Modal';


const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- State สำหรับ Modal และ Form ---
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [currentUser, setCurrentUser] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', role: 'Member', status: 'Active', password: '' });

    // --- Helper Functions ---
    const getRoleBadgeClass = (role) => {
        switch (role) {
            case 'Admin': return 'role-badge admin';
            case 'ProjectManager': return 'role-badge pm';
            default: return 'role-badge member';
        }
    };

    const getStatusClass = (status) => {
        return status === 'Active' ? 'status-dot active' : 'status-dot on-leave';
    };

    // --- Handlers (การทำงานของปุ่มต่างๆ) ---
    const handleOpenCreate = () => {
        setFormData({ name: '', email: '', role: 'Member', status: 'Active', password: '' });
        setIsCreateModalOpen(true);
    };

    const handleOpenEdit = (user) => {
        setCurrentUser(user);
        setFormData({ name: user.name, email: user.email, role: user.role, status: user.status, password: '' });
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

    // --- Submit Logic (จำลองการบันทึก) ---
    const handleSubmitCreate = async (e) => {
        e.preventDefault();
        console.log("Creating User:", formData);
        // TODO: call API to create user
        closeModals();
    };

    const handleSubmitEdit = async (e) => {
        e.preventDefault();
        console.log("Updating User:", currentUser.id, formData);
        // TODO: call API to update user
        closeModals();
    };

    const handleSubmitDelete = async () => {
        console.log("Deleting User:", currentUser.id);
        // TODO: call API to delete user
        closeModals();
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
        <>
            <AdminLayout namepage="User Management">
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
                                            <button className="btn-action edit" onClick={() => handleOpenEdit(user)}>Edit</button>
                                            <button className="btn-action delete" onClick={() => handleOpenDelete(user)}>Delete</button>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>

                    {/* --- Modals --- */}

                    {/* 1. Create User Modal */}
                    <Modal open={isCreateModalOpen} onClose={closeModals} title="Create New User">
                        <form onSubmit={handleSubmitCreate}>
                            {/* Avatar Placeholder */}
                            <div className="avatar-upload-container">
                                <div className="avatar-placeholder">
                                    <Plus size={24} className="plus-icon" />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Full Name</label>
                                <input
                                    type="text" className="form-input" required
                                    placeholder="e.g. John Doe"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Email Address</label>
                                <input
                                    type="email" className="form-input" required
                                    placeholder="email@company.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group half-width">
                                    <label>Role</label>
                                    <select
                                        className="form-input"
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    >
                                        <option value="Member">Team Member</option>
                                        <option value="ProjectManager">Project Manager</option>
                                        <option value="Admin">Admin</option>
                                    </select>
                                </div>
                                <div className="form-group half-width">
                                    <label>Status</label>
                                    <select
                                        className="form-input"
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    >
                                        <option value="Active">Active</option>
                                        <option value="OnLeave">On Leave</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Password</label>
                                <input
                                    type="password" className="form-input" required
                                    placeholder="Set initial password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                                <p className="helper-text">User will use this password to log in.</p>
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={closeModals}>Cancel</button>
                                <button type="submit" className="btn-confirm">Create User</button>
                            </div>
                        </form>
                    </Modal>

                    {/* 2. Edit User Modal */}
                    <Modal open={isEditModalOpen} onClose={closeModals} title="Edit User">
                        <form onSubmit={handleSubmitEdit}>
                            {/* Avatar Placeholder */}
                            <div className="avatar-upload-container">
                                <div className="avatar-placeholder">
                                    <Plus size={24} className="plus-icon" />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Full Name</label>
                                <input
                                    type="text" className="form-input" required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Email Address</label>
                                <input
                                    type="email" className="form-input" required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group half-width">
                                    <label>Role</label>
                                    <select
                                        className="form-input"
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    >
                                        <option value="Member">Member</option>
                                        <option value="ProjectManager">Project Manager</option>
                                        <option value="Admin">Admin</option>
                                    </select>
                                </div>
                                <div className="form-group half-width">
                                    <label>Status</label>
                                    <select
                                        className="form-input"
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    >
                                        <option value="Active">Active</option>
                                        <option value="OnLeave">On Leave</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Reset Password (Optional)</label>
                                <input
                                    type="password" className="form-input"
                                    placeholder="Leave blank to keep current"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                                <p className="helper-text">Enter a new value only if you want to reset the user's password.</p>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={closeModals}>Cancel</button>
                                <button type="submit" className="btn-confirm">Save Changes</button>
                            </div>
                        </form>
                    </Modal>

                    {/* 3. Delete Confirmation Modal */}
                    <Modal open={isDeleteModalOpen} onClose={closeModals} title="Delete User">
                        <div style={{ paddingBottom: '1.5rem' }}>
                            <p>Are you sure you want to delete <strong>{currentUser?.name}</strong>?</p>
                            <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                                This action cannot be undone. The user will be permanently removed from the system.
                            </p>
                        </div>
                        <div className="modal-actions">
                            <button className="btn-cancel" onClick={closeModals}>Cancel</button>
                            <button className="btn-confirm delete" onClick={handleSubmitDelete}>Delete User</button>
                        </div>
                    </Modal>
                </div>
            </AdminLayout>
        </>
    );
};

export default UserManagement;