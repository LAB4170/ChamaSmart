import React from "react";
import {
  api_getCurrentUser,
  api_getGroup,
  api_getUsersByIds,
  api_addContribution,
} from "../lib/mockApi";

const GroupDetail: React.FC = () => {
  const [user, setUser] = React.useState<any>(null);
  const [group, setGroup] = React.useState<any>(null);
  const [members, setMembers] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const load = async () => {
      const currentUser = await api_getCurrentUser();
      if (!currentUser) {
        window.location.hash = "#/login";
        return;
      }
      setUser(currentUser);

      // Get group ID from hash URL
      const groupId = window.location.hash.split("/").pop();
      if (!groupId) return;

      const groupData = await api_getGroup(groupId);
      if (!groupData) {
        window.location.hash = "#/dashboard";
        return;
      }
      setGroup(groupData);

      const memberData = await api_getUsersByIds(groupData.members);
      setMembers(memberData);
      setLoading(false);
    };
    load();
  }, []);

  const addContribution = async () => {
    if (!user || !group) return;
    const amount = parseFloat(prompt("Enter contribution amount:") || "0");
    if (!amount) return;
    await api_addContribution(group.id, user.id, amount);
    alert("Contribution added!");
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!group) return null;

  const isAdmin = user?.id === group.adminId;

  return (
    <div className="group-detail">
      <div className="page-header">
        <h1>{group.name}</h1>
        {isAdmin && <button className="btn primary">Manage Group</button>}
      </div>

      <div className="group-content">
        <div className="group-stats">
          <div className="stat-card">
            <div className="stat-value">{members.length}</div>
            <div className="stat-label">Members</div>
          </div>
          {/* Add more stats */}
        </div>

        <div className="group-section">
          <div className="section-header">
            <h2>Members</h2>
            {isAdmin && <button className="btn small">Invite Member</button>}
          </div>
          <div className="member-list">
            {members.map((member) => (
              <div key={member.id} className="member-card">
                <div>{member.name}</div>
                <div className="member-email">{member.email}</div>
                {member.id === group.adminId && (
                  <span className="badge">Admin</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="group-section">
          <div className="section-header">
            <h2>Contributions</h2>
            <button onClick={addContribution} className="btn small">
              Add Contribution
            </button>
          </div>
          {/* Add contribution list here */}
        </div>
      </div>
    </div>
  );
};

export default GroupDetail;
