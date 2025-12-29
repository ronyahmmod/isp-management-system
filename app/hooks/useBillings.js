"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

const useBillings = () => {
  const { data, error, isLoading, mutate } = useSWR(
    "/api/billings/list",
    fetcher,
    { refreshInterval: 30000, revalidateOnFocus: true }
  );

  return {
    billings: data?.billings || [],
    loading: isLoading,
    error,
    mutate,
  };
};

export default useBillings;
