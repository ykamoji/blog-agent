import axios from "axios";

const API_BASE = "http://192.168.1.3:3000"; // replace

export const fetchArticles = async () => {
  const res = await axios.get(`${API_BASE}/blogs`);
  return res.data;
};

export const triggerBackend = async (payload: { email?: string; hours?: string }) => {
  const res = await axios.post(`${API_BASE}/trigger`, payload);
  return res.data;
};


export const scrapper = async (payload: { email?: string; hours?: string }) => {
  const res = await axios.post(`${API_BASE}/scrapper`, payload);
  return res.data;
};


export const anthropic = async (payload: { email?: string; hours?: string }) => {
  const res = await axios.post(`${API_BASE}/anthropic`, payload);
  return res.data;
};


export const youtube = async (payload: { email?: string; hours?: string }) => {
  const res = await axios.post(`${API_BASE}/youtube`, payload);
  return res.data;
};


export const digest = async (payload: { email?: string; hours?: string }) => {
  const res = await axios.post(`${API_BASE}/digest`, payload);
  return res.data;
};


export const email = async (payload: { email?: string; hours?: string }) => {
  const res = await axios.post(`${API_BASE}/email`, payload);
  return res.data;
};
