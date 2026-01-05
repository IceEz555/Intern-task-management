import { AlertCircle, ChevronRight } from 'lucide-react';

const UrgentTaskItem = ({ task, formatDate, onClick }) => {
    return (
        <div
            className="urgent-task-item bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between hover:border-red-200 transition-colors cursor-pointer group"
            onClick={onClick}
        >
            <div className="flex items-center gap-4">
                <div className="icon-box w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-colors">
                    <AlertCircle size={20} />
                </div>
                <div className="task-info">
                    <h3 className="font-semibold text-gray-800 line-clamp-1">{task.title}</h3>
                    <p className="text-xs text-red-500 font-medium mt-0.5">Due: {formatDate(task.due_date)}</p>
                </div>
            </div>
            <ChevronRight size={20} className="text-gray-300 group-hover:text-gray-600" />
        </div>
    );
};

export default UrgentTaskItem;
