import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../components/layout/Pagelayout';
import { ChevronLeft, Calendar, Clock, Plus, UserPlus, Edit } from 'lucide-react';
import '../../assets/styles/ProjectDetails.css';
// Components
import TaskItem from '../../components/project/TaskItem';
import TeamMembers from '../../components/project/TeamMembers';
import CreateTaskModal from '../../components/project/CreateTaskModal';
import AddMemberModal from '../../components/project/AddMemberModal';
import EditProjectModal from '../../components/project/EditProjectModal';
import EditTaskModal from '../../components/project/EditTaskModal';
import axios from 'axios';

const ProjectDetails = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();

    // Modal States
    const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
    const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
    const [isEditProjectOpen, setIsEditProjectOpen] = useState(false);
    const [isEditTaskOpen, setIsEditTaskOpen] = useState(false);

    // Data States
    const [project, setProject] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProject = useCallback(async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/projects/${projectId}`);
            if (!response.data) throw new Error('Failed to fetch project');
            console.log(response.data); // Debug
            setProject(response.data);
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [projectId]);

    const formatDueDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const handleTaskClick = (task) => {
        setSelectedTask(task);
        setIsEditTaskOpen(true);
    };

    useEffect(() => {
        if (projectId) fetchProject();
    }, [projectId, fetchProject]);

    if (loading) return <AdminLayout namepage="Project Detail"><div className="p-8">Loading...</div></AdminLayout>;
    if (error) return <AdminLayout namepage="Project Detail"><div className="p-8 text-red-500">Error: {error}</div></AdminLayout>;
    if (!project) return <AdminLayout namepage="Project Detail"><div className="p-8">Project not found</div></AdminLayout>;

    return (
        <AdminLayout namepage="Project Detail">
            <div className="project-details-container">
                {/* 1. Navigation Back */}
                <button
                    onClick={() => navigate(-1)}
                    className="back-btn"
                >
                    <ChevronLeft size={20} />
                    Back to Projects
                </button>

                {/* 2. Header Section */}
                <div className="header-section">
                    <div className="project-info">
                        <h1>{project.name}</h1>
                        <p className="project-desc">{project.description}</p>

                        <div className="meta-info">
                            <div className="meta-item">
                                <Calendar size={18} />
                                <span>Due: {formatDueDate(project.dueDate)}</span>
                            </div>
                            <div className="meta-item">
                                <Clock size={18} />
                                <span className="status-badge">
                                    {project.status}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="header-actions">
                        <button className="btn-secondary" onClick={() => setIsEditProjectOpen(true)}>
                            <Edit size={18} />
                            Edit Project
                        </button>
                        <button className="btn-primary">
                            Open Kanban Board
                        </button>
                    </div>
                </div>

                {/* 3. Grid Layout */}
                <div className="project-grid-layout">
                    {/* Left Column: Tasks */}
                    <div className="tasks-section">
                        <div className="section-header">
                            <h2 className="section-header-title">Project Tasks</h2>
                            <button
                                className="btn-sm-primary text-sm-btn"
                                onClick={() => setIsCreateTaskOpen(true)}
                            >
                                <Plus size={16} /> Create Task
                            </button>
                        </div>

                        <div className="task-list-container">
                            {project.tasks.length > 0 ? (
                                project.tasks.map((task) => (
                                    <TaskItem
                                        key={task.id}
                                        task={task}
                                        onClick={() => handleTaskClick(task)}
                                    />
                                ))
                            ) : (
                                <p style={{ padding: '1rem', color: '#6b7280' }}>No tasks found.</p>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Members */}
                    <div className="members-section">
                        <TeamMembers
                            members={project.members}
                            onManageClick={() => setIsAddMemberOpen(true)}
                        />
                    </div>
                </div>
                {/* --- Modals --- */}
                <CreateTaskModal
                    isOpen={isCreateTaskOpen}
                    onClose={() => setIsCreateTaskOpen(false)}
                    projectId={projectId}
                    members={project?.members}
                    onTaskCreated={fetchProject}
                />
                <AddMemberModal
                    isOpen={isAddMemberOpen}
                    onClose={() => setIsAddMemberOpen(false)}
                    projectId={projectId}
                    projectName={project.name}
                    currentMembers={project.members}
                    onMemberAdded={fetchProject}
                />

                <EditProjectModal
                    isOpen={isEditProjectOpen}
                    onClose={() => setIsEditProjectOpen(false)}
                    project={project}
                    onProjectUpdated={fetchProject}
                />

                <EditTaskModal
                    isOpen={isEditTaskOpen}
                    onClose={() => setIsEditTaskOpen(false)}
                    task={selectedTask}
                    members={project.members}
                    onTaskUpdated={fetchProject}
                />
            </div>
        </AdminLayout>
    );
};

export default ProjectDetails;