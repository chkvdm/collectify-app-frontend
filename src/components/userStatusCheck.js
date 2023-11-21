import Axios from 'axios';
import { decodeToken } from 'react-jwt';

import config from '../config.js';

const userStatusCheck = async (token) => {
  try {
    const userInfo = decodeToken(token);
    const response = await Axios.get(
      `${config.apiBaseUrl}/api/v1/auth/status/${userInfo.id}`
    );
    const { status } = response.data.user;
    if (status === 'active') {
      return true;
    }
    return false;
  } catch (err) {
    console.error(err);
  }
};

export default userStatusCheck;
