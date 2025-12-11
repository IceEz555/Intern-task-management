import { UserPlus } from 'lucide-react';

const TeamMembers = ({ members, onManageClick }) => {
    return (
        <div className="members-box">
            <h2 className="members-header">Team Members</h2>
            <div className="members-list">
                {members.map((member, idx) => (
                    <div key={idx} className="member-card">
                        <div className="member-avatar-lg" style={{ overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#e0e7ff", color: "#4f46e5", fontWeight: "bold", fontSize: "14px" }}>
                            {member.avatar ? (
                                <img
                                    src={member.avatar}
                                    alt={member.name}
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                            ) : (
                                <span>
                                    {member.name ? member.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?'}
                                </span>
                            )}
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
