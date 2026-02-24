const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export const getToken = () => localStorage.getItem("giffies_token");

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options?.headers as Record<string, string> || {}),
  };

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  
  // Handle 401 Unauthorized
  if (res.status === 401) {
    localStorage.removeItem("giffies_token");
    localStorage.removeItem("giffies_user");
    window.location.href = "/login";
    throw new Error("Session expired. Please login again.");
  }
  
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || res.statusText);
  }
  return res.json();
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
  category?: string;
}

export interface AuthResponse {
  token: string;
  user: { id: string; name: string; email: string };
}

export interface Order {
  _id: string;
  orderNumber?: string;
  name: string;
  email: string;
  address: string;
  items: { productId?: string; name: string; price: number; quantity: number }[];
  totalAmount: number;
  createdAt: string;
  user?: string;
}

export const api = {
  getProducts: () => request<Product[]>("/api/products"),
  getProduct: (id: string) => request<Product>(`/api/products/${id}`),
  register: (data: { name: string; email: string; password: string }) =>
    request<AuthResponse>("/api/auth/register", { method: "POST", body: JSON.stringify(data) }),
  login: (data: { email: string; password: string }) =>
    request<AuthResponse>("/api/auth/login", { method: "POST", body: JSON.stringify(data) }),
  placeOrder: (orderData: {
    name: string;
    email: string;
    address: string;
    items: { productId: string; name: string; price: number; quantity: number }[];
    totalAmount: number;
  }) =>
    request("/api/orders", { method: "POST", body: JSON.stringify(orderData) }),
  getOrders: () => request<Order[]>("/api/orders", { method: "GET" }),
};
