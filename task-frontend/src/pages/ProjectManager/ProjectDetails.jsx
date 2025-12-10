import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/layout/Pagelayout';
import { ChevronLeft, Calendar, Clock, Plus, UserPlus } from 'lucide-react';
import '../../assets/styles/ProjectDetails.css';

const ProjectDetails = () => {
    // const { projectId } = useParams();
    const navigate = useNavigate();

    // Mock Data
    const project = {
        name: "Mobile App Q3 Update",
        description: "Implement dark mode and new navigation flow for iOS/Android to improve user experience and retention.",
        dueDate: "2025-01-15",
        status: "Planning",
        members: [
            { name: "Sarah PM", role: "Project Manager", avatar: "SP" },
            { name: "Mike Dev", role: "Team Member", avatar: "MD" }
        ],
        tasks: [
            { id: "T-103", title: "User Testing Session", date: "2024-12-25", assignee: "John Intern", status: "TO DO" },
            { id: "T-105", title: "Fix Navigation Bug", date: "2023-11-26", assignee: "John Intern", status: "TO DO" }
        ]
    };

    // Helper to get status class
    const getStatusClass = (status) => {
        const s = status.toLowerCase().replace(' ', '');
        return `task-status-badge ${s}`; // e.g., 'todo', 'inprogress'
    };

    // Helper to get status dot color
    const getStatusDotColor = (status) => {
        return status === 'TO DO' ? '#f87171' : '#34d399';
    };

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
                                <span>Due: {project.dueDate}</span>
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
                        <button className="btn-secondary">
                            <UserPlus size={18} />
                            Manage Team
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
                            <button className="btn-sm-primary text-sm-btn">
                                <Plus size={16} /> Create Task
                            </button>
                        </div>

                        <div className="task-list-container">
                            {project.tasks.length > 0 ? (
                                project.tasks.map((task) => (
                                    <div key={task.id} className="task-item">
                                        <div className="task-left">
                                            <div
                                                className="status-dot"
                                                style={{ backgroundColor: getStatusDotColor(task.status) }}
                                            ></div>
                                            <div>
                                                <h3 className="task-title">{task.title}</h3>
                                                <p className="task-meta">{task.id} • {task.date}</p>
                                            </div>
                                        </div>
                                        <div className="task-right">
                                            <div className="assignee-info">
                                                <div className="assignee-avatar">
                                                    {task.assignee.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <span className="assignee-name">{task.assignee}</span>
                                            </div>
                                            <span className={getStatusClass(task.status)}>
                                                {task.status}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p style={{ padding: '1rem', color: '#6b7280' }}>No tasks found.</p>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Members 
                         Moved "Team Members" header INSIDE to better align with card padding
                    */}
                    <div className="members-section">
                        <div className="members-box">
                            <h2 className="members-header">Team Members</h2>
                            <div className="members-list">
                                {project.members.map((member, idx) => (
                                    <div key={idx} className="member-card">
                                        <div className="member-avatar-lg">
                                            {member.avatar}
                                        </div>
                                        <div className="member-info">
                                            <h4>{member.name}</h4>
                                            <p>{member.role}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="btn-add-member">
                                <Plus size={16} /> Add Member
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </AdminLayout>
    );
};

export default ProjectDetails;