import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import '../../assets/styles/Modal.css';
import axios from 'axios';

const AddMemberModal = ({ isOpen, onClose, projectId, projectName, currentMembers = [], onMemberAdded }) => {
    const [allUsers, setAllUsers] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchUsers();
            // Initialize selection based on current members
            const currentIds = currentMembers.map(m => m.user_id);
            setSelectedIds(currentIds);
        }
    }, [isOpen, currentMembers]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:5000/api/users');
            if (response.data) {
                setAllUsers(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch users:", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleUser = (userId) => {
        if (selectedIds.includes(userId)) {
            setSelectedIds(prev => prev.filter(id => id !== userId));
        } else {
            setSelectedIds(prev => [...prev, userId]);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        const originalIds = currentMembers.map(m => m.user_id);

        // Find users to Add (in selected but not in original)
        const toAdd = selectedIds.filter(id => !originalIds.includes(id));
        // Find users to Remove (in original but not in selected)
        const toRemove = originalIds.filter(id => !selectedIds.includes(id));
        try {
            // Execute all changes
            const addPromises = toAdd.map(async userId =>
                await axios.post(`http://localhost:5000/api/projects/${projectId}/members`, {
                    user_id: userId
                })
            );

            const removePromises = toRemove.map(async userId =>
                await axios.delete(`http://localhost:5000/api/projects/${projectId}/members/${userId}`)
            );

            await Promise.all([...addPromises, ...removePromises]);

            onMemberAdded(); // Refresh parent
            onClose();
        } catch (error) {
            console.error("Failed to update members:", error);
            alert("Failed to update team members");
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" style={{ zIndex: 9999 }}>
            <div className="modal-content">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Manage Team</h2>
                        {projectName && <p className="text-sm text-gray-500 mt-1">{projectName}</p>}
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>

                {/* Body: User List */}
                <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-2 mb-6">
                    {loading ? (
                        <p className="text-center text-gray-500 py-4">Loading users...</p>
                    ) : (
                        allUsers
                            .filter(user => user.role !== 'Admin')
                            .map((user) => {
                                const isSelected = selectedIds.includes(user.user_id);
                                return (
                                    <div
                                        key={user.user_id}
                                        onClick={() => toggleUser(user.user_id)}
                                        className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${isSelected
                                            ? 'bg-blue-50 border-blue-200'
                                            : 'bg-white border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${isSelected ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
                                                }`}>
                                                {user.avatar ? (
                                                    <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                                                ) : (
                                                    user.name ? user.name.charAt(0) : 'U'
                                                )}
                                            </div>
                                            <div>
                                                <h4 className={`font-semibold ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                                                    {user.name}
                                                </h4>
                                                <p className="text-xs text-gray-500">{user.role}</p>
                                            </div>
                                        </div>
                                        {isSelected && (
                                            <div className="text-blue-600">
                                                <Check size={20} />
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : `Save Team (${selectedIds.length})`}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddMemberModal;
