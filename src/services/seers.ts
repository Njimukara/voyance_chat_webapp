import ApiClient from "@/utils/axiosbase";

export const fetchAllSeers = async () => {
  try {
    const response = await ApiClient.get("/api/seers/");
    if (response.status === 200) {
      return response.data?.results;
    } else {
      return [];
    }
  } catch (error: any) {
    return [];
  }
};
