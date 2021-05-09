import axios from 'axios';

const DEV_ROUTE = process.env.REACT_APP_DEPLOYED ? "" : "http://localhost:3001";

const API = {
  getCard: function (id) {
    return axios.get(DEV_ROUTE + '/api/cards/' + id)
  },
  getQuestion: function (id) {
    return axios.get(DEV_ROUTE + '/api/questions/' + id)
  },
  getQuestionComplete: function (id) {
    return axios.get(DEV_ROUTE + '/api/questions/complete/' + id)
  },
  saveGameData: function (userId, gameData) {
    return axios.post(DEV_ROUTE + '/api/users/gamehistory/' + userId, gameData);
  }
};

export default API;