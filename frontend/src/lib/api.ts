import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401s by redirecting to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.hash = "#/login";
    }
    return Promise.reject(error);
  }
);

// Auth
export interface LoginResponse {
  token: string;
  user: User;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

export const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const { data } = await api.post("/auth/login", { email, password });
  return data;
};

export const signup = async (user: {
  name: string;
  email: string;
  password: string;
}) => {
  const { data } = await api.post("/auth/signup", user);
  return data;
};

// Groups
export interface Group {
  id: string;
  name: string;
  description?: string;
  adminId: string;
  members: string[];
  createdAt: string;
}

export const getGroups = async (): Promise<Group[]> => {
  const { data } = await api.get("/groups");
  return data;
};

export const getGroup = async (id: string): Promise<Group> => {
  const { data } = await api.get(`/groups/${id}`);
  return data;
};

export const createGroup = async (group: {
  name: string;
  description?: string;
}): Promise<Group> => {
  const { data } = await api.post("/groups", group);
  return data;
};

// Contributions
export interface Contribution {
  id: string;
  groupId: string;
  memberId: string;
  amount: number;
  date: string;
  type: "contribution" | "disbursement";
}

export const getContributions = async (
  groupId: string
): Promise<Contribution[]> => {
  const { data } = await api.get(`/groups/${groupId}/contributions`);
  return data;
};

export const addContribution = async (
  groupId: string,
  contribution: { amount: number; date: string }
): Promise<Contribution> => {
  const { data } = await api.post(
    `/groups/${groupId}/contributions`,
    contribution
  );
  return data;
};

// Members
export const getMembers = async (groupId: string): Promise<User[]> => {
  const { data } = await api.get(`/groups/${groupId}/members`);
  return data;
};

export const addMember = async (
  groupId: string,
  email: string
): Promise<User> => {
  const { data } = await api.post(`/groups/${groupId}/members`, { email });
  return data;
};

// Profile
export const updateProfile = async (updates: Partial<User>): Promise<User> => {
  const { data } = await api.patch("/profile", updates);
  return data;
};

export const getProfile = async (): Promise<User> => {
  const { data } = await api.get("/profile");
  return data;
};

export default api;
