export const API_HOST =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8000"
    : "http://backend:8000";
