import api from "../api/axios.js";

/** Login API only — token is stored by AuthContext.login() */
export const loginAdmin = async (email, password) => {
  const response = await api.post("/api/admin/login", {
    email,
    password,
  });
  return response.data;
};

/** Student Login API for role toggle on Client side */
export const loginStudent = async (identifier, password) => {
  const response = await api.post("/api/student-auth/login", {
    identifier,
    email: identifier,
    password,
  });
  return response.data;
};

