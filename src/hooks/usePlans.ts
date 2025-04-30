// src/hooks/useSeers.ts
import { fetchPlans } from "@/services/plans";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const usePlans = () => {
  return useQuery({
    queryKey: ["plans"],
    queryFn: fetchPlans,
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error) => {
      if (axios.isAxiosError(error) && !error.response) {
        return false;
      }
      return failureCount < 2;
    },
  });
};
