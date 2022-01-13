const getState = ({ getStore, getActions, setStore }) => {
  return {
    store: {
      loadingAuth: true,
      isLoggedIn: false,
      credentials: null,
      message: null,
      demo: [
        {
          title: "FIRST",
          background: "white",
          initial: "white",
        },
        {
          title: "SECOND",
          background: "white",
          initial: "white",
        },
      ],
    },
    actions: {
      // Use getActions to call a function within a fuction
      exampleFunction: () => {
        getActions().changeColor(0, "green");
      },
      bootstrapAuth: () => {
        setStore({ loadingAuth: true });
        try {
          const rawCredentials = localStorage.getItem("credentials") || "null";

          const credentials = JSON.parse(rawCredentials);
          console.log("credentials", credentials);
          if (credentials) {
            setStore({ isLoggedIn: true, credentials, loadingAuth: false });
          } else {
            setStore({ loadingAuth: false });
          }
        } catch {
          console.error("not authenticated");
          setStore({ loadingAuth: false });
        }
      },
      getMessage: () => {
        const store = getStore();

        // fetching data from the backend
        fetch(process.env.BACKEND_URL + "/api/hello", {
          headers: {
            "content-type": "application/json",
            Authorization: "Bearer " + store?.credentials?.token || "",
          },
        })
          .then((resp) => resp.json())
          .then((data) => setStore({ message: data.message }))
          .catch((error) => {
            console.log("error", error);
            if (error?.statusCode === 401) {
              window.location.href = "/login";
            }
            console.log("Error loading message from backend", error);
          });
      },
      login: (credentials) => {
        // fetching data from the backend
        return fetch(process.env.BACKEND_URL + "/api/login", {
          headers: {
            "content-type": "application/json",
          },
          method: "POST",
          body: JSON.stringify(credentials),
        })
          .then((resp) => resp.json())
          .then((response) => {
            if (response?.success) {
              setStore({ isLoggedIn: true, credentials: response.credentials });
              localStorage.setItem(
                "credentials",
                JSON.stringify(response.credentials)
              );
            }

            return response;
          });
      },
      logout: () => {
        localStorage.removeItem("credentials");
        setStore({ isLoggedIn: false, credentials: null });
      },
      changeColor: (index, color) => {
        //get the store
        const store = getStore();

        //we have to loop the entire demo array to look for the respective index
        //and change its color
        const demo = store.demo.map((elm, i) => {
          if (i === index) elm.background = color;
          return elm;
        });

        //reset the global store
        setStore({ demo: demo });
      },
    },
  };
};

export default getState;
