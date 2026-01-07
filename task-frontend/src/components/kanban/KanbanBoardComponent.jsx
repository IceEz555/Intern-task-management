import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { arrayMove } from '@dnd-kit/sortable';
import axios from 'axios';
import { API_URL } from '../../utils/api';
import { ChevronLeft } from 'lucide-react';
import EditTaskModal from '../project/EditTaskModal';
import AdminLayout from '../../components/layout/Pagelayout';
import CreateTaskModal from '../project/CreateTaskModal';
import SharedKanbanBoard from './SharedKanbanBoard';

const KanbanBoard = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();

    // Data State
    const [project, setProject] = useState(null);
    const [columns, setColumns] = useState({
        'To Do': [],
        'In Progress': [],
        'In Review': [],
        'Done': []
    });

    // Modal State
    const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
    const [isEditTaskOpen, setIsEditTaskOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    // Fetch Data Function
    const fetchProjectData = useCallback(async () => {
        try {
            const res = await axios.get(`${API_URL}/api/projects/${projectId}`);
            const tasks = res.data.tasks || [];

            // Group Tasks by Status
            const newColumns = {
                'To Do': [],
                'In Progress': [],
                'In Review': [],
                'Done': []
            };

            tasks.forEach(task => {
                if (newColumns[task.status]) {
                    newColumns[task.status].push(task);
                } else {
                    newColumns['To Do'].push(task);
                }
            });

            setProject(res.data);
            setColumns(newColumns);
        } catch (err) {
            console.error("Failed to fetch project:", err);
        }
    }, [projectId]);

    // Initial Fetch
    useEffect(() => {
        if (projectId) {
            // eslint-disable-next-line
            fetchProjectData();
        }
    }, [projectId, fetchProjectData]);

    // Helper: Find Container
    const findContainer = (id) => {
        if (id in columns) return id;
        return Object.keys(columns).find((key) =>
            columns[key].find((task) => task.id.toString() === id.toString())
        );
    };

    // --- Drag & Drop Logic (Passed to Shared Component) ---

    const handleDragOver = (event) => {
        const { active, over } = event;
        const overId = over?.id;

        if (!overId || active.id === overId) return;

        const activeContainer = findContainer(active.id);
        const overContainer = findContainer(overId);

        if (!activeContainer || !overContainer || activeContainer === overContainer) {
            return;
        }

        setColumns((prev) => {
            const activeItems = prev[activeContainer];
            const overItems = prev[overContainer];
            const activeIndex = activeItems.findIndex((item) => item.id.toString() === active.id.toString());
            const overIndex = overItems.findIndex((item) => item.id.toString() === overId.toString());

            let newIndex;
            if (overId in prev) {
                newIndex = overItems.length + 1;
            } else {
                const isBelowOverItem =
                    over &&
                    active.rect.current.translated &&
                    active.rect.current.translated.top > over.rect.top + over.rect.height;

                const modifier = isBelowOverItem ? 1 : 0;
                newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
            }

            return {
                ...prev,
                [activeContainer]: [
                    ...prev[activeContainer].filter((item) => item.id !== active.id)
                ],
                [overContainer]: [
                    ...prev[overContainer].slice(0, newIndex),
                    activeItems[activeIndex],
                    ...prev[overContainer].slice(newIndex, prev[overContainer].length)
                ]
            };
        });
    };

    const handleDragEnd = async (event) => {
        const { active, over } = event;
        const activeContainer = findContainer(active.id);
        const overContainer = findContainer(over.id);

        if (!activeContainer || !overContainer || activeContainer !== overContainer) {
            return;
        }

        const activeIndex = columns[activeContainer].findIndex((item) => item.id.toString() === active.id.toString());
        const overIndex = columns[overContainer].findIndex((item) => item.id.toString() === over.id.toString());

        if (activeIndex !== overIndex) {
            setColumns((prev) => ({
                ...prev,
                [activeContainer]: arrayMove(prev[activeContainer], activeIndex, overIndex),
            }));
        }

        // Call API Update Status
        try {
            const newStatus = activeContainer;
            await axios.put(`${API_URL}/api/tasks/${active.id}`, {
                task_id: active.id,
                status: newStatus
            });

        } catch (error) {
            console.error("Failed to update task status:", error);
        }
    };

    const handleTaskClick = (task) => {
        setSelectedTask(task);
        setIsEditTaskOpen(true);
    };

    if (!project) return <div className="p-8">Loading...</div>;

    return (
        <AdminLayout namepage="Project Kanban-Board">
            <div className="flex flex-col h-full">
                {/* Back Button */}
                <div className="flex flex-col mb-2">
                    <button
                        onClick={() => navigate(`/ProjectDetails/${projectId}`)}
                        className="flex items-center text-gray-500 hover:text-gray-900 mb-4 w-fit group transition-colors"
                    >
                        <ChevronLeft size={20} className="mr-1 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Back to Detail</span>
                    </button>
                </div>

                {/* Shared Kanban Board */}
                <SharedKanbanBoard
                    title={`${project.name} Board`}
                    columns={columns}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                    onTaskClick={handleTaskClick}
                    onAddClick={() => setIsCreateTaskOpen(true)}
                    showAddButton={true}
                />

                {/* Modals */}
                <CreateTaskModal
                    isOpen={isCreateTaskOpen}
                    onClose={() => setIsCreateTaskOpen(false)}
                    projectId={projectId}
                    onTaskCreated={fetchProjectData}
                    members={project.members || []}
                />

                <EditTaskModal
                    isOpen={isEditTaskOpen}
                    onClose={() => setIsEditTaskOpen(false)}
                    task={selectedTask}
                    projectId={projectId}
                    onTaskUpdated={fetchProjectData}
                    members={project.members || []}
                />
            </div>
        </AdminLayout>
    );
};

export default KanbanBoard;