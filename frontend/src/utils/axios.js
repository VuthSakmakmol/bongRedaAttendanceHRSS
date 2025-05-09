import axios from 'axios'

export default axios.create({
  baseURL: 'http://localhost:3001', // Your backend URL
  headers: {
    'Content-Type': 'application/json'
  }
})
