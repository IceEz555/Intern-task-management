import { useState } from 'react';
import Modal from '../common/Modal';
import { Check } from 'lucide-react';

const AddMemberModal = ({ isOpen, onClose, currentMembers = [] }) => {
    // Mock user list - in real app, fetch from API
    const allUsers = [
        { id: 1, name: 'Admin User', role: 'Admin', avatar: 'AU' },
        { id: 2, name: 'Sarah PM', role: 'Project Manager', avatar: 'SP' },
        { id: 3, name: 'John Intern', role: 'Team Member', avatar: 'JI' },
        { id: 4, name: 'Emily Design', role: 'Team Member', avatar: 'ED' },
        { id: 5, name: 'Mike Dev', role: 'Team Member', avatar: 'MD' },
    ];

    // Initialize state with current members
    // For demo, we just track IDs
    const currentMemberIds = currentMembers.map(m => m.name); // Using name as ID for mock match
    const [selectedIds, setSelectedIds] = useState(
        allUsers.filter(u => currentMemberIds.includes(u.name)).map(u => u.id)
    );

    const toggleUser = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(uid => uid !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handleSave = () => {
        console.log("Saving members: ", selectedIds);
        onClose();
    };

    return (
        <Modal open={isOpen} onClose={onClose} title="Manage Team">
            <div className="py-2">
                <p className="text-sm text-gray-500 mb-4">Select members to add to this project</p>
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                    {allUsers.map((user) => {
                        const isSelected = selectedIds.includes(user.id);
                        return (
                            <div
                                key={user.id}
                                onClick={() => toggleUser(user.id)}
                                className={`flex items-center justify-between p-3 rounded-lg cursor-pointer border transition-all ${isSelected
                                    ? 'bg-blue-50 border-blue-200'
                                    : 'bg-white border-transparent hover:bg-gray-50'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${isSelected ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
                                        }`}>
                                        {user.avatar}
                                    </div>
                                    <div>
                                        <p className={`text-sm font-medium ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>{user.name}</p>
                                        <p className="text-xs text-gray-500">{user.role}</p>
                                    </div>
                                </div>
                                {isSelected && <Check size={18} className="text-blue-600" />}
                            </div>
                        );
                    })}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
                    >
                        Save Team ({selectedIds.length})
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default AddMemberModal;
