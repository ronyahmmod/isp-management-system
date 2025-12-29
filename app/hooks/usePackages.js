"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

export default function usePackages() {
  const { data, error, isLoading, mutate } = useSWR(
    "/api/packages/list",
    fetcher,
    { refreshInterval: 30000, revalidateOnFocus: true }
  );
  return {
    packages: data?.packages || [],
    loading: isLoading,
    error,
    mutate,
  };
}
