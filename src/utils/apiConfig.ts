const API_BASE_URL = "https://voyancechatbackend-production.up.railway.app/"; // Change this as needed for production

export const apiEndpoints = {
  addService: `${API_BASE_URL}/addservice`,
  updateService: `${API_BASE_URL}/updateservice`,
  getServices: `${API_BASE_URL}/getservices`,
  // Add other endpoints as needed
};

export const USER_ROLE_MAP: Record<number, "SEER" | "CLIENT" | "ADMIN"> = {
  1: "CLIENT",
  2: "SEER",
  3: "ADMIN",
};

export const getUserRole = (
  userType: number | undefined
): "SEER" | "CLIENT" | "ADMIN" => {
  return USER_ROLE_MAP[userType ?? 2];
};

export const formatDateForAPI = (
  dateString: string | null | undefined
): string | null => {
  if (!dateString) return null; // Handle null or undefined input

  try {
    const parsedDate = new Date(dateString);

    if (isNaN(parsedDate.getTime())) {
      return null; // Return null if the date is invalid
    }

    return parsedDate.toISOString().split(".")[0]; // Remove microseconds
  } catch (error) {
    return null;
  }
};

export const formatToDateInput = (
  isoDate: string | number | Date | undefined
) => {
  if (!isoDate) return "";
  const date = new Date(isoDate);
  return !isNaN(date.getTime())
    ? date.toISOString().split("T")[0] // Extract only the date part
    : "";
};
