export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5455";
export const API_VERSION = "v1";
export const API_BASE_PATH = `/api/${API_VERSION}`;
export const API_FULL_URL = `${API_URL}${API_BASE_PATH}`;
