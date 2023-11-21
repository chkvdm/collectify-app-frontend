import Axios from 'axios';
import config from '../../config';

const token = localStorage.getItem('collectify:token');
const headers = { Authorization: `Bearer ${token}` };

export const role = ['user', 'admin'];

export const status = ['active', 'blocked'];

export const usersData = async () => {
  try {
    const response = await Axios.get(
      `${config.apiBaseUrl}/api/v1/admin/users`,
      { headers }
    );
    return response.data.users;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
