import { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import axios from 'axios';
import { API_URL } from '../../utils/api';
import { useNavigate } from 'react-router-dom';

const EditProjectModal = ({ isOpen, onClose, project, onProjectUpdated }) => {
    const [projectName, setProjectName] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [projectStatus, setProjectStatus] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const navigate = useNavigate();

    // Populate form when project changes
    useEffect(() => {
        if (project) {
            setProjectName(project.project_name || project.name || '');
            setProjectDescription(project.project_description || project.description || '');
            setProjectStatus(project.project_status || project.status || 'Active');
            setStartDate(project.start_date ? new Date(project.start_date).toISOString().split('T')[0] : '');
            setEndDate(project.end_date ? new Date(project.end_date).toISOString().split('T')[0] : '');
        }
    }, [project]);

    if (!isOpen || !project) return null;

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const response = await axios.put(`${API_URL}/api/projects/${project.project_id}`, {
                project_name: projectName,
                project_description: projectDescription,
                project_status: projectStatus,
                start_date: startDate,
                end_date: endDate
            });

            if (response.status === 200) {
                if (onProjectUpdated) onProjectUpdated();
                onClose();
            }
        } catch (err) {
            console.error(err);
            alert('Error updating project');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`${API_URL}/api/projects/${project.project_id}`);
            // Redirect to project list
            navigate('/project-management');
        } catch (err) {
            console.error(err);
            alert('Failed to delete project');
        }
    };

    return (
        <Modal open={isOpen} onClose={onClose} title="Edit Project Details" size="md">
            <div className="space-y-4">
                {/* Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                    <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
                        value={projectDescription}
                        onChange={(e) => setProjectDescription(e.target.value)}
                    />
                </div>

                {/* Status */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        value={projectStatus}
                        onChange={(e) => setProjectStatus(e.target.value)}
                    >
                        <option value="Active">Active</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Planning">Planning</option>
                        <option value="On Hold">On Hold</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>

                {/* Dates Row */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                        <input
                            type="date"
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                        <input
                            type="date"
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                </div>

                <div className="pt-4 flex flex-col gap-3 border-t border-gray-100 mt-4">
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
                        className="w-full text-red-600 hover:bg-red-50 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-colors border border-transparent hover:border-red-200"
                    >
                        Delete Project
                    </button>
                </div>
            </div>

            {/* Nested Delete Confirmation Modal */}
            <Modal
                open={isDeleteConfirmOpen}
                onClose={() => setIsDeleteConfirmOpen(false)}
                title={<span className="text-red-600 font-bold">Delete Project?</span>}
                size="sm"
                zIndex={1050}
            >
                <div className="p-2">
                    <div className="bg-red-50 border border-red-100 rounded-lg p-3 mb-4">
                        <p className="text-red-800 text-sm font-medium">
                            ⚠️ Warning: This action is permanent!
                        </p>
                    </div>
                    <p className="text-gray-600 mb-6 text-sm">
                        Are you sure you want to delete <span className="font-bold text-gray-800">"{project.project_name || project.name}"</span>?
                        <br /><br />
                        This will also delete:
                        <ul className="list-disc pl-5 mt-1 text-gray-500">
                            <li>All <b>Tasks</b> in this project</li>
                            <li>All <b>Member</b> associations</li>
                        </ul>
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

export default EditProjectModal;
