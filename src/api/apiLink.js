import axios from "axios";

const BASE_URL = "http://137.184.69.182/api/";

// const user = JSON.parse(localStorage.getItem("persist:root"))?.currentUser;
// const access = user && JSON.parse(user)?.access;
// const TOKEN = access?.token;

const user = JSON.parse(localStorage.getItem("persist:root"))?.auth;
const currentUser = user && JSON.parse(user)?.currentUser;
const TOKEN = currentUser?.access?.token;

export const publicRequest = axios.create({
  baseURL: BASE_URL,
});



export default axios.create({
  baseURL: BASE_URL,
  headers: {'Authorization': 'Bearer '+TOKEN}
});





// const refreshToken = async () => {
//   try {
//     const res = await axios.post("/refresh", { token: user.refreshToken });
//     setUser({
//       ...user,
//       accessToken: res.data.accessToken,
//       refreshToken: res.data.refreshToken,
//     });
//     return res.data;
//   } catch (err) {
//     console.log(err);
//   }
// };

// const axiosJWT = axios.create()

// axiosJWT.interceptors.request.use(
//   async (config) => {
//     let currentDate = new Date();
//     const decodedToken = jwt_decode(user.accessToken);
//     if (decodedToken.exp * 1000 < currentDate.getTime()) {
//       const data = await refreshToken();
//       config.headers["authorization"] = "Bearer " + data.accessToken;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

 
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
  