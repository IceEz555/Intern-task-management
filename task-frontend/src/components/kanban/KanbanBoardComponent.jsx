import { useState, useEffect } from 'react';
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

import AdminLayout from '../../components/layout/Pagelayout';
import KanbanColumn from './KanbanColumn';
import KanbanCard from './KanbanCard';

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

    // Fetch Data
    // Fetch Data
    useEffect(() => {
        const fetchProjectData = async () => {
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
                    // Map status to column keys (normalize text if needed)
                    // Assuming backend status matches keys perfectly for now
                    if (newColumns[task.status]) {
                        newColumns[task.status].push(task);
                    } else {
                        // Default to 'To Do' if status not found
                        newColumns['To Do'].push(task);
                    }
                });

                setProject(res.data);
                setColumns(newColumns);
            } catch (err) {
                console.error("Failed to fetch project:", err);
            }
        };

        if (projectId) {
            fetchProjectData();
        }
    }, [projectId]);

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

        // TODO: Call API Update Status Here
        // const task = columns[overContainer].find(t => t.id === active.id);
        // await axios.put(...)
    };

    if (!project) return <div className="p-8">Loading...</div>;

    return (
        <AdminLayout namepage="Project Kanban-Board">
            <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex flex-col mb-6">
                    <button
                        onClick={() => navigate(`/ProjectDetails/${projectId}`)}
                        className="flex items-center text-gray-500 hover:text-gray-700 mb-2 w-fit text-sm"
                    >
                        <ChevronLeft size={16} className="mr-1" /> Back to Detail
                    </button>
                    <div className="flex justify-between items-end">
                        <h1 className="text-2xl font-bold text-gray-800">{project.name} Board</h1>
                        <div className="flex gap-2">
                            <button className="flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-600 bg-white hover:bg-gray-50">
                                <Filter size={16} className="mr-2" /> Filter
                            </button>
                            <button className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">
                                <Plus size={16} className="mr-2" /> Add Task
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
                                tasks={columns[status]}
                                title={status}
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
            </div>
        </AdminLayout>
    );
};

export default KanbanBoard;