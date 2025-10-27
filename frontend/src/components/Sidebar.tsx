import React from "react";
import { api_getCurrentUser } from "../lib/mockApi";

const Sidebar: React.FC = () => {
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    api_getCurrentUser().then(setUser);
  }, []);

  if (!user) return null; // Don't show sidebar for logged out users

  return (
    <aside className="app-sidebar">
      <nav>
        <ul className="nav-list">
          <li>
            <a href="#/dashboard" className="nav-link">
              Dashboard
            </a>
          </li>
          <li>
            <a href="#/groups" className="nav-link">
              My Groups
            </a>
          </li>
          <li>
            <a href="#/profile" className="nav-link">
              Profile
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
