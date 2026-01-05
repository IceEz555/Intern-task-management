import React, { useState, useEffect } from 'react';
import PageLayout from '../../components/layout/Pagelayout';
import { useAuth } from '../../context/AuthContext';
import '../../assets/styles/ProfilePage.css';
import axios from 'axios';
import { API_URL } from '../../utils/api';

export default function ProfilePage() {
    const { user, updateUser } = useAuth();
    const [formData, setFormData] = useState({
        fullName: user?.name || '',
        email: user?.email || '',
        role: user?.role || '',
        department: user?.department || ''
    });

    useEffect(() => {
        if (user) {
            setFormData(prev => {
                const newName = user.name || '';
                const newEmail = user.email || '';
                const newRole = user.role || '';

                if (prev.fullName === newName && prev.email === newEmail && prev.role === newRole) {
                    return prev;
                }
                return {
                    ...prev,
                    fullName: newName,
                    email: newEmail,
                    role: newRole,
                    department: user.department || ''
                };
            });
        }
    }, [user]);

    const [isSaving, setIsSaving] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        setIsSaving(true);
        try {
            const response = await axios.put(`${API_URL}/api/users/profile`, {
                id: user.user_id || user.id, // Support different ID formats
                name: formData.fullName,
                department: formData.department
            });

            // Update local user context immediately
            updateUser(response.data);

            alert('Changes saved successfully!');
        } catch (error) {
            console.error(error);
            alert('Failed to save changes');
        } finally {
            setIsSaving(false);
        }
    };



    return (
        <PageLayout namepage="My Profile">
            <div className="profile-container">
                {/* Removed profile-header h1 as PageLayout/Topbar handles page title */}

                <div className="profile-card">
                    <div className="profile-info">
                        <div className="avatar">
                            {user?.name ?
                                (user.name.trim().split(' ').length >= 2
                                    ? `${user.name.trim().split(' ')[0][0]}${user.name.trim().split(' ').slice(-1)[0][0]}`.toUpperCase()
                                    : user.name.substring(0, 2).toUpperCase())
                                : 'U'}
                        </div>
                        <div className="user-details">
                            <h2>{user?.name || 'User'}</h2>
                            <p className="user-meta">{user?.role} • {user?.email}</p>
                        </div>
                    </div>
                </div>

                <div className="profile-form">
                    <div className="form-group">
                        <label htmlFor="fullName">Full Name</label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            disabled // Usually email is immutable
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="role">Role</label>
                        <input
                            type="text"
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            required
                            disabled // Role usually managed by admin
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="department">Department</label>
                        <input
                            type="text"
                            id="department"
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            placeholder="e.g. Frontend Developer"
                        />
                    </div>

                    <div className="form-actions">
                        <button
                            onClick={handleSubmit}
                            className="btn-primary"
                            disabled={isSaving}
                        >
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}