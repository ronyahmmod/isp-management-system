"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

export default function useCustomers() {
  const { data, error, isLoading, mutate } = useSWR(
    "/api/customers/list",
    fetcher,
    { refreshInterval: 30000, revalidateOnFocus: true }
  );

  return {
    customers: data?.customers || [],
    loading: isLoading,
    error,
    mutate,
  };
}
