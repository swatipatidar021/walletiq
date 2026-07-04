// Central place to configure the backend API URL.
// - While developing locally, requests go to http://localhost:5000
// - Once deployed, update PRODUCTION_API_URL with your live backend URL
//   (e.g. from Render, Railway, etc.)

const PRODUCTION_API_URL = "https://walletiq-rr6r.onrender.com" ;

const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

export const API_BASE_URL = isLocal ? "http://localhost:5000" : PRODUCTION_API_URL;
