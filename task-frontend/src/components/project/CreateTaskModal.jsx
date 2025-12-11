import { useState } from 'react';
import Modal from '../common/Modal';
import { X, Calendar, ClipboardList } from 'lucide-react';
import axios from 'axios';

const CreateTaskModal = ({ isOpen, onClose, projectId, members = [], onTaskCreated }) => {
    // Local state for form
    const [title, setTitle] = useState('');
    const [status, setStatus] = useState('To Do');
    const [description, setDescription] = useState('');
    const [assigneeId, setAssigneeId] = useState('');
    const [priority, setPriority] = useState('Medium');
    const [dueDate, setDueDate] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    if (!isOpen) return null;

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

        // Clear errors if valid
        setErrors({});

        setIsSubmitting(true);
        try {
            const response = await axios.post('http://localhost:5000/api/tasks', {
                title,
                description,
                status,
                priority,
                due_date: dueDate || null,
                project_id: projectId,
                assignee_id: assigneeId || null
            });

            if (response.status !== 200 && response.status !== 201) throw new Error('Failed to create task');

            if (onTaskCreated) onTaskCreated(); // Refresh parent

            // Reset form
            setTitle('');
            setDescription('');
            setAssigneeId('');
            onClose();
        } catch (err) {
            console.error(err);
            alert('Error creating task');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Custom Header to match the design (Status dropdown on left)
    const customHeader = (
        <div className="flex items-center gap-3 w-full">
            <span className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded">T-NEW</span>
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
        <Modal open={isOpen} onClose={onClose} title={customHeader} size="md-plus" >
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
                            // Clear error when user types
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

                    {/* Attachments & Comments Placeholders */}
                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg text-blue-600 text-sm mb-4">
                        💡 File attachments and comments are currently under development.
                    </div>
                </div>

                {/* Right Column: Properties Sidebar */}
                <div className="w-full lg:w-72 space-y-6 lg:pl-6 lg:border-l border-gray-100">
                    {/* Assignee */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Assignee</label>
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

                    {/* Create Button (Inside Sidebar or Bottom) */}
                    <div className="pt-4 border-t border-gray-100 mt-auto">
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className={`w-full text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-colors ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                        >
                            {isSubmitting ? 'Creating...' : 'Add Task'}
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default CreateTaskModal;
