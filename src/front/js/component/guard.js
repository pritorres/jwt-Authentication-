import React from "react";
import { Redirect, Route } from "react-router-dom";
import { useCallback } from "react/cjs/react.development";

export const GuardRoute = ({
  component: C,
  isLoggedIn,
  loadingAuth,
  componentProps = {},
  ...routeProps
}) => {
  console.log("store.isLoggedIn", isLoggedIn);

  const handleRender = useCallback(
    (props) => {
      console.log("loadingAuth", loadingAuth);
      if (loadingAuth) {
        return <div>Loading...</div>;
      }
      console.log("isLoggedIn", isLoggedIn);

      if (isLoggedIn) {
        return <C {...componentProps} {...props} />;
      }
      return <Redirect to="/login" />;
    },
    [isLoggedIn, componentProps, loadingAuth]
  );

  return <Route {...routeProps} render={handleRender} />;
};
