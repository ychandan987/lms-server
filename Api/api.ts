import axios from "axios";

const API_URL = "http://localhost:3000/api/user"; // adjust to your backend URL

export const getUsers = async () => {
  const res = await axios.get(`${API_URL}`);
  return res.data;
};

export const getUserById = async (id: number) => {
  const res = await axios.get(`${API_URL}/${id}`);
  return res.data;
};

export const addUser = async (data: any) => {
  const res = await axios.post(API_URL, data);
  return res.data;
};

export const updateUser = async (id: number, data: any) => {
  const res = await axios.put(`${API_URL}/${id}`, data);
  return res.data;
};

export const deleteUser = async (id: number) => {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data;
};

export const getGroup = async () => {
  const res = await axios.get(`${API_URL}`);
  return res.data;
};

export const getGroupById = async (id: number) => {
  const res = await axios.get(`${API_URL}/${id}`);
  return res.data;
};

export const createGroup = async (data: any) => {
  const res = await axios.post(`${API_URL}` , data);
  return res.data;
};

export const updateGroup = async (id: number, data: any) => {
  const res = await axios.put(`${API_URL}/${id}`, data);
  return res.data;
};

export const deleteGroup = async (id: number) => {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data;
};