import PropTypes from 'prop-types';
import { Folder, CheckSquare } from 'lucide-react';

const ProjectCard = ({ project, onClick }) => {

    // Helper helpers
    const getStatusClass = (status) => {
        switch (status) {
            case 'In Progress': return 'status-badge in-progress';
            case 'Planning': return 'status-badge planning'; // Keep if used, or remove if not
            case 'On Hold': return 'status-badge on-hold';
            case 'Completed': return 'status-badge completed';
            default: return 'status-badge';
        }
    };

    return (
        <div
            className={`project-card ${project.isActive ? 'active' : ''}`}
            onClick={onClick}
        >
            <div className="card-header">
                <div className="folder-icon">
                    <Folder size={24} />
                </div>
                <span className={getStatusClass(project.status)}>
                    {project.status}
                </span>
            </div>

            <div className="mt-2">
                <h3 className="project-title">{project.name}</h3>
                <p className="project-desc">{project.description}</p>
            </div>

            <div className="progress-section">
                <div className="progress-label">
                    <span>Progress</span>
                    <span>{project.progress || 0}%</span>
                </div>
                <div className="progress-track">
                    <div
                        className="progress-fill"
                        style={{ width: `${project.progress || 0}%` }}
                    ></div>
                </div>
            </div>

            <div className="card-footer">
                <div className="member-stack">
                    {/* Mock Members Display logic - to be updated with real member data later */}
                    {(project.members || []).slice(0, 3).map((m, idx) => (
                        <div key={idx} className="member-avatar">
                            {/* Initials or generic 'U' */}
                            {m.name ? m.name[0] : 'U'}
                        </div>
                    ))}
                    {(project.members?.length > 3) && (
                        <div className="member-avatar">+{project.members.length - 3}</div>
                    )}
                </div>
                <div className="task-count">
                    <CheckSquare size={14} />
                    {project.task_count || 0} tasks
                </div>
            </div>
        </div>
    );
};

ProjectCard.propTypes = {
    project: PropTypes.shape({
        project_id: PropTypes.number,
        name: PropTypes.string,
        description: PropTypes.string,
        status: PropTypes.string,
        progress: PropTypes.number,
        task_count: PropTypes.number,
        members: PropTypes.array,
        isActive: PropTypes.bool
    }).isRequired,
    onClick: PropTypes.func
};

export default ProjectCard;
