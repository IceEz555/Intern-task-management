import { useState, useEffect, useCallback } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import api from '../../utils/api';
import PageLayout from '../../components/layout/Pagelayout';
import SharedKanbanBoard from '../../components/kanban/SharedKanbanBoard';
import EditTaskModal from '../../components/project/EditTaskModal';
import CreateTaskModal from '../../components/project/CreateTaskModal';
import { useAuth } from '../../context/AuthContext';

const PersonalKanbanBoard = () => {
    const { user } = useAuth();

    // Data State
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

    // Fetch Data
    const fetchMyTasks = useCallback(async () => {
        if (!user?.user_id) return;
        try {
            const res = await api.get(`/api/tasks/user/${user.user_id}`);
            const tasksData = res.data || [];

            // Map task_id to id for dnd-kit
            const tasks = tasksData.map(task => ({
                ...task,
                id: task.task_id.toString() // Ensure string for dnd-kit
            }));

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

            setColumns(newColumns);
        } catch (err) {
            console.error("Failed to fetch my tasks:", err);
        }
    }, [user]);

    useEffect(() => {
        // eslint-disable-next-line
        fetchMyTasks();
    }, [fetchMyTasks]);

    // Helper: Find Container
    const findContainer = (id) => {
        if (id in columns) return id;
        return Object.keys(columns).find((key) =>
            columns[key].find((task) => task.id.toString() === id.toString())
        );
    };

    // --- Drag & Drop Logic (Duplicated from ProjectBoard) ---
    const handleDragOver = (event) => {
        const { active, over } = event;
        const overId = over?.id;
        if (!overId || active.id === overId) return;

        const activeContainer = findContainer(active.id);
        const overContainer = findContainer(overId);

        if (!activeContainer || !overContainer || activeContainer === overContainer) return;

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

        if (!activeContainer || !overContainer || activeContainer !== overContainer) return;

        const activeIndex = columns[activeContainer].findIndex((item) => item.id.toString() === active.id.toString());
        const overIndex = columns[overContainer].findIndex((item) => item.id.toString() === over.id.toString());

        if (activeIndex !== overIndex) {
            setColumns((prev) => ({
                ...prev,
                [activeContainer]: arrayMove(prev[activeContainer], activeIndex, overIndex),
            }));
        }

        // API Update
        try {
            const newStatus = activeContainer;
            await api.put(`/api/tasks/${active.id}`, {
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

    return (
        <PageLayout namepage="My Personal Board">
            <div className="flex flex-col h-full">
                <SharedKanbanBoard
                    title="My Personal Tasks"
                    columns={columns}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                    onTaskClick={handleTaskClick}
                    showAddButton={true}
                    onAddClick={() => setIsCreateTaskOpen(true)}
                />

                <CreateTaskModal
                    isOpen={isCreateTaskOpen}
                    onClose={() => setIsCreateTaskOpen(false)}
                    projectId={null} // Personal Task has no project
                    onTaskCreated={fetchMyTasks}
                    members={[{ user_id: user?.user_id, name: user?.name || user?.email }]}
                    defaultAssigneeId={user?.user_id}
                    lockAssignee={true}
                />

                <EditTaskModal
                    isOpen={isEditTaskOpen}
                    onClose={() => setIsEditTaskOpen(false)}
                    task={selectedTask}
                    onTaskUpdated={fetchMyTasks}
                    members={[{ user_id: user?.user_id, name: user?.name || user?.email }]}
                    lockAssignee={true}
                />
            </div>
        </PageLayout>
    );
};

export default PersonalKanbanBoard;
