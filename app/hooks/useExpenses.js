"use client";

import { fetcher } from "@/lib/fetcher";
import useSWR from "swr";

export default function useExpenses() {
  const { data, error, isLoading, mutate } = useSWR(
    "/api/expenses/list",
    fetcher,
    {
      refreshInterval: 30000,
      revalidateOnFocus: true,
    }
  );
  return {
    expenses: data?.expenses || [],
    loading: isLoading,
    error,
    mutate,
  };
}
