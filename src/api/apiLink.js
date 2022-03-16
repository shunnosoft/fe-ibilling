import axios from "axios";
import jwt_decode from "jwt-decode";

// const BASE_URL = "http://137.184.69.182/api/";

const BASE_URL = "http://192.168.1.24:3030/api/";

// const BASE_URL = "http://localhost:3030/api/";

// const user = JSON.parse(localStorage.getItem("persist:root"))?.currentUser;
// const access = user && JSON.parse(user)?.access;
// const TOKEN = access?.token;

// const userAllData = JSON.parse(localStorage.getItem("persist:root"));

const user = JSON.parse(localStorage.getItem("persist:root"))?.auth;

// const currentUser = user && JSON.parse(user)?.currentUser;
// const TOKEN = currentUser?.access?.token;

const TOKEN = user && JSON.parse(user)?.accessToken;

export const publicRequest = axios.create({
  baseURL: BASE_URL,
});

const apiLink = axios.create({
  baseURL: BASE_URL,
  headers: { Authorization: "Bearer " + TOKEN },
});
export default apiLink;
// const refreshToken = async () => {
//   console.log("check from refresh start");
//   try {
//     const res = await publicRequest.post("v1/auth/refresh-tokens");
//     console.log("from inside refresh ", res.data)
//     localStorage.setItem(
//       "persist:root",
//       JSON.stringify({
//         ...userAllData,
//         auth: { ...userAllData.auth, accessToken: res.data?.access.token },
//       })
//     );

//     return res.data?.access.token;
//   } catch (err) {
//     console.log(err);
//   }
// };

// // const axiosJWT = axios.create()

// apiLink.interceptors.request.use(
//   async (config) => {
//     let currentDate = new Date();
//     const decodedToken = jwt_decode(TOKEN);

//     if (decodedToken.exp * 1000 < currentDate.getTime()) {
//       const accToken = await refreshToken();
//       console.log("from inside interceptors",accToken)
//       config.baseURL = BASE_URL;
//       config.headers["authorization"] = "Bearer " + accToken;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// export default apiLink;

// update token
// update token
// const updateToken = useCallback(async () => {
//   try {
//   const response = await apiLink("v1/auth/­refresh-tokens", {
//   method: "POST",
//   });
//   if (response.status === 200) {
//   console.log("We got the Token: ", response);
//   // set new token to localstorage
//   //­ localStorage.setItem("t­oken", JSON.stringify(respo­nse.data));
//   } else {
//   // call logout method here
//   // userLogout()
//   }
//   } catch (err) {
//   console.log("Should Logout!");
//   // call logout method here
//   // userLogout();
//   }
//   if (loading) {
//   setLoading(false);
//   }
//   }, [loading]);

//   // called Update Token
//   useEffect(() => {
//   if (loading) {
//   updateToken();
//   }
//   const token = JSON.parse(localStor­age.getItem("token")­);
//   const timeToUpdate = 1000 * 60 * 12;
//   const interval = setInterval(() => {
//   if (token) {
//   updateToken();
//   }
//   }, timeToUpdate);
//   return () => clearInterval(interv­al);
//   }, [loading, updateToken]);
