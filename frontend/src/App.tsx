import React from "react";
import "./App.css";
import "./index.css";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Groups from "./pages/Groups";
import GroupDetail from "./pages/GroupDetail";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

type Route = {
  path: string;
  component: React.FC;
};

const routes: Route[] = [
  { path: "/", component: Dashboard },
  { path: "/dashboard", component: Dashboard },
  { path: "/groups", component: Groups },
  { path: "/groups/:id", component: GroupDetail },
  { path: "/login", component: Login },
  { path: "/signup", component: Signup },
  { path: "/profile", component: Profile },
];

function matchRoute(hash: string): React.FC {
  const path = hash.replace(/^#/, "") || "/";
  // simple param handling for /groups/:id
  if (path.startsWith("/groups/") && path.split("/").length === 3)
    return GroupDetail;
  const route = routes.find((r) => r.path === path);
  return route ? route.component : NotFound;
}

function App() {
  const [hash, setHash] = React.useState(window.location.hash || "#/");

  React.useEffect(() => {
    const onHash = () => setHash(window.location.hash || "#/");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const Page = matchRoute(hash);

  return (
    <div className="app-root">
      <Header />
      <div className="app-body">
        <Sidebar />
        <main className="app-main">
          <Page />
        </main>
      </div>
    </div>
  );
}

export default App;
