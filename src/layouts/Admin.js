import React, { useEffect, useState } from "react";
import {
  Switch,
  Redirect,
  useHistory,
  useLocation,
} from "react-router-dom";

import PrivateRoute from "views/auth/privateRoute.js";
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import AdminSidebar from "components/Sidebar/AdminSidebar.js";
import HeaderStats from "components/Headers/HeaderStats.js";
import FooterAdmin from "components/Footers/FooterAdmin.js";

// Views
import Dashboard from "views/admin/Dashboard.js";
import AdminDashboard from "views/admin/adminDashboard.js";
import Maps from "views/admin/Maps.js";
import Settings from "views/admin/Settings.js";
import Complaints from "components/Cards/Complaints.js";
import MyComplaints from "components/Cards/myComplaints.js";
import AdminComplaintsDashboard from "components/Cards/admincomplaints.js";

export default function Admin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    const superUser = localStorage.getItem("is_superuser");

    // 'true' is stored as a string
    const isSuper = superUser === "true";
    setIsAdmin(isSuper);

    // Redirect only when coming to /admin directly
    if (location.pathname === "/admin") {
      history.replace(isSuper ? "/admin/admindashboard" : "/admin/dashboard");
    }

    setLoading(false);
  }, [history, location.pathname]);

  if (loading) return null; // Optional loading screen/spinner

  return (
    <>
      {/* Sidebar: switch between admin and normal */}
      {isAdmin ? <AdminSidebar /> : <Sidebar />}

      <div className="relative md:ml-64 bg-blueGray-100">
        <AdminNavbar />
        <HeaderStats />

        <div className="px-4 md:px-10 mx-auto w-full -m-24">
          <Switch>
            {/* Shared pages */}
            <PrivateRoute exact path="/admin/maps" component={Maps} />
            <PrivateRoute exact path="/admin/settings" component={Settings} />

            {/* Dashboard based on role */}
            <PrivateRoute
              exact
              path="/admin/dashboard"
              component={Dashboard}
            />
            <PrivateRoute
              exact
              path="/admin/admindashboard"
              component={AdminDashboard}
            />

            {/* Complaints pages */}
            <PrivateRoute
              exact
              path="/admin/complaints"
              component={Complaints}
            />
            <PrivateRoute
              exact
              path="/admin/mycomplaints"
              component={MyComplaints}
            />
            <PrivateRoute
              exact
              path="/admin/admincomplaints"
              component={AdminComplaintsDashboard}
            />

            {/* Fallback route */}
            <Redirect to={isAdmin ? "/admin/admindashboard" : "/admin/dashboard"} />
          </Switch>

          <FooterAdmin />
        </div>
      </div>
    </>
  );
}
