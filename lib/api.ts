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
  if (!res.ok) throw new Error("Image upload failed");
  const data = await res.json();
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