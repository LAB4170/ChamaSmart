import React from "react";
import {
  api_getCurrentUser,
  api_getGroupsForUser,
  api_createGroup,
} from "../lib/mockApi";

const Dashboard: React.FC = () => {
  const [user, setUser] = React.useState<any>(null);
  const [groups, setGroups] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const load = async () => {
      const currentUser = await api_getCurrentUser();
      if (!currentUser) {
        window.location.hash = "#/login";
        return;
      }
      setUser(currentUser);
      const userGroups = await api_getGroupsForUser(currentUser.id);
      setGroups(userGroups);
      setLoading(false);
    };
    load();
  }, []);

  const createNewGroup = async () => {
    if (!user) return;
    const name = prompt("Enter group name:");
    if (!name) return;
    const group = await api_createGroup(name, user.id);
    setGroups([...groups, group]);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!user) return null;

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1>Welcome, {user.name}!</h1>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-value">{groups.length}</div>
          <div className="stat-label">Active Groups</div>
        </div>
        {/* Add more stat cards here */}
      </div>

      <div className="dashboard-groups">
        <div className="section-header">
          <h2>My Groups</h2>
          <button onClick={createNewGroup} className="btn primary">
            Create Group
          </button>
        </div>

        <div className="group-grid">
          {groups.map((group) => (
            <div key={group.id} className="group-card">
              <h3>{group.name}</h3>
              <p>{group.members.length} members</p>
              <a href={`#/groups/${group.id}`} className="btn small">
                View Details
              </a>
            </div>
          ))}
          {groups.length === 0 && <p>You haven't joined any groups yet.</p>}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
