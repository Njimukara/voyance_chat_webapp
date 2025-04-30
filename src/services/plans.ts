import ApiClient from "@/utils/axiosbase";

export const fetchPlans = async () => {
  try {
    const response = await ApiClient.get("/api/plans/list");
    if (response.status === 200 && response.data?.results) {
      return response.data.results; // Assuming API returns { results: [...] }
    } else {
      return [];
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des plans:", error);
    return [];
  }
};
