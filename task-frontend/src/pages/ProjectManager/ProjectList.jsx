import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../../components/layout/Pagelayout';
import { Plus, CheckSquare, Clock } from 'lucide-react';
import StatCard from '../../components/dashboard/StatCard';
import ProjectCard from '../../components/dashboard/ProjectCard';
import '../../assets/styles/ProjectList.css';
import Modal from '../../components/common/Modal';

const ProjectList = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newProject, setNewProject] = useState({
        project_name: "",
        project_description: "",
        project_start_date: "",
        project_end_date: "",
        project_status: "",
    })

    // Handle Create Modal
    const createModal = () => {
        setNewProject({
            project_name: "",
            project_description: "",
            project_start_date: "",
            project_end_date: "",
            project_status: "",
        })
        setIsCreateModalOpen(true);
    }
    const closeModal = () => setIsCreateModalOpen(false);

    const handleSubmitCreate = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/projects', newProject);
            fetchProjects();
            closeModal();
        } catch (error) {
            console.error("Error creating project:", error);
        }
    };


    // Default stats state
    const [stats, setStats] = useState({
        totalActive: 0,
        activeGrowth: '+0 this month', // Mock data for now as we need historical data for this
        pendingTasks: 0,
        upcomingDeadlines: 0
    });

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/projects');
            const projectData = response.data;
            setProjects(projectData);

            // Calculate Stats
            const activeCount = projectData.filter(p => p.status !== 'Completed').length;
            const pendingTasksCount = projectData.reduce((acc, curr) => {
                // Assuming task_count is total, and done_task_count is done.
                // Pending = Total - Done. 
                // Note: API returns string for count, need to parse.
                const total = parseInt(curr.task_count) || 0;
                const done = parseInt(curr.done_task_count) || 0;
                return acc + (total - done);
            }, 0);

            // Mock upcoming deadlines logic (random or based on date if available)
            // Real logic needs filtering tasks by due_date
            const deadlineCount = projectData.filter(p => p.status === 'In Progress').length;

            setStats({
                totalActive: activeCount,
                activeGrowth: '', // Hardcoded for now
                pendingTasks: pendingTasksCount,
                upcomingDeadlines: deadlineCount
            });

        } catch (error) {
            console.error("Error fetching projects:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout namepage="Projects">
            <div className="project-list-container">
                {/* Header Section */}
                <div className="flex justify-between items-end mb-2">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
                        <p className="text-gray-500 mt-1">Manage ongoing sprints and development cycles</p>
                    </div>
                    <button className="create-btn" onClick={createModal} >
                        <Plus size={18} />
                        New Project
                    </button>
                </div>

                {/* Statistics Row - Using Components */}
                <div className="stats-row">
                    <StatCard
                        title="Total Active"
                        value={`${stats.totalActive} Projects`}
                        desc={stats.activeGrowth}
                        isPrimary={true}
                    />
                    <StatCard
                        title="Tasks Pending"
                        value={stats.pendingTasks}
                        icon={<CheckSquare size={24} color="#9ca3af" />}
                    />
                    <StatCard
                        title="Upcoming Deadlines"
                        value={stats.upcomingDeadlines}
                        icon={<Clock size={24} color="#9ca3af" />}
                    />
                </div>

                {/* Project Grid */}
                <div className="project-grid">
                    {loading ? (
                        <p className="text-gray-500">Loading projects...</p>
                    ) : (
                        <>
                            {projects.map(project => (
                                <ProjectCard
                                    key={project.project_id}
                                    project={project}
                                    onClick={() => console.log(`Clicked project ${project.project_id}`)}
                                />
                            ))}
                            {/* New Project Placeholder */}
                            <div className="new-project-card">
                                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                                    <Plus size={24} className="text-gray-400" />
                                </div>
                                <span className="font-medium text-gray-500">Create New Project</span>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <Modal open={isCreateModalOpen} onClose={closeModal} title="Create New Project">
                <form onSubmit={handleSubmitCreate}>
                    <div className="form-group">
                        <label>Project Name</label>
                        <input type="text" className="form-input" required placeholder="e.g. Website Redesign" value={newProject.name} onChange={(e) => setNewProject({ ...newProject, project_name: e.target.value })} />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <input type="text" className="form-input-description" required placeholder="Project Description and details"
                            value={newProject.description} onChange={(e) => setNewProject({ ...newProject, project_description: e.target.value })} />
                    </div>
                </form>
            </Modal>
        </AdminLayout>
    );
};

export default ProjectList;
