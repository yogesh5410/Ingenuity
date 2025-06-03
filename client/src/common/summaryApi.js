export const baseURL = import.meta.env.VITE_API_URL;

const SummaryApi = {
  // Auth & User APIs
  register: {
    url: '/api/user/register',
    method: 'POST',
  },
  login: {
    url: '/api/user/login',
    method: 'POST',
  },
  logout: {
    url: '/api/user/logout',
    method: 'GET',
  },
  resetPassword: {
    url: '/api/user/reset-password',
    method: 'POST',
  },
  userDetails: {
    url: '/api/user/details',
    method: 'GET',
  },

  // Email & ID Verification
  sendEmail: {
    url: '/api/verify/send-otp',
    method: 'POST',
  },
  verifyOtp: {
    url: '/api/verify/verify-otp',
    method: 'POST',
  },
  verifyCfId: {
    url: '/api/verify/codeforces',
    method: 'POST',
  },
  verifyLcId: {
    url: '/api/verify/leetcode',
    method: 'POST',
  },

  // POTD APIs
  createPotd: {
    url: '/api/potd/create',
    method: 'POST',
  },
  getPotd: {
    url: '/api/potd/get',
    method: 'GET',
  },
  updatePotd: {
    url: '/api/potd/update',
    method: 'PUT',
  },

  // Contest API
  getContest: {
    url: '/api/contest/upcoming',
    method: 'GET',
  },

  checkSolved: {
    url: '/api/potd/check-solved',
    method: 'POST',
  },

  getLeaderboard: {
    url: '/api/potd/leaderboard',
    method: 'GET',
  },

  updateProgress: {
    url: '/api/user/progress',
    method: 'PUT',
  },
  uploadImage: {
    url: '/api/file/upload',
    method: 'POST',
  },

  // Event APIs
  getEvents: {
    url: '/api/event/get',
    method: 'GET',
  },
  createEvent: {
    url: '/api/event/create',
    method: 'POST',
  },
  updateEvent: {
    url: '/api/event/update',
    method: 'PUT',
  },
  deleteEvent: {
    url: '/api/event/delete',
    method: 'DELETE',
  },
};

export default SummaryApi;
