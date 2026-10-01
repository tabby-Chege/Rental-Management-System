 import sampleProperties from "./sampleProperties.json";

const BASE_URL = "https://api.rentcast.io/v1";
const API_KEY = import.meta.env.VITE_RENTCAST_API_KEY;
// When true, no real requests are made and saved sample data is used.
const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

// Remembers results so repeating a search doesn't use another request.
const cache = new Map();

// Shared helper: every API call goes through here.
async function request(path, params = {}) {
  const query = new URLSearchParams(params).toString();
  const url = `${BASE_URL}${path}${query ? `?${query}` : ""}`;

  if (cache.has(url)) return cache.get(url);

  let res;
  try {
    res = await fetch(url, {
      headers: { "X-Api-Key": API_KEY, Accept: "application/json" },
    });
  } catch {
    throw new Error("Network error. Please check your connection.");
  }

  if (res.status === 401) throw new Error("Missing or invalid API key.");
  if (res.status === 429) throw new Error("Too many requests. Try again later.");
  if (!res.ok) throw new Error(`Request failed (${res.status})`);

  const data = await res.json();
  cache.set(url, data);
  return data;
}

// Returns an array of properties for a US city.
// Example: searchProperties("Austin", "TX")
// An empty array means no results; an Error means something went wrong.
export async function searchProperties(city, state, limit = 20) {
  if (USE_MOCK) return sampleProperties;
  return request("/properties", { city, state, limit });
}

// Returns one property by its id, or null if it isn't found (mock mode).
export async function getPropertyById(id) {
  if (USE_MOCK) {
    return sampleProperties.find((property) => property.id === id) ?? null;
  }
  return request(`/properties/${encodeURIComponent(id)}`);
}