import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { Urls } from "../constant/Urls";
import AuthContext from "../contexts/auth.context";

const ProtectedRoute = ({ children }) => {
  const { isLoggedInUser } = useContext(AuthContext);

  if (isLoggedInUser === false) {
    return <Navigate to={Urls.Login()} />;
  }
  
  return children;
};

export default ProtectedRoute;
