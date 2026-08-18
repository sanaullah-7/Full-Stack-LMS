import api from "../api/axios.js";

/** Login API only — token is stored by AuthContext.login() */
export const loginAdmin = async (email, password) => {
  const response = await api.post("/api/admin/login", {
    email,
    password,
  });
  return response.data;
};
