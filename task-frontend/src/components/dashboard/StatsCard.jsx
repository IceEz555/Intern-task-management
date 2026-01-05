import { Activity } from 'lucide-react';
import '../../assets/styles/StatsCard.css';

const StatsCard = ({ title, count, icon: Icon, colorClass, subText, isActive = false }) => {
    // Determine if it should have the left-border pseudo-element
    const hasBorder = colorClass && (colorClass.includes('border') && !isActive);
    const borderClass = hasBorder ? 'with-border' : '';

    return (
        <div className={`stats-card ${colorClass} ${borderClass} ${isActive ? 'active-card' : ''}`}>
            {isActive && (
                <div className="card-bg-icon">
                    <Icon size={150} />
                </div>
            )}
            <div className="card-content relative z-10">
                <div className="card-header flex justify-between items-start mb-4">
                    <span className={`card-title ${isActive ? 'text-blue-100' : 'text-gray-500'}`}>
                        {title}
                    </span>
                    {!isActive && Icon && (
                        <div className={`icon-wrapper ${colorClass}-icon`}>
                            <Icon size={24} />
                        </div>
                    )}
                </div>

                <div className={`card-count text-5xl font-bold mb-2 ${isActive ? 'text-white' : 'text-gray-800'}`}>
                    {count}
                </div>

                {isActive ? (
                    <div className="active-badge inline-flex items-center px-2 py-1 bg-blue-500/50 rounded-lg text-xs font-medium">
                        <Activity size={12} className="mr-1" /> Active
                    </div>
                ) : (
                    <p className="card-subtext text-xs text-gray-400">{subText}</p>
                )}
            </div>
        </div>
    );
};

export default StatsCard;
