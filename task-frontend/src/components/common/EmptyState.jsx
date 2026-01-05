import { Layers } from 'lucide-react';

const EmptyState = ({
    title = "No items found",
    description = "It looks like there's nothing here yet.",
    icon = Layers,
    actionLabel,
    onAction
}) => {
    const Icon = icon;

    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-200 hover:bg-gray-50 transition-colors duration-300">
            <div className="bg-white p-4 rounded-full shadow-sm mb-4 ring-8 ring-gray-50">
                <Icon size={48} className="text-gray-400" strokeWidth={1.5} />
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-1">
                {title}
            </h3>

            <p className="text-gray-500 max-w-sm text-sm mb-6 leading-relaxed">
                {description}
            </p>

            {actionLabel && onAction && (
                <button
                    onClick={onAction}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow active:scale-95 transform duration-150"
                >
                    {actionLabel}
                </button>
            )}
        </div>
    );
};

export default EmptyState;
