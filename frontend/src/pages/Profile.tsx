import React from "react";
import { api_getCurrentUser } from "../lib/mockApi";

const Profile: React.FC = () => {
  const [user, setUser] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const load = async () => {
      const currentUser = await api_getCurrentUser();
      if (!currentUser) {
        window.location.hash = "#/login";
        return;
      }
      setUser(currentUser);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;
  if (!user) return null;

  return (
    <div className="profile-page">
      <div className="page-header">
        <h1>My Profile</h1>
      </div>

      <div className="profile-content">
        <div className="profile-section">
          <h2>Personal Information</h2>
          <div className="profile-info">
            <div className="info-row">
              <label>Name</label>
              <div>{user.name}</div>
            </div>
            <div className="info-row">
              <label>Email</label>
              <div>{user.email}</div>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h2>Preferences</h2>
          <div className="profile-preferences">
            <div className="preference-row">
              <label>Email Notifications</label>
              <input type="checkbox" defaultChecked />
            </div>
            <div className="preference-row">
              <label>SMS Notifications</label>
              <input type="checkbox" />
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h2>Security</h2>
          <button className="btn">Change Password</button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
