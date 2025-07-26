import React from "react";
import { Route, Redirect } from "react-router-dom";

const isAuthenticated = () => {
  return !!localStorage.getItem("access_token"); // Check token presence
};

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      isAuthenticated() ? (
        <Component {...props} />
      ) : (
        <Redirect to="/auth/login" /> // Redirect to login if not authenticated
      )
    }
  />
);

export default PrivateRoute;
