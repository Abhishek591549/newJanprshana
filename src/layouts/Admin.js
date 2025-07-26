import React, { useEffect, useState } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import PrivateRoute from "views/auth/privateRoute.js";

// Components
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

export default function Admin() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        if (userData?.is_superuser) {
          setIsAdmin(true);
        }
      }
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
    }
  }, []);

  return (
    <>
      {/* Sidebar based on user type */}
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

            {/* Default redirect if no route matches */}
            <Redirect from="/admin" to="/admin/dashboard" />
          </Switch>
          <FooterAdmin />
        </div>
      </div>
    </>
  );
}