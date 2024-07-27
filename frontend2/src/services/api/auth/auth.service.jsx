import axiosInstance from "../axios-instance";

// Registers a new user by sending their details to the `/register` endpoint
export const Signup = async (data) => {
  return await axiosInstance.post(`/register`, data);
};

// Authenticates an existing user by sending their credentials to the `/login` endpoint
export const Login = async (data) => {
  return await axiosInstance.post(`/login`, data);
};

// Accesses a protected resource by sending a GET request to the `/protected` endpoint
export const Protected = async () => {
  return await axiosInstance.get(`/protected`);
};
