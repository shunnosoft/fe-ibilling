import axios from "axios";





// const BASE_URL = "http://137.184.69.182/api/";
 

// const user = JSON.parse(localStorage.getItem("persist:root"))?.user;
// const currentUser = user && JSON.parse(user).access;
// const TOKEN = currentUser?.token;

// export const publicRequest = axios.create({
//   baseURL: BASE_URL,
// });

// export const userRequest = axios.create({
//   baseURL: BASE_URL,
//   header: { token: `Bearer ${TOKEN}` },
// });

export default   axios.create({
  baseURL: "http://137.184.69.182/api/",
});