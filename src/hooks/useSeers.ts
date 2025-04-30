// src/hooks/useSeers.ts
import { fetchAllSeers } from "@/services/seers";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useSeers = () => {
  return useQuery({
    queryKey: ["allSeers"],
    queryFn: fetchAllSeers,
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error) => {
      if (axios.isAxiosError(error) && !error.response) {
        return false;
      }
      return failureCount < 2;
    },
  });
};
