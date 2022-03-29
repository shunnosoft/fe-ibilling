import axios from 'axios';
import { userLogout } from '../features/actions/authAsyncAction';

// Define the constants
const BASE_URL = "http://137.184.69.182/api/";

export const URL_USER_AUTHENTICATE= "v1/auth/login";
export const URL_REFRESH_TOKEN="v1/auth/refresh-tokens";



export const publicRequest = axios.create({
    baseURL: BASE_URL,
  });



// Define the apiLink as axios
const apiLink = axios.create({
    baseURL: BASE_URL,
    withCredentials:true
});

// Add the interceptor for the response to handle the authentication issues
// This interceptor will check if the response status is 401 and will store the 
// current request. On 401, it will call the refresh token API and try to restore 
// the token. On success, we will post the original request again.
apiLink.interceptors.response.use(function(response) {

    // For success return the response as is
    return response;

},async function(error) {

    // Log the error
    console.log("error :" + JSON.stringify(error));

    // Store the original request
    const originalReq = error.config;

    // Check if the response is having error code as 401
    // and is not a retry (to avoid infinite retries) and 
    // avoid checking on the authenticate URL as it may be due to user
    // entering wrong password.
    if ( error.response.status === 401 && 
         !originalReq._retry && 
         error.response.config.url !== URL_USER_AUTHENTICATE ) {

        // Set the retry flag to true
        originalReq._retry = true;

        // Call the refresh_token API
        return axios.post(BASE_URL+URL_REFRESH_TOKEN,{})
                    .then((res) =>{
                        
                        // If the response is success , then log
                        if ( res.data.status === "success") {

                            // Log the message
                            console.log("token refreshed");

                            // Return the original request. ie. retry
                            return axios(originalReq);

                        } 
                    }).catch((error) => { userLogout()});
    }

    // Log
    console.log("Rest promise error");
    
    // If not matched , then return the error
    return Promise.reject(error);
});

export default  apiLink;