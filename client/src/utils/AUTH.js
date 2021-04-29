import axios from "axios";

const SERVER = process.env.REACT_APP_DEPLOYED ? "" : "http://localhost:3001";

const AUTH = {
  // Gets user info
  getUser: function () {
    return axios.get(`${SERVER}/auth/user`);
  },
  // Logs the user out
  logout: function () {
    return axios.post(`${SERVER}/auth/logout`);
  },
  // Log the user in
  login: function (username, password) {
    return axios.post(`${SERVER}/auth/login`, { username, password });
  },
  // New user registration
  signup: function (userData) {
    return axios.post(`${SERVER}/auth/signup`, userData);
  }
};

export default AUTH;