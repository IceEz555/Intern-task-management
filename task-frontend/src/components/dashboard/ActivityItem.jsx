import { Clock } from 'lucide-react';

const ActivityItem = ({ task, getRelativeTime, showConnector }) => {
    return (
        <div className="activity-item flex gap-4 relative">
            {/* Connector Line */}
            {showConnector && (
                <div className="connector-line absolute left-[19px] top-8 bottom-[-24px] w-0.5 bg-gray-100"></div>
            )}

            <div className="icon-box w-10 h-10 rounded-full bg-blue-50 flex-shrink-0 flex items-center justify-center text-blue-600">
                <Clock size={20} />
            </div>
            <div className="activity-content">
                <p className="text-sm text-gray-600">
                    You worked on <span className="font-bold text-gray-900">{task.title}</span>
                </p>
                <span className="text-xs text-gray-400 mt-1 block">
                    {getRelativeTime(task.updated_at || task.created_at)}
                </span>
            </div>
        </div>
    );
};

export default ActivityItem;
