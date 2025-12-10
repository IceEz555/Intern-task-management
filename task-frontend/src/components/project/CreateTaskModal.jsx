import { useState } from 'react';
import Modal from '../common/Modal';
import { X, Calendar, ClipboardList } from 'lucide-react';

const CreateTaskModal = ({ isOpen, onClose }) => {
    // Local state for form
    const [title, setTitle] = useState('');
    const [status, setStatus] = useState('To Do');
    const [description, setDescription] = useState('');
    const [assignee, setAssignee] = useState('');
    const [priority, setPriority] = useState('Low');
    const [dueDate, setDueDate] = useState('');

    if (!isOpen) return null;

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
                        className="text-2xl font-bold text-gray-900 placeholder-gray-300 border-none outline-none w-full mb-4 focus:ring-0 px-0"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

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
                            value={assignee}
                            onChange={(e) => setAssignee(e.target.value)}
                        >
                            <option value="">Unassigned</option>
                            <option value="Sarah PM">Sarah PM</option>
                            <option value="Mike Dev">Mike Dev</option>
                        </select>
                    </div>

                    {/* Priority */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Priority</label>
                        <select
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
                        <button className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-colors">
                            Add Task
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default CreateTaskModal;
