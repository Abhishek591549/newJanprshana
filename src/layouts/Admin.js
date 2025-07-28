import React, { useEffect, useState } from "react";
import { Switch, Redirect, useHistory, useLocation } from "react-router-dom";
import PrivateRoute from "views/auth/privateRoute.js";

import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import AdminSidebar from "components/Sidebar/AdminSidebar.js";
import HeaderStats from "components/Headers/HeaderStats.js";
import FooterAdmin from "components/Footers/FooterAdmin.js";

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
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        setIsAdmin(parsedUser?.is_superuser === true);
        setLoading(false);

        // Auto redirect on base /admin path
        if (location.pathname === "/admin") {
          history.replace(
            parsedUser?.is_superuser ? "/admin/admindashboard" : "/admin/dashboard"
          );
        }
      } catch (error) {
        console.error("Invalid user JSON");
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [history, location.pathname]);

  if (loading) return <div>Loading...</div>;

  return (
    <>
      {isAdmin ? <AdminSidebar /> : <Sidebar />}

      <div className="relative md:ml-64 bg-blueGray-100">
        <AdminNavbar />
        <HeaderStats />
        <div className="px-4 md:px-10 mx-auto w-full -m-24">
          <Switch>
            <PrivateRoute exact path="/admin/dashboard" component={Dashboard} />
            <PrivateRoute exact path="/admin/admindashboard" component={AdminDashboard} />
            <PrivateRoute exact path="/admin/maps" component={Maps} />
            <PrivateRoute exact path="/admin/settings" component={Settings} />
            <PrivateRoute exact path="/admin/complaints" component={Complaints} />
            <PrivateRoute exact path="/admin/mycomplaints" component={MyComplaints} />
            <PrivateRoute exact path="/admin/admincomplaints" component={AdminComplaintsDashboard} />
            <Redirect from="/admin" to="/admin/dashboard" />
          </Switch>
          <FooterAdmin />
        </div>
      </div>
    </>
  );
}
