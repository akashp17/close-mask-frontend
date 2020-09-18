import axios from 'axios';

var baseURL;

switch (process.env.NODE_ENV) {
  case 'production':
    baseURL = 'https://mask.closecheckout.com/api';
    // baseURL = 'https://mask.letsdooit.in/api';
    break;
  default:
    baseURL = 'http://localhost:5000/api';
}

export default axios.create({
  baseURL,
  withCredentials: true,
});
