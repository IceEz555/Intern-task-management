import { UserPlus } from 'lucide-react';

const TeamMembers = ({ members, onManageClick }) => {
    return (
        <div className="members-box">
            <h2 className="members-header">Team Members</h2>
            <div className="members-list">
                {members.map((member, idx) => (
                    <div key={idx} className="member-card">
                        <div className="member-avatar-lg">
                            {member.avatar}
                        </div>
                        <div className="member-info">
                            <h4>{member.name}</h4>
                            <p>{member.role}</p>
                        </div>
                    </div>
                ))}
            </div>
            <button className="btn-add-member" onClick={onManageClick}>
                <UserPlus size={16} /> Manage Team
            </button>
        </div>
    );
};

export default TeamMembers;
