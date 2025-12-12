import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    DndContext,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import axios from 'axios';
import { ChevronLeft, Filter, Plus } from 'lucide-react';
import EditTaskModal from '../project/EditTaskModal';
import AdminLayout from '../../components/layout/Pagelayout';
import KanbanColumn from './KanbanColumn';
import KanbanCard from './KanbanCard';
import CreateTaskModal from '../project/CreateTaskModal';

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
    const [activeId, setActiveId] = useState(null); // ตัวที่กำลังถูกลาก
    const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false); // Modal State
    const [isEditTaskOpen, setIsEditTaskOpen] = useState(false); // Modal State
    const [selectedTask, setSelectedTask] = useState(null); // Task State
    const [filterPriority, setFilterPriority] = useState('All');
    const [showFilterMenu, setShowFilterMenu] = useState(false);

    // Fetch Data Function
    const fetchProjectData = useCallback(async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/projects/${projectId}`);
            const tasks = res.data.tasks || [];

            // Group Tasks by Status
            const newColumns = {
                'To Do': [],
                'In Progress': [],
                'In Review': [],
                'Done': []
            };

            tasks.forEach(task => {
                // Map status to column keys
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

    // Sensors
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5, // ต้องลาก 5px ก่อนถึงจะเริ่มนับ (กันลั่นเวลาคลิก)
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Finding Column Container
    const findContainer = (id) => {
        if (id in columns) return id;
        return Object.keys(columns).find((key) =>
            columns[key].find((task) => task.id.toString() === id.toString())
        );
    };

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const handleDragOver = (event) => {
        const { active, over } = event;
        const overId = over?.id;

        if (!overId || active.id === overId) return;

        const activeContainer = findContainer(active.id);
        const overContainer = findContainer(overId);

        if (!activeContainer || !overContainer || activeContainer === overContainer) {
            return;
        }

        // Logic ย้ายข้ามคอลัมน์ (ระหว่างลาก)
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

    const handleTaskClick = (task) => {
        setSelectedTask(task);
        setIsEditTaskOpen(true);
    };

    const getFilteredTasks = (tasks) => {
        if (filterPriority === 'All') return tasks;
        return tasks.filter(t => t.priority === filterPriority);
    };

    const handleDragEnd = async (event) => {
        const { active, over } = event;
        const activeContainer = findContainer(active.id);
        const overContainer = findContainer(over.id);

        if (!activeContainer || !overContainer || activeContainer !== overContainer) {
            setActiveId(null);
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
        setActiveId(null);
        // Call API Update Status
        try {
            const newStatus = activeContainer; // The container key is the status ('To Do', 'Done', etc.)
            await axios.put(`http://localhost:5000/api/tasks/${active.id}`, {
                task_id: active.id,
                status: newStatus
            });
            console.log(`Task ${active.id} status updated to ${newStatus}`);
        } catch (error) {
            console.error("Failed to update task status:", error);
            // Optional: Revert state if failed (would require more complex logic, skipping for now as per "Step 1" simplicity)
        }
    };

    if (!project) return <div className="p-8">Loading...</div>;

    return (
        <AdminLayout namepage="Project Kanban-Board">
            <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex flex-col mb-6">
                    <button
                        onClick={() => navigate(`/ProjectDetails/${projectId}`)}
                        className="flex items-center text-gray-500 hover:text-gray-900 mb-4 w-fit group transition-colors"
                    >
                        <ChevronLeft size={20} className="mr-1 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Back to Detail</span>
                    </button>

                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{project.name} Board</h1>

                        <div className="flex gap-3">

                            {/* Filter Button Container */}
                            <div className="relative">
                                <button className="flex items-center px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 
                                bg-white hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
                                    onClick={() => setShowFilterMenu(!showFilterMenu)}>
                                    <Filter size={16} className="mr-2" />
                                    {filterPriority === 'All' ? 'Filter' : filterPriority}
                                </button>

                                {/* Dropdown Menu */}
                                {showFilterMenu && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                                        {['All', 'High', 'Medium', 'Low'].map((p) => (
                                            <button
                                                key={p}
                                                onClick={() => {
                                                    setFilterPriority(p);
                                                    setShowFilterMenu(false);
                                                }}
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                            >
                                                {p}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={() => setIsCreateTaskOpen(true)}
                                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm shadow-blue-200 transition-all hover:shadow-md">
                                <Plus size={18} className="mr-2" /> Add Task
                            </button>
                        </div>
                    </div>
                </div>

                {/* Board */}
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCorners}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                >
                    <div className="flex gap-6 h-full overflow-x-auto pb-4">
                        {Object.keys(columns).map((status) => (
                            <KanbanColumn
                                key={status}
                                id={status}
                                tasks={getFilteredTasks(columns[status])}
                                title={status}
                                onTaskClick={handleTaskClick}
                            />
                        ))}
                    </div>

                    {/* Drag Overlay (สิ่งที่โชว์ตอนลาก) */}
                    <DragOverlay>
                        {activeId ? (
                            <KanbanCard
                                id={activeId}
                                task={
                                    Object.values(columns)
                                        .flat()
                                        .find((item) => item.id === activeId)
                                }
                            />
                        ) : null}
                    </DragOverlay>
                </DndContext>

                {/* Create Task Modal */}
                <CreateTaskModal
                    isOpen={isCreateTaskOpen}
                    onClose={() => setIsCreateTaskOpen(false)}
                    projectId={projectId}
                    onTaskCreated={fetchProjectData}
                    members={project.members || []}
                />

                {/* Edit Task Modal */}
                <EditTaskModal
                    isOpen={isEditTaskOpen}
                    onClose={() => setIsEditTaskOpen(false)}
                    task={selectedTask}
                    projectId={projectId}
                    onTaskUpdated={fetchProjectData}
                />
                {/* Dropdown Menu */}

            </div>
        </AdminLayout>
    );
};

export default KanbanBoard;