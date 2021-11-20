import axios from 'axios'

export default axios.create({
  baseURL: 'http://localhost:3080',
})

// http://localhost:3030/v1/auth/refresh-tokens/
// http://137.184.69.182/
