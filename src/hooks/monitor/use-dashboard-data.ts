import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

interface Asset {
  id: string;
  name: string;
  status: string;
  location: string;
  // Add other relevant fields
}

interface UseDashboardDataResult {
  assets: Asset[];
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

const ASSETS_API_URL = "/api/dashboard/assets"; // Update with actual endpoint

export function useDashboardData(): UseDashboardDataResult {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchAssets = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(ASSETS_API_URL);
      if (!response.ok) {
        throw new Error("Failed to fetch assets");
      }
      const data = await response.json();
      setAssets(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { assets, loading, error, refetch: fetchAssets };
}
