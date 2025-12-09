import PropTypes from 'prop-types';

const StatCard = ({ title, value, desc, icon, isPrimary = false }) => {
    return (
        <div className={`stat-card ${isPrimary ? 'primary' : ''}`}>
            <div>
                <div className="stat-title">{title}</div>
                <div className="stat-value">
                    {value}
                </div>
            </div>
            {desc && <div className="stat-desc">{desc}</div>}
            {icon && <div className="text-gray-400">{icon}</div>}
        </div>
    );
};

StatCard.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    desc: PropTypes.string,
    icon: PropTypes.node,
    isPrimary: PropTypes.bool
};

export default StatCard;
