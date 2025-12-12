import { useState } from 'react';
import {
    DndContext,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Filter, Plus } from 'lucide-react';
import KanbanColumn from './KanbanColumn';
import KanbanCard from './KanbanCard';

/* 
  SharedKanbanBoard: 
  - รับผิดชอบแค่ "การแสดงผล" และ "Interaction" (ลากวาง, คลิก, กรอง)
  - ไม่ยิง API เอง (รับข้อมูลผ่าน Props)
*/
const SharedKanbanBoard = ({
    title,              // ชื่อบอร์ด
    columns,            // ข้อมูล
    onDragEnd,          // ฟังก์ชันเมื่อปล่อย (API Save)
    onDragOver,         // ฟังก์ชันเมื่อลากผ่าน (Visual Update)
    onTaskClick,        // ฟังก์ชันเมื่อคลิก
    onAddClick,         // ฟังก์ชันเมื่อกด Add
    showAddButton = true
}) => {
    // ... (State เดิม)
    const [filterPriority, setFilterPriority] = useState('All');
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const [activeId, setActiveId] = useState(null);

    // ... (Sensors & Helper เดิม)
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const getFilteredTasks = (tasks) => {
        if (filterPriority === 'All') return tasks;
        return tasks.filter(t => t.priority === filterPriority);
    };

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const findActiveTask = () => {
        if (!activeId) return null;
        return Object.values(columns).flat().find((t) => t.id === activeId);
    };

    return (
        <div className="flex flex-col h-full">
            {/* Header ... */}
            <div className="flex flex-col mb-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{title}</h1>

                    <div className="flex gap-3">
                        <div className="relative">
                            <button
                                onClick={() => setShowFilterMenu(!showFilterMenu)}
                                className="flex items-center px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
                            >
                                <Filter size={16} className="mr-2" />
                                {filterPriority === 'All' ? 'Filter' : filterPriority}
                            </button>
                            {showFilterMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200 h-fit">
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

                        {showAddButton && (
                            <button
                                onClick={onAddClick}
                                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm shadow-blue-200 transition-all hover:shadow-md"
                            >
                                <Plus size={18} className="mr-2" /> Add Task
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragOver={onDragOver}
                onDragEnd={(e) => {
                    setActiveId(null);
                    onDragEnd(e);
                }}
            >
                <div className="flex gap-6 h-full overflow-x-auto pb-4">
                    {Object.keys(columns).map((status) => (
                        <KanbanColumn
                            key={status}
                            id={status}
                            title={status}
                            tasks={getFilteredTasks(columns[status])} // ส่ง Tasks ที่กรองแล้ว
                            onTaskClick={onTaskClick}
                        />
                    ))}
                </div>

                {/* Drag Overlay */}
                <DragOverlay>
                    {activeId ? <KanbanCard id={activeId} task={findActiveTask()} /> : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
};

export default SharedKanbanBoard;
