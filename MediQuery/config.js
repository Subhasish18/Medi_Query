// config.js
// Handles API_BASE for dev (LAN IP) and production

const ENV = {
  dev: {
    // use LAN_IP from .env or fallback
    API_BASE: "https://medi-query.onrender.com", // 👈 replace with your LAN IPv4 from ipconfig
  },
  prod: {
    API_BASE: "https://medi-query.onrender.com", // fallback in prod
  },
};

const getEnvVars = () => {
  if (__DEV__) {
    return ENV.dev; // running locally
  }
  return ENV.prod; // production build
};

export default getEnvVars();
