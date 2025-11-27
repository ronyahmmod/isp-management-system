"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

export default function useUsers() {
  const { data, error, isLoading, mutate } = useSWR(
    "/api/users/list",
    fetcher,
    { refreshInterval: 30000, revalidateOnFocus: true }
  );

  return {
    users: data?.users || [],
    loading: isLoading,
    error,
    mutate,
  };
}
