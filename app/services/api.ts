import axios from "axios";

const API_BASE = "http://192.168.1.5:3000"; // replace

export const fetchArticles = async () => {
  const res = await axios.get(`${API_BASE}/blogs`);
  console.log(res)
  return res.data;
};

export const triggerBackend = async (payload: any) => {
  const res = await axios.post(`${API_BASE}/trigger`, payload);
  return res.data;
};