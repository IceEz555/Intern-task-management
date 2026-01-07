import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Modal from '../common/Modal';
import { Calendar, ClipboardList } from 'lucide-react';
import api from '../../utils/api';

const EditTaskModal = ({ isOpen, onClose, task, members = [], onTaskUpdated, lockAssignee = false }) => {
    // Local state for form
    const [title, setTitle] = useState('');
    const [status, setStatus] = useState('To Do');
    const [description, setDescription] = useState('');
    const [assigneeId, setAssigneeId] = useState('');
    const [priority, setPriority] = useState('Medium');
    const [dueDate, setDueDate] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

    // Populate form when task changes
    useEffect(() => {
        if (task) {
            setTitle(task.title || '');
            setStatus(task.status || 'To Do');
            setDescription(task.description || '');
            setAssigneeId(task.assignee_id || ''); // Assuming backend returns assignee_id
            setPriority(task.priority || 'Medium');

            // Format date to YYYY-MM-DD for input
            if (task.due_date) {
                const date = new Date(task.due_date);
                const formattedDate = date.toISOString().split('T')[0];
                setDueDate(formattedDate);
            } else {
                setDueDate('');
            }
        }
    }, [task]);

    if (!isOpen || !task) return null;

    const handleSubmit = async () => {
        // Validation
        const newErrors = {};
        if (!title.trim()) {
            newErrors.title = 'Task title is required';
        }
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        // Clear errors
        setErrors({});
        setIsSubmitting(true);

        try {
            const response = await api.put(`/api/tasks/${task.id}`, {
                task_id: task.id,
                title,
                description,
                status,
                priority,
                due_date: dueDate || null,
                assignee_id: assigneeId || null
            });
            if (response.status !== 200) throw new Error('Failed to update task');

            if (onTaskUpdated) onTaskUpdated(); // Refresh parent
            onClose();
        } catch (err) {
            console.error(err);
            const errMsg = err.response?.data?.error || err.response?.data?.message || 'Error updating task';
            toast.error(`Failed: ${errMsg}`);
        } finally {
            setIsSubmitting(false);
        }

    };

    const handleDelete = async () => {
        try {
            await api.delete(`/api/tasks/${task.id}`);
            if (onTaskUpdated) onTaskUpdated();
            setIsDeleteConfirmOpen(false); // Close confirm modal
            onClose(); // Close edit modal
        } catch (err) {
            console.error(err);
            const errMsg = err.response?.data?.error || err.response?.data?.message || 'Failed to delete task';
            toast.error(`Error: ${errMsg}`);
        }
    };

    // Custom Header
    const customHeader = (
        <div className="flex items-center gap-3 w-full">
            <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded font-mono">
                #{task.id}
            </span>
            <select
                className="bg-white border border-gray-300 text-gray-700 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block p-1"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
            >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="In Review">In Review</option>
                <option value="Done">Done</option>
            </select>
        </div>
    );

    return (
        <Modal open={isOpen} onClose={onClose} title={customHeader} size="md-plus">
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Left Column: Content */}
                <div className="flex-1">
                    {/* Title Input */}
                    <input
                        type="text"
                        placeholder="Task Title"
                        className={`text-2xl font-bold text-gray-900 placeholder-gray-300 border-none outline-none w-full mb-1 focus:ring-0 px-0 ${errors.title ? 'border-b-2 border-red-500' : ''}`}
                        value={title}
                        onChange={(e) => {
                            setTitle(e.target.value);
                            if (errors.title) setErrors(prev => ({ ...prev, title: '' }));
                        }}
                    />
                    {errors.title && <p className="text-red-500 text-sm mb-4">{errors.title}</p>}

                    {/* Description */}
                    <div className="mb-6">
                        <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase mb-2">
                            <ClipboardList size={14} /> Description
                        </label>
                        <textarea
                            placeholder="Add a more detailed description..."
                            className="w-full min-h-[150px] p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:border-blue-500 outline-none resize-none transition-colors"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                </div>

                {/* Right Column: Properties Sidebar */}
                <div className="w-full lg:w-72 space-y-6 lg:pl-6 lg:border-l border-gray-100">
                    {/* Assignee */}
                    {/* Assignee */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Assignee</label>
                        {lockAssignee && assigneeId ? (
                            <div className="w-full bg-gray-100 border border-gray-200 text-gray-700 text-sm rounded-lg p-2.5 font-medium flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs">
                                    {members.find(m => m.user_id === assigneeId)?.name?.charAt(0) || 'U'}
                                </div>
                                {members.find(m => m.user_id === assigneeId)?.name || 'Unknown User'}
                            </div>
                        ) : (
                            <select
                                className="w-full bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                                value={assigneeId}
                                onChange={(e) => setAssigneeId(e.target.value)}
                            >
                                <option value="">Unassigned</option>
                                {members.map(member => (
                                    <option key={member.user_id} value={member.user_id}>
                                        {member.name}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    {/* Priority */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Priority</label>
                        <select
                            required
                            className="w-full bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                        >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                    </div>

                    {/* Due Date */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Due Date</label>
                        <div className="relative">
                            <input
                                type="date"
                                className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                            />
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Calendar size={16} className="text-gray-500" />
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 border-t border-gray-100 mt-auto flex flex-col gap-2">
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className={`w-full text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-colors ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                        >
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </button>

                        <button
                            onClick={() => setIsDeleteConfirmOpen(true)}
                            type="button"
                            className="w-full text-red-600 hover:bg-red-50 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-colors border border-transparent hover:border-red-200"
                        >
                            Delete Task
                        </button>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <Modal
                open={isDeleteConfirmOpen}
                onClose={() => setIsDeleteConfirmOpen(false)}
                title={<span className="text-red-600 font-bold">Delete Task?</span>}
                size="sm"
                zIndex={1050}
            >
                <div className="p-2">
                    <p className="text-gray-600 mb-6">
                        Are you sure you want to delete this task? <br />
                        <span className="font-bold text-gray-800">"{task.title}"</span> <br />
                    </p>
                    <div className="flex justify-end gap-3 transition-all">
                        <button
                            onClick={() => setIsDeleteConfirmOpen(false)}
                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDelete}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium shadow-sm transition-colors"
                        >
                            Confirm Delete
                        </button>
                    </div>
                </div>
            </Modal>
        </Modal>
    );
};

export default EditTaskModal;
