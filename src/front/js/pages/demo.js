import React, { useState, useContext, useCallback } from "react";
import { useHistory } from "react-router-dom";

import { Context } from "../store/appContext";

export const Demo = () => {
  const history = useHistory();
  const { store, actions } = useContext(Context);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState("");
  const [errors, setErrors] = useState([]);
  const [password, setPassword] = useState("");

  const isValidForm = useCallback(() => {
    const errors = [];

    if (!user) {
      errors.push("user es requerido");
    }

    if (!password) {
      errors.push("la contraseña es requerido");
    }

    setErrors(errors);

    return !errors.length;
  }, [user, password]);

  const handleOnSubmit = useCallback(
    (event) => {
      event.preventDefault();
      if (isValidForm()) {
        setLoading(true);
        actions
          .login({ user, password })
          .then((response) => {
            console.log("response", response);
            if (response?.success) {
              history.replace("/home");
            }
          })
          .catch((error) => {
            console.log(error);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    },
    [user, errors, password, actions]
  );

  return (
    <div className="container">
      <form onSubmit={handleOnSubmit}>
        <div>
          {errors.map((error, index) => (
            <li key={`error-item-${index}`}>{error}</li>
          ))}
        </div>
        <label htmlFor="user"> Usuario: </label>
        <input
          type="text"
          name="user"
          value={user}
          onChange={(e) => setUser(e.target.value)}
        />
        <label htmlFor="password"> Contraseña: </label>
        <input
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button>Login</button>
      </form>
      {loading && "loading..."}
    </div>
  );
};
