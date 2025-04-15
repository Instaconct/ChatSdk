import api from "./api";

export const userLogin = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });

  const token = response.data.accessToken;
  localStorage.setItem("token", token);
  return response;
};
