import { authClient } from "@/lib/auth-client";

const API = process.env.NEXT_PUBLIC_API_URL!;

export type Service = {
  _id: string;
  serviceName: string;
  category: string;
  description: string;
  price: number;
  location: string;
  images: string[];
  status: string;
  isActive: boolean;
  vendor?: { name: string; image?: string; businessName?: string; subscriptionPlan?: string } | null;
};

export async function uploadImage(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("image", file);
  const res = await fetch(`${API}/upload`, { method: "POST", body: fd });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Image upload failed");
  return data.url as string;
}

export async function fetchServices(params: Record<string, string | undefined>): Promise<Service[]> {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v) qs.set(k, v);
  });
  const res = await fetch(`${API}/services?${qs.toString()}`);
  if (!res.ok) throw new Error("Failed to load services");
  return res.json();
}

async function getToken(): Promise<string> {
  const { data, error } = await authClient.token();
  if (error || !data?.token) throw new Error("Please sign in again");
  return data.token;
}

export async function authFetch(path: string, options: RequestInit = {}) {
  const token = await getToken();
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.message || "Request failed");
  return body;
}

export async function fetchService(id: string): Promise<Service> {
  const res = await fetch(`${API}/services/${id}`);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.message || "Service not found");
  return body;
}