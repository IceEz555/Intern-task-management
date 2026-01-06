import PageLayout from "../../components/layout/Pagelayout";
import { Search, Filter, Plus } from 'lucide-react';
import "../../assets/styles/UserManagement.css";
import Modal from '../../components/common/Modal';
import { getRoleBadgeClass, getStatusClass } from "./UserManagement.logic"; 
import { useUserManagement } from './useUserManagement';

const UserManagement = () => {
    // เรียกใช้ Hook 
    const {
        // Data States
        users, loading, currentUser, formData, modals, filters,
        // Setters
        setFormData, setFilters,
        // Action Handlers
        openCreate, openEdit, openDelete, closeModal,
        // Submit Handlers
        handleSubmitCreate, handleSubmitEdit, handleSubmitDelete
    } = useUserManagement();

    return (
        <PageLayout namepage="User Management">
            <div className="management-container">
                {/* Header */}
                <div className="user-management-header">
                    <h1>User Management</h1>
                    <button className="btn-create" onClick={openCreate}>
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
                            value={filters.searchTerm} // ใช้ filters.searchTerm
                            onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                        />
                    </div>
                    <button
                        className={`btn-filter ${filters.isFilterVisible ? 'active' : ''}`} // ใช้ filters.isFilterVisible
                        onClick={() => setFilters({ ...filters, isFilterVisible: !filters.isFilterVisible })}
                        style={{ backgroundColor: filters.isFilterVisible ? '#e0e7ff' : '', color: filters.isFilterVisible ? '#4338ca' : '' }}
                    >
                        <Filter size={16} />
                        Filter
                    </button>
                </div>

                {/* Extended Filter Options (Toggleable) */}
                {filters.isFilterVisible && (
                    <div className="filter-options" style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>Role</label>
                            <select
                                className="form-input"
                                value={filters.roleFilter} // ใช้ filters.roleFilter
                                onChange={(e) => setFilters({ ...filters, roleFilter: e.target.value })}
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
                                value={filters.statusFilter} // ใช้ filters.statusFilter
                                onChange={(e) => setFilters({ ...filters, statusFilter: e.target.value })}
                                style={{ width: '200px', backgroundColor: 'white' }}
                            >
                                <option value="All">All Status</option>
                                <option value="Active">Active</option>
                                <option value="OnLeave">On Leave</option>
                            </select>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'end' }}>
                            <button
                                onClick={() => setFilters({ searchTerm: '', roleFilter: 'All', statusFilter: 'All', isFilterVisible: true })}
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
                        ) : users.length > 0 ? (
                            users.map(user => (
                                <div key={user.user_id} className="user-row">
                                    <div className="col-user user-info">
                                        <div className="avatar">{user.initials}</div>
                                        <div>
                                            <div className="user-name">{user.name}</div>
                                            <div className="user-email">{user.email}</div>
                                        </div>
                                    </div>
                                    <div className="col-role">
                                        {/* ใช้ Logic Function ที่ Import มา */}
                                        <span className={getRoleBadgeClass(user.role)}>
                                            {user.role}
                                        </span>
                                    </div>
                                    <div className="col-status">
                                        <div className="status-wrapper">
                                            {/* ใช้ Logic Function ที่ Import มา */}
                                            <span className={getStatusClass(user.status)}></span>
                                            {user.status}
                                        </div>
                                    </div>
                                    <div className="col-actions action-buttons">
                                        <button className="btn-action edit" onClick={() => openEdit(user)}>Edit</button>
                                        <button className="btn-action delete" onClick={() => openDelete(user)}>Delete</button>
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
                {/* ใช้ modals.xxxx ที่ destructure มา */}

                {/* Create Modal */}
                <Modal open={modals.isCreateModalOpen} onClose={closeModal} title="Create New User">
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
                            <button type="button" className="btn-cancel" onClick={closeModal}>Cancel</button>
                            <button type="submit" className="btn-confirm">Create User</button>
                        </div>
                    </form>
                </Modal>

                {/* Edit Modal */}
                <Modal open={modals.isEditModalOpen} onClose={closeModal} title="Edit User">
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
                            <button type="button" className="btn-cancel" onClick={closeModal}>Cancel</button>
                            <button type="submit" className="btn-confirm">Save Changes</button>
                        </div>
                    </form>
                </Modal>

                {/* Delete Modal */}
                <Modal open={modals.isDeleteModalOpen} onClose={closeModal} title="Delete User">
                    <div style={{ paddingBottom: '1.5rem' }}>
                        <p>Are you sure you want to delete <strong>{currentUser?.name}</strong>?</p>
                        <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                            This action cannot be undone.
                        </p>
                    </div>
                    <div className="modal-actions">
                        <button className="btn-cancel" onClick={closeModal}>Cancel</button>
                        <button className="btn-confirm delete" onClick={handleSubmitDelete}>Delete User</button>
                    </div>
                </Modal>

            </div>
        </PageLayout>
    );
};

export default UserManagement;