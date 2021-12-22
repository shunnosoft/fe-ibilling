import axios from "axios";

export default axios.create({
  baseURL: "http://137.184.69.182/api/",
});

// http://137.184.69.182
// http://localhost:3080

// http://localhost:3030/v1/auth/refresh-tokens/
// /ispOwner/manager
// /ispOwner/reseller
// post /api/v1/auth/logout
// GET /api/v1/ispOwner/manager/:ispOwnerId

// {
//   "name": "Tomal",
//   "mobile": "01705472993",
//   "address": "Santhia",
//   "email": "tomal@gmail.com",
//   "nid": "23434234234"
// }
