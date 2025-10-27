import React from "react";
import { api_getCurrentUser, api_logout } from "../lib/mockApi";

const Header: React.FC = () => {
  const [user, setUser] = React.useState<any | null>(null);

  React.useEffect(() => {
    api_getCurrentUser().then(setUser);
  }, []);

  const onLogout = async () => {
    await api_logout();
    window.location.hash = "#/login";
    window.location.reload();
  };

  return (
    <header className="app-header">
      <div className="brand">ChamaSmart</div>
      <div className="header-actions">
        {user ? (
          <>
            <span className="user">{user.name}</span>
            <button onClick={onLogout} className="btn small">
              Logout
            </button>
          </>
        ) : (
          <a href="#/login" className="btn small">
            Login
          </a>
        )}
      </div>
    </header>
  );
};

export default Header;
