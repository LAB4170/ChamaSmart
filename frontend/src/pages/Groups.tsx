import React from "react";
import { api_getCurrentUser, api_getGroupsForUser } from "../lib/mockApi";

const Groups: React.FC = () => {
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

  if (loading) return <div className="loading">Loading...</div>;
  if (!user) return null;

  return (
    <div className="groups-page">
      <div className="page-header">
        <h1>My Groups</h1>
        <button className="btn primary">Create New Group</button>
      </div>

      <div className="group-grid">
        {groups.map((group) => (
          <div key={group.id} className="group-card">
            <h3>{group.name}</h3>
            <p>{group.members.length} members</p>
            <div className="group-card-actions">
              <a href={`#/groups/${group.id}`} className="btn small">
                View Details
              </a>
              {user.id === group.adminId && (
                <button className="btn small secondary">Manage</button>
              )}
            </div>
          </div>
        ))}
        {groups.length === 0 && (
          <div className="empty-state">
            <p>You haven't joined any groups yet.</p>
            <button className="btn primary">Create Your First Group</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Groups;
