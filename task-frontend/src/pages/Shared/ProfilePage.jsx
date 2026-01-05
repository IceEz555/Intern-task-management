import React, { useState, useEffect } from 'react';
import PageLayout from '../../components/layout/Pagelayout';
import { useAuth } from '../../context/AuthContext';
import '../../assets/styles/ProfilePage.css';
import axios from 'axios';
import { API_URL } from '../../utils/api';
import { User, Mail, Briefcase, Building, Save, Shield } from 'lucide-react';

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
    const [message, setMessage] = useState(null); // For success/error toast

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        setIsSaving(true);
        setMessage(null);
        try {
            const response = await axios.put(`${API_URL}/api/users/profile`, {
                id: user.user_id || user.id, // Support different ID formats
                name: formData.fullName,
                department: formData.department
            });

            // Update local user context immediately
            updateUser(response.data);

            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (error) {
            console.error(error);
            setMessage({ type: 'error', text: 'Failed to save changes.' });
        } finally {
            setIsSaving(false);
            // Clear message after 3 seconds
            setTimeout(() => setMessage(null), 3000);
        }
    };

    return (
        <PageLayout namepage="My Profile">
            <div className="profile-container relative">

                {/* Toast Notification */}
                {message && (
                    <div className={`fixed top-20 right-6 px-4 py-3 rounded-lg shadow-lg text-sm font-medium animate-fade-in-down z-50 ${message.type === 'success' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'
                        }`}>
                        {message.text}
                    </div>
                )}

                {/* Left Column: Profile Card */}
                <div className="profile-card">
                    <div className="avatar-large">
                        {user?.name ?
                            (user.name.trim().split(' ').length >= 2
                                ? `${user.name.trim().split(' ')[0][0]}${user.name.trim().split(' ').slice(-1)[0][0]}`.toUpperCase()
                                : user.name.substring(0, 2).toUpperCase())
                            : 'U'}
                    </div>
                    <h2 className="profile-name">{user?.name || 'User'}</h2>
                    <span className="profile-role">{user?.role || 'Member'}</span>

                    <div className="profile-meta-list">
                        <div className="profile-meta-item">
                            <Mail size={18} className="meta-icon" />
                            <span className="meta-text truncate">{user?.email}</span>
                        </div>
                        <div className="profile-meta-item">
                            <Shield size={18} className="meta-icon" />
                            <span className="meta-text">{user?.role} Access</span>
                        </div>
                    </div>
                </div>

                {/* Right Column: Edit Form */}
                <div className="profile-form-card">
                    <div className="form-header">
                        <h3 className="form-title">Personal Information</h3>
                        <p className="form-subtitle">Update your personal details and department.</p>
                    </div>

                    <div className="profile-form-grid">
                        <div className="form-group">
                            <label htmlFor="fullName">Full Name</label>
                            <div className="relative">
                                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    className="form-input pl-10"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <div className="relative">
                                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="form-input pl-10"
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled
                                />
                            </div>
                            <p className="text-xs text-gray-400 mt-1">Email cannot be changed.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="form-group">
                                <label htmlFor="role">Role</label>
                                <div className="relative">
                                    <Briefcase size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        id="role"
                                        name="role"
                                        className="form-input pl-10"
                                        value={formData.role}
                                        onChange={handleChange}
                                        disabled
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="department">Department</label>
                                <div className="relative">
                                    <Building size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        id="department"
                                        name="department"
                                        className="form-input pl-10"
                                        value={formData.department}
                                        onChange={handleChange}
                                        placeholder="e.g. Engineering"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                onClick={handleSubmit}
                                className="submit-btn"
                                disabled={isSaving}
                            >
                                <Save size={20} />
                                {isSaving ? 'Saving Changes...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}